import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contractScore, measureSkill } from "./benchmark-skills.mjs";

const skillsRoot = path.resolve(fileURLToPath(import.meta.url), "../../skills");

test("a body with no house-contract headings scores zero", () => {
  assert.equal(contractScore("# Title\n\nUse it when needed.\n"), 0);
});

test("every skill in this catalog meets the full house contract", () => {
  // The contract is what validate-agents enforces; the benchmark must agree,
  // or the head-to-head would misreport our own column.
  for (const name of ["code-review", "test-engineering", "software-architecture"]) {
    assert.equal(measureSkill(path.join(skillsRoot, name)).contract, 7, name);
  }
});
