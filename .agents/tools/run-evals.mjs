// Routing evals for the skill catalog.
//
// Every skill declares the prompts it must win (`positive`) and the prompts it
// must lose to a named sibling (`negative`). The runner scores those prompts
// against the tier-1 catalog and fails when routing regresses. It is fully
// deterministic and offline: no model, no network, no API key, so it belongs in
// CI next to the other validators rather than in a nightly job someone pays for.
//
//   node .agents/tools/run-evals.mjs .agents [--check] [--min-rank1 <pct>] [--json]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listSkills } from "./skill-metadata.mjs";
import { buildIndex, rankSkills, descriptionCollisions } from "./skill-router.mjs";

export const DEFAULT_TOP_K = 3;
export const MIN_POSITIVE_PROMPTS = 3;
export const MIN_NEGATIVE_PROMPTS = 2;
// Two descriptions this close are competing for the same prompts.
export const COLLISION_WARN = 0.45;
export const COLLISION_ERROR = 0.7;
// A rank-1 win by a hair is a coin flip once a real model is in the loop.
export const FRAGILE_MARGIN = 0.5;

export function loadCases(evalsRoot) {
  if (!fs.existsSync(evalsRoot)) return [];
  return fs
    .readdirSync(evalsRoot)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const source = path.join(evalsRoot, file);
      try {
        return { file, data: JSON.parse(fs.readFileSync(source, "utf8")) };
      } catch (error) {
        return { file, parseError: error.message };
      }
    });
}

export function evaluate(skills, cases, { topK = DEFAULT_TOP_K } = {}) {
  const errors = [];
  const warnings = [];
  const index = buildIndex(
    skills.map((skill) => ({ name: skill.name, description: skill.description })),
  );
  const known = new Set(skills.map((skill) => skill.name));

  // --- coverage: a skill with no eval is a skill nobody has checked -----------
  const covered = new Set();
  for (const entry of cases) {
    if (entry.parseError) {
      errors.push(`${entry.file}: invalid JSON: ${entry.parseError}`);
      continue;
    }
    const expected = entry.file.replace(/\.json$/, "");
    const declared = entry.data?.skill_name;
    if (declared !== expected) {
      errors.push(`${entry.file}: skill_name '${declared}' must equal the file name`);
      continue;
    }
    if (!known.has(declared)) {
      errors.push(`${entry.file}: no skill named '${declared}' exists`);
      continue;
    }
    covered.add(declared);
  }
  for (const skill of skills) {
    if (!covered.has(skill.name)) {
      errors.push(`${skill.name}: missing routing evals at .agents/evals/${skill.name}.json`);
    }
  }

  // --- routing ---------------------------------------------------------------
  const results = [];
  const margins = [];
  let positiveTotal = 0;
  let rank1Total = 0;

  for (const entry of cases) {
    if (entry.parseError || !covered.has(entry.data?.skill_name)) continue;
    const owner = entry.data.skill_name;
    const positives = entry.data.trigger?.positive ?? [];
    const negatives = entry.data.trigger?.negative ?? [];

    if (positives.length < MIN_POSITIVE_PROMPTS) {
      errors.push(`${owner}: needs at least ${MIN_POSITIVE_PROMPTS} positive prompts`);
    }
    if (negatives.length < MIN_NEGATIVE_PROMPTS) {
      errors.push(`${owner}: needs at least ${MIN_NEGATIVE_PROMPTS} negative prompts`);
    }

    let ownRank1 = 0;
    for (const positive of positives) {
      const prompt = typeof positive === "string" ? positive : positive.prompt;
      const limit = (typeof positive === "object" && positive.top_k) || topK;
      const ranked = rankSkills(prompt, index);
      const rank = ranked.findIndex((row) => row.name === owner) + 1;
      positiveTotal += 1;

      if (rank === 1) {
        rank1Total += 1;
        ownRank1 += 1;
        const margin = ranked[0].score - (ranked[1]?.score ?? 0);
        margins.push(margin);
        if (margin < FRAGILE_MARGIN) {
          warnings.push(
            `${owner}: wins '${truncate(prompt)}' by only ${margin.toFixed(2)} over ${ranked[1]?.name}`,
          );
        }
      } else if (rank === 0 || rank > limit) {
        errors.push(
          `${owner}: '${truncate(prompt)}' ranks ${rank || "unranked"} (needs top ${limit}); ` +
            `winner was '${ranked[0].name}'`,
        );
      }
      results.push({ owner, prompt, rank, winner: ranked[0].name });
    }

    for (const negative of negatives) {
      const prompt = typeof negative === "string" ? negative : negative.prompt;
      const expectedOwner = typeof negative === "object" ? negative.owner : undefined;
      if (expectedOwner && !known.has(expectedOwner)) {
        errors.push(`${owner}: negative prompt names unknown skill '${expectedOwner}'`);
        continue;
      }
      const ranked = rankSkills(prompt, index);
      if (ranked[0].name === owner) {
        errors.push(
          `${owner}: must not win '${truncate(prompt)}'` +
            (expectedOwner ? ` (belongs to '${expectedOwner}')` : ""),
        );
      }
    }

    // A skill that never wins any of its own prompts is unreachable: the agent
    // pays for its description on every turn and can never select it.
    if (positives.length && ownRank1 === 0) {
      errors.push(`${owner}: unreachable — never ranks first for any of its own prompts`);
    }
  }

  // --- collisions ------------------------------------------------------------
  for (const pair of descriptionCollisions(skills)) {
    if (pair.similarity >= COLLISION_ERROR) {
      errors.push(
        `${pair.left} and ${pair.right}: descriptions are ${pair.similarity.toFixed(2)} similar; merge or differentiate them`,
      );
    } else if (pair.similarity >= COLLISION_WARN) {
      warnings.push(
        `${pair.left} and ${pair.right}: descriptions are ${pair.similarity.toFixed(2)} similar`,
      );
    }
  }

  const rank1Rate = positiveTotal ? rank1Total / positiveTotal : 0;
  const meanMargin = margins.length
    ? margins.reduce((sum, value) => sum + value, 0) / margins.length
    : 0;

  return {
    errors,
    warnings,
    results,
    stats: {
      skills: skills.length,
      positivePrompts: positiveTotal,
      rank1: rank1Total,
      rank1Rate,
      meanMargin,
      minMargin: margins.length ? Math.min(...margins) : 0,
    },
  };
}

const truncate = (text, max = 56) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

export function runFromDisk(agentsRoot) {
  const skills = listSkills(path.join(agentsRoot, "skills")).map((skill) => ({
    name: skill.name,
    description: String(skill.metadata.description ?? "").trim(),
  }));
  return evaluate(skills, loadCases(path.join(agentsRoot, "evals")));
}

function main() {
  const args = process.argv.slice(2);
  const flag = (name) => {
    const at = args.indexOf(name);
    return at === -1 ? undefined : args[at + 1];
  };
  const agentsRoot = path.resolve(args.find((arg) => !arg.startsWith("--")) ?? ".agents");
  const minRank1 = Number(flag("--min-rank1") ?? 0);
  const report = runFromDisk(agentsRoot);

  if (args.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    const { stats } = report;
    console.log(
      `routing: ${stats.rank1}/${stats.positivePrompts} prompts rank the owning skill first ` +
        `(${(stats.rank1Rate * 100).toFixed(1)}%) across ${stats.skills} skills`,
    );
    console.log(
      `margin: mean ${stats.meanMargin.toFixed(2)}, min ${stats.minMargin.toFixed(2)} ` +
        `(below ${FRAGILE_MARGIN} is a fragile win)`,
    );
    for (const warning of report.warnings) console.log(`WARN: ${warning}`);
  }

  if (minRank1 && report.stats.rank1Rate * 100 < minRank1) {
    report.errors.push(
      `rank-1 rate ${(report.stats.rank1Rate * 100).toFixed(1)}% is below the ${minRank1}% ratchet`,
    );
  }

  if (report.errors.length) {
    console.error(report.errors.map((error) => `ERROR: ${error}`).join("\n"));
    process.exit(1);
  }
  if (args.includes("--check")) console.log("Routing evals OK.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
