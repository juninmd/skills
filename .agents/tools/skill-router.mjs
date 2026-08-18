// Deterministic, offline model of how an agent picks a skill from the catalog.
//
// At tier 1 an agent sees only `name` + `description` for every skill and has to
// choose. That choice is the single highest-leverage property of a catalog: a
// skill that never wins is dead weight, and two skills that both half-win send
// the agent down the wrong procedure. This module scores that choice with plain
// lexical retrieval so the property is testable in CI without a model, a network
// call, or an API key.
//
// It is a proxy, not a simulation. A real agent reads far more signal than word
// overlap. What the proxy reliably catches is the failure it is aimed at:
// descriptions that do not contain the vocabulary a user would actually type.

const STOP = new Set([
  "a", "about", "after", "all", "also", "an", "and", "any", "are", "as", "at",
  "be", "been", "before", "but", "by", "can", "do", "does", "for", "from",
  "get", "has", "have", "help", "how", "i", "if", "in", "into", "is", "it",
  "its", "just", "me", "my", "need", "needs", "not", "of", "on", "one", "or",
  "our", "out", "over", "should", "so", "some", "that", "the", "their", "them",
  "then", "there", "these", "they", "this", "to", "up", "use", "want", "was",
  "we", "what", "when", "which", "why", "will", "with", "would", "you", "your",
]);

// Light suffix stripping. Not a real stemmer: it only has to make the obvious
// inflections of one word collide ("migrations" -> "migrat", "caching" -> "cach").
export function stem(token) {
  let t = token;
  let stripped = false;
  for (const suffix of ["ations", "ation", "ically", "ally", "ings", "ing", "ed", "es", "al"]) {
    if (t.length > suffix.length + 2 && t.endsWith(suffix)) {
      t = t.slice(0, -suffix.length);
      stripped = true;
      break;
    }
  }
  if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) t = t.slice(0, -1);
  if (t.length > 4 && t.endsWith("e")) t = t.slice(0, -1);
  // "committ" -> "commit", left behind by stripping -ing/-ed. Only after a real
  // strip, so a word that simply ends in a double letter ("skill") survives.
  if (stripped && t.length > 4 && t.at(-1) === t.at(-2) && !"aeiou".includes(t.at(-1))) {
    t = t.slice(0, -1);
  }
  // "flaky"/"flakier" and "simplify"/"simplifies" should cluster.
  if (t.length > 3 && t.endsWith("y")) t = `${t.slice(0, -1)}i`;
  return t;
}

export function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, " ")
    .split(/[\s/-]+/)
    .filter((token) => token.length > 2 && !STOP.has(token))
    .map(stem);
}

function termFrequency(tokens) {
  const counts = new Map();
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
  return counts;
}

/**
 * Build the retrieval index over what the agent actually sees at tier 1.
 * The skill name is weighted because a name is a deliberate, high-signal label.
 */
export function buildIndex(skills, { nameWeight = 2 } = {}) {
  const docs = new Map();
  for (const { name, description } of skills) {
    const nameTokens = tokenize(name);
    const tokens = [
      ...Array.from({ length: nameWeight }, () => nameTokens).flat(),
      ...tokenize(description),
    ];
    docs.set(name, { tf: termFrequency(tokens), length: tokens.length });
  }

  const documentFrequency = new Map();
  for (const { tf } of docs.values()) {
    for (const term of tf.keys()) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }

  const total = docs.size || 1;
  const averageLength =
    [...docs.values()].reduce((sum, doc) => sum + doc.length, 0) / total;

  const idf = (term) => {
    const df = documentFrequency.get(term) ?? 0;
    // BM25 probabilistic idf, floored so a term present in every document still
    // contributes a little instead of going negative.
    return Math.max(0.05, Math.log(1 + (total - df + 0.5) / (df + 0.5)));
  };

  return { docs, idf, averageLength };
}

/**
 * BM25 ranking of every skill against a user prompt. BM25 beats plain cosine
 * here because skill descriptions are short and length-normalized scoring stops
 * the wordiest description from winning every prompt.
 */
export function rankSkills(prompt, index, { k1 = 1.2, b = 0.75 } = {}) {
  const queryTerms = termFrequency(tokenize(prompt));
  const scores = [];
  for (const [name, doc] of index.docs) {
    let score = 0;
    for (const [term, queryCount] of queryTerms) {
      const frequency = doc.tf.get(term);
      if (!frequency) continue;
      const norm = 1 - b + (b * doc.length) / (index.averageLength || 1);
      score += queryCount * index.idf(term) * ((frequency * (k1 + 1)) / (frequency + k1 * norm));
    }
    scores.push({ name, score });
  }
  // Ties break by name so a run is reproducible regardless of catalog order.
  scores.sort((left, right) => right.score - left.score || left.name.localeCompare(right.name));
  return scores;
}

function tfidfVector(doc, idf) {
  const vector = new Map();
  for (const [term, frequency] of doc.tf) vector.set(term, frequency * idf(term));
  return vector;
}

function cosine(left, right) {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (const [term, weight] of left) {
    leftNorm += weight * weight;
    const other = right.get(term);
    if (other) dot += weight * other;
  }
  for (const weight of right.values()) rightNorm += weight * weight;
  if (!leftNorm || !rightNorm) return 0;
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

/**
 * Every pair of skill descriptions, most similar first. Two descriptions that
 * look alike to this scorer look alike to a router: one of them will lose every
 * time, and the catalog pays tier-1 tokens for a skill that never gets picked.
 */
export function descriptionCollisions(skillsOrIndex) {
  // Compare the descriptions alone. Weighting the name here would let two
  // skills with identical descriptions score low just because they are called
  // different things — exactly the case this check exists to catch.
  const index = Array.isArray(skillsOrIndex)
    ? buildIndex(skillsOrIndex, { nameWeight: 0 })
    : skillsOrIndex;
  const vectors = [...index.docs.entries()].map(([name, doc]) => [
    name,
    tfidfVector(doc, index.idf),
  ]);
  const pairs = [];
  for (let i = 0; i < vectors.length; i += 1) {
    for (let j = i + 1; j < vectors.length; j += 1) {
      pairs.push({
        left: vectors[i][0],
        right: vectors[j][0],
        similarity: cosine(vectors[i][1], vectors[j][1]),
      });
    }
  }
  return pairs.sort((left, right) => right.similarity - left.similarity);
}
