// Head-to-head benchmark: the most-installed public skills against the skill in
// this catalog that owns the same job.
//
// benchmark-catalogs.mjs compares whole catalogs; this script compares single
// skills. Like it, it is not part of `pnpm run validate`: it clones from the
// network and the leaderboard moves. Results feed docs/benchmark.md.
//
//   node .agents/tools/benchmark-skills.mjs            # clone + measure
//   node .agents/tools/benchmark-skills.mjs --no-clone # reuse cached clones
//   node .agents/tools/benchmark-skills.mjs --json
//
// Method notes:
//   - Install counts are a skills.sh all-time leaderboard snapshot (INSTALLS_AS_OF),
//     copied by hand; the script does not fetch them.
//   - "contract" counts the seven house-contract parts (AGENTS.md) a SKILL.md
//     has. It is this repository's standard, not a universal quality score.
//   - "route" feeds the competitor's own description to this catalog's offline
//     BM25 router and reports the rank of the owner we mapped it to. Rank 1
//     means a user asking for that job lands on our owner.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listSkills } from "./skill-metadata.mjs";
import { buildIndex, rankSkills } from "./skill-router.mjs";
import { readFrontmatter } from "./benchmark-catalogs.mjs";

export const INSTALLS_AS_OF = "2026-10-23";

// [repo, path to the skill directory inside it, installs, our owner]
export const PAIRS = [
  ["mattpocock/skills", "skills/engineering/improve-codebase-architecture", "1.2M", "software-architecture"],
  ["mattpocock/skills", "skills/engineering/tdd", "1.1M", "test-engineering"],
  ["mattpocock/skills", "skills/productivity/handoff", "1.0M", "starting-dev"],
  ["anthropics/skills", "skills/frontend-design", "1.0M", "frontend-engineering"],
  ["mattpocock/skills", "skills/engineering/triage", "988K", "requirements-planning"],
  ["mattpocock/skills", "skills/engineering/prototype", "985K", "starting-dev"],
  ["mattpocock/skills", "skills/engineering/domain-modeling", "875K", "software-architecture"],
  ["mattpocock/skills", "skills/engineering/codebase-design", "848K", "software-architecture"],
  ["mattpocock/skills", "skills/engineering/diagnosing-bugs", "833K", "observability"],
  ["vercel-labs/agent-skills", "skills/react-best-practices", "833K", "frontend-engineering"],
  ["heygen-com/hyperframes", "skills/hyperframes", "1.2M", "motion-video"],
  ["mattpocock/skills", "skills/engineering/code-review", "n/a", "code-review"],
  ["anthropics/skills", "skills/skill-creator", "n/a", "skill-authoring"],
  ["obra/superpowers", "skills/test-driven-development", "n/a", "test-engineering"],
  ["obra/superpowers", "skills/systematic-debugging", "n/a", "observability"],
  ["obra/superpowers", "skills/writing-plans", "n/a", "requirements-planning"],
  ["obra/superpowers", "skills/finishing-a-development-branch", "n/a", "finishing-dev"],
];

const estimateTokens = (text) => Math.ceil(text.length / 4);

export const CONTRACT = {
  preflight: (body) => /^##\s+Preflight\b/m.test(body),
  numberedWorkflow: (body) => /^##\s+Workflow\b[\s\S]*?^1\.\s/m.test(body),
  decisionTable: (body) => /^\|.*\|\s*$\n^\|\s*:?-{3,}/m.test(body),
  commandBlock: (body) => /^```(?:bash|sh|shell|powershell|pwsh|console)\b/m.test(body),
  stop: (body) => /^##\s+(?:Stop|When to stop)\b/im.test(body),
  rules: (body) => /^##\s+Rules\b/m.test(body),
  checklist: (body) => /^##+\s*Checklist\s*$/m.test(body),
};

export function contractScore(body) {
  return Object.values(CONTRACT).filter((test) => test(body)).length;
}

function countFiles(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (entry.isFile() && entry.name !== "SKILL.md") total += 1;
  }
  return total;
}

export function measureSkill(dir) {
  const text = fs.readFileSync(path.join(dir, "SKILL.md"), "utf8");
  const parsed = readFrontmatter(text);
  const name = parsed?.fields.name ?? path.basename(dir);
  const description = parsed?.description ?? "";
  const body = parsed?.body ?? text;
  return {
    name,
    description,
    tier1: estimateTokens(`${name}: ${description}`),
    tier2: estimateTokens(body),
    files: countFiles(dir),
    contract: contractScore(body),
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
  const skillsRoot = path.join(repoRoot, ".agents", "skills");
  const ours = listSkills(skillsRoot).map((skill) => ({
    name: skill.name,
    description: String(skill.metadata.description ?? "").trim(),
  }));
  const index = buildIndex(ours);

  const rows = [];
  for (const [repo, skillPath, installs, owner] of PAIRS) {
    const root = args.includes("--no-clone") ? path.join(workspace, repo.replace("/", "_")) : clone(repo, workspace);
    const dir = root && path.join(root, skillPath);
    if (!dir || !fs.existsSync(path.join(dir, "SKILL.md"))) {
      console.error(`WARN: ${repo}/${skillPath} not found; skipping`);
      continue;
    }
    const theirs = measureSkill(dir);
    const mine = measureSkill(path.join(skillsRoot, owner));
    const ranking = rankSkills(theirs.description, index);
    rows.push({
      skill: `${repo.split("/")[0]}/${theirs.name}`,
      installs,
      owner,
      theirs: { tier1: theirs.tier1, tier2: theirs.tier2, files: theirs.files, contract: theirs.contract },
      ours: { tier1: mine.tier1, tier2: mine.tier2, files: mine.files, contract: mine.contract },
      routeRank: ranking.findIndex((entry) => entry.name === owner) + 1,
      routeTop: ranking[0]?.name,
    });
  }

  if (args.includes("--json")) {
    console.log(JSON.stringify({ installsAsOf: INSTALLS_AS_OF, rows }, null, 2));
    return;
  }

  const pad = (value, width) => String(value).padEnd(width);
  const num = (value, width) => String(value).padStart(width);
  const pair = (left, right) => `${left}/${right}`;
  console.log(
    pad("skill", 44) + num("inst", 6) + pad("  owner", 25) + num("t1 t/o", 10) + num("t2 t/o", 12) +
      num("files", 8) + num("contract", 10) + num("route", 7),
  );
  for (const row of rows) {
    console.log(
      pad(row.skill, 44) + num(row.installs, 6) + pad(`  ${row.owner}`, 25) +
        num(pair(row.theirs.tier1, row.ours.tier1), 10) + num(pair(row.theirs.tier2, row.ours.tier2), 12) +
        num(pair(row.theirs.files, row.ours.files), 8) + num(pair(row.theirs.contract, row.ours.contract), 10) +
        num(row.routeRank || "-", 7),
    );
  }
  const top1 = rows.filter((row) => row.routeRank === 1).length;
  console.log(`\nroute rank 1: ${top1}/${rows.length}; installs from skills.sh as of ${INSTALLS_AS_OF}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
