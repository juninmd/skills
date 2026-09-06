import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listSkills } from "./skill-metadata.mjs";

// Chars/4 approximates GPT/Claude BPE for English technical prose.
export const estimateTokens = (text) => Math.ceil(text.length / 4);

// Tier 1 is loaded for every conversation; keep the whole catalog cheap.
// The global ceiling bounds the always-loaded index; it is a ratchet, moved
// 4300 -> 4400 -> 4500 -> 5100 -> 5250 -> 5350 as the catalog grew from 65 to 83 skills. The
// per-skill ceiling below is what keeps that honest: the catalog may grow by
// adding skills, never by letting individual descriptions get fatter.
export const TIER1_BUDGET = 5350;
export const TIER1_PER_SKILL_BUDGET = 100;
// Tier 2 loads on activation, so depth here costs nothing until a skill is
// picked. This is where a skill earns the right not to be generic.
export const TIER2_BUDGET = 1650;

export function buildReport(agentsRoot) {
  const skills = listSkills(path.join(agentsRoot, "skills"));
  const rows = skills.map((skill) => {
    const description = String(skill.metadata.description ?? "");
    const referencesRoot = path.join(path.dirname(skill.file), "references");
    let referenceTokens = 0;
    let referenceFiles = 0;
    if (fs.existsSync(referencesRoot)) {
      for (const entry of fs.readdirSync(referencesRoot, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
        referenceFiles += 1;
        referenceTokens += estimateTokens(
          fs.readFileSync(path.join(referencesRoot, entry.name), "utf8"),
        );
      }
    }
    return {
      name: skill.name,
      tier1: estimateTokens(`${skill.name}: ${description.trim()}`),
      tier2: estimateTokens(skill.text),
      referenceFiles,
      referenceTokens,
    };
  });

  return { rows, tier1Total: rows.reduce((sum, row) => sum + row.tier1, 0) };
}

export function checkBudgets(report) {
  const errors = [];
  if (report.tier1Total > TIER1_BUDGET) {
    errors.push(
      `tier-1 catalog costs ~${report.tier1Total} tokens, over the ${TIER1_BUDGET}-token budget`,
    );
  }
  for (const row of report.rows) {
    if (row.tier1 > TIER1_PER_SKILL_BUDGET) {
      errors.push(
        `${row.name}: description costs ~${row.tier1} tier-1 tokens, over the ${TIER1_PER_SKILL_BUDGET}-token per-skill budget`,
      );
    }
    if (row.tier2 > TIER2_BUDGET) {
      errors.push(
        `${row.name}: SKILL.md costs ~${row.tier2} tokens, over the ${TIER2_BUDGET}-token budget`,
      );
    }
  }
  return errors;
}

function main() {
  const check = process.argv.includes("--check");
  const agentsRoot = path.resolve(
    process.argv.filter((arg) => arg !== "--check")[2] ?? ".agents",
  );
  const report = buildReport(agentsRoot);

  const pad = (value, width) => String(value).padStart(width);
  console.log("skill                      tier1  tier2   refs  ref-tokens");
  for (const row of report.rows) {
    console.log(
      `${row.name.padEnd(26)}${pad(row.tier1, 6)}${pad(row.tier2, 7)}${pad(row.referenceFiles, 7)}${pad(row.referenceTokens, 12)}`,
    );
  }
  console.log(
    `tier-1 total ~${report.tier1Total}/${TIER1_BUDGET} tokens ` +
      `(${TIER1_PER_SKILL_BUDGET} per skill); tier-2 budget ${TIER2_BUDGET} tokens per skill.`,
  );

  if (check) {
    const errors = checkBudgets(report);
    if (errors.length) {
      console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
      process.exit(1);
    }
    console.log("Token budgets OK.");
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();