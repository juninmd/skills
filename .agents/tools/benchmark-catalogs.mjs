// Measure this catalog against other public skill catalogs.
//
// The numbers in docs/benchmark.md come from this script. It is deliberately
// not part of `pnpm run validate`: it clones from the network, takes minutes,
// and the competitive landscape is not a build invariant. Run it when you want
// to refresh the report.
//
//   node .agents/tools/benchmark-catalogs.mjs            # clone + measure
//   node .agents/tools/benchmark-catalogs.mjs --no-clone # measure existing clones
//   node .agents/tools/benchmark-catalogs.mjs --json
//
// Method notes that matter for reading the output:
//   - SKILL.md files are deduplicated by content hash. Several catalogs mirror
//     the same skills into .claude/, .gemini/, .codex-plugin/ and so on; counting
//     those twice would inflate them by up to 3x.
//   - Tier 1 is `name + description`, the part an agent pays for on every turn.
//   - Tier 2 is the SKILL.md body, paid only once the skill is selected.

import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const CATALOGS = [
  "anthropics/skills",
  "obra/superpowers",
  "affaan-m/ECC",
  "mattpocock/skills",
  "addyosmani/agent-skills",
  "wshobson/agents",
  "github/awesome-copilot",
  "sickn33/agentic-awesome-skills",
  "K-Dense-AI/scientific-agent-skills",
  "alirezarezvani/claude-skills",
  "OthmanAdi/planning-with-files",
  "Jeffallan/claude-skills",
  "NVIDIA/SkillSpector",
  "microsoft/SkillOpt",
  "deanpeters/Product-Manager-Skills",
];

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const estimateTokens = (text) => Math.ceil(text.length / 4);
const digest = (value) => crypto.createHash("sha256").update(value).digest("hex");

function walk(root, files = [], depth = 0) {
  if (depth > 9) return files;
  let entries;
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const target = path.join(root, entry.name);
    let stats;
    try {
      stats = fs.statSync(target);
    } catch {
      continue; // broken symlink
    }
    if (stats.isDirectory()) walk(target, files, depth + 1);
    else files.push(target);
  }
  return files;
}

// A tolerant reader: these are other people's files, and several of them are
// not valid YAML. Parse what we can rather than throwing the catalog away.
export function readFrontmatter(text) {
  const match = text.match(FRONTMATTER);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z][A-Za-z0-9_-]*):(.*)$/);
    if (pair) fields[pair[1]] = pair[2].trim();
  }
  let description = fields.description ?? "";
  if (/^[|>]/.test(description)) {
    const rest = match[1].split(/^description:.*$/m)[1] ?? "";
    description = (rest.split(/\n(?=[A-Za-z][A-Za-z0-9_-]*:)/)[0] ?? "").trim();
  }
  return { fields, description, body: text.slice(match[0].length) };
}

export function measure(label, root) {
  const files = walk(root);
  const seen = new Set();
  const descriptions = [];
  const bodies = [];
  let skills = 0;
  let mirrored = 0;
  let tier1 = 0;
  let withChecklist = 0;
  let overLongDescription = 0;
  let angleBrackets = 0;
  const fieldUse = new Map();

  for (const file of files) {
    if (path.basename(file) !== "SKILL.md") continue;
    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const hash = digest(text);
    if (seen.has(hash)) {
      mirrored += 1;
      continue;
    }
    seen.add(hash);
    const parsed = readFrontmatter(text);
    if (!parsed) continue;

    skills += 1;
    for (const key of Object.keys(parsed.fields)) {
      fieldUse.set(key, (fieldUse.get(key) ?? 0) + 1);
    }
    descriptions.push(parsed.description.length);
    if (parsed.description.length > 1024) overLongDescription += 1;
    if (/[<>]/.test(parsed.description)) angleBrackets += 1;
    if (/^##+\s*Checklist\s*$/m.test(parsed.body)) withChecklist += 1;
    tier1 += estimateTokens(`${parsed.fields.name ?? ""}: ${parsed.description}`);
    bodies.push(estimateTokens(parsed.body));
  }

  const uniqueFiles = (predicate) => {
    const hashes = new Set();
    for (const file of files.filter(predicate)) {
      try {
        hashes.add(digest(fs.readFileSync(file)));
      } catch {
        /* unreadable */
      }
    }
    return hashes.size;
  };

  const divisor = skills || 1;
  const median = (values) =>
    values.length ? [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)] : 0;

  return {
    catalog: label,
    skills,
    mirroredCopies: mirrored,
    tier1Tokens: tier1,
    tier1PerSkill: Math.round(tier1 / divisor),
    tier2PerSkill: Math.round(bodies.reduce((sum, value) => sum + value, 0) / divisor),
    tier2Max: Math.max(0, ...bodies),
    medianDescription: median(descriptions),
    checklistPercent: Math.round((withChecklist / divisor) * 100),
    overLongDescription,
    angleBrackets,
    referenceFiles: uniqueFiles((file) => /\/references?\//.test(file) && file.endsWith(".md")),
    evalFiles: uniqueFiles((file) => /\/evals?\//i.test(file)),
    testFiles: uniqueFiles(
      (file) => /\.(test|spec)\.(mjs|js|ts)$/.test(file) || /^test_.*\.py$/.test(path.basename(file)),
    ),
    frontmatterFields: [...fieldUse.entries()]
      .sort((left, right) => right[1] - left[1])
      .map(([key, count]) => `${key}(${count})`),
  };
}

function clone(slug, into) {
  const target = path.join(into, slug.replace("/", "_"));
  if (fs.existsSync(target)) return target;
  try {
    execFileSync("git", ["clone", "--depth", "1", "--quiet", `https://github.com/${slug}.git`, target], {
      stdio: "ignore",
      timeout: 300_000,
    });
    return target;
  } catch {
    console.error(`WARN: could not clone ${slug}; skipping`);
    return null;
  }
}

function main() {
  const args = process.argv.slice(2);
  const workspace = path.join(os.tmpdir(), "skill-catalog-benchmark");
  fs.mkdirSync(workspace, { recursive: true });

  const repoRoot = path.resolve(fileURLToPath(import.meta.url), "../../..");
  const rows = [measure("juninmd/skills (this)", repoRoot)];

  for (const slug of CATALOGS) {
    const target = args.includes("--no-clone")
      ? path.join(workspace, slug.replace("/", "_"))
      : clone(slug, workspace);
    if (target && fs.existsSync(target)) rows.push(measure(slug, target));
  }

  rows.sort((left, right) => right.skills - left.skills);

  if (args.includes("--json")) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }

  const pad = (value, width) => String(value).padEnd(width);
  const num = (value, width) => String(value).padStart(width);
  console.log(
    pad("catalog", 36) + num("skills", 7) + num("tier1", 8) + num("t1/sk", 7) +
      num("t2/sk", 7) + num("t2max", 7) + num("chk%", 6) + num("evals", 7) + num("mirror", 8),
  );
  for (const row of rows) {
    console.log(
      pad(row.catalog, 36) + num(row.skills, 7) + num(row.tier1Tokens, 8) +
        num(row.tier1PerSkill, 7) + num(row.tier2PerSkill, 7) + num(row.tier2Max, 7) +
        num(row.checklistPercent, 6) + num(row.evalFiles, 7) + num(row.mirroredCopies, 8),
    );
  }
  console.log(`\nclones cached in ${workspace} (delete to refresh)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
