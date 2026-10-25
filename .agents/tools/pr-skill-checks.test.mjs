import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execFileSync } from "node:child_process";
import {
  checkCompleteness,
  formatCommentBody,
  getChangedSkillFiles,
  getTouchedSkills,
  runPrSkillChecks,
} from "./pr-skill-checks.mjs";

test("getChangedSkillFiles throws clear error on missing git base ref", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "pr-check-git-"));
  execFileSync("git", ["init"], { cwd: rootDir });

  assert.throws(
    () => getChangedSkillFiles("nonexistent-base-12345", rootDir),
    (err) => {
      return err instanceof Error && err.message.startsWith("git diff failed:");
    },
  );
});

test("getTouchedSkills extracts unique skill names from file paths", () => {
  const files = [
    ".agents/skills/alpha-skill/SKILL.md",
    ".agents/skills/alpha-skill/references/doc.md",
    ".agents/skills/beta-skill/SKILL.md",
  ];
  assert.deepEqual(getTouchedSkills(files), ["alpha-skill", "beta-skill"]);
});

test("checkCompleteness detects missing SKILL.md, missing eval file, and missing README catalog entry", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "pr-check-completeness-"));

  // 1. Setup incomplete skill: new-skill with SKILL.md but no eval and no catalog entry
  const newSkillDir = path.join(rootDir, ".agents", "skills", "new-skill");
  fs.mkdirSync(newSkillDir, { recursive: true });
  fs.writeFileSync(path.join(newSkillDir, "SKILL.md"), "# New Skill");

  // Create empty README
  fs.writeFileSync(path.join(rootDir, "README.md"), "# Skills Catalog\n");

  const errors = checkCompleteness(["new-skill"], rootDir);
  assert.equal(errors.length, 2);
  assert.ok(errors.some((e) => e.includes("missing eval file at .agents/evals/new-skill.json")));
  assert.ok(errors.some((e) => e.includes("missing from README catalog")));

  // 2. Setup skill missing SKILL.md
  const missingSkillDir = path.join(rootDir, ".agents", "skills", "missing-skill");
  fs.mkdirSync(missingSkillDir, { recursive: true });
  const missingErrors = checkCompleteness(["missing-skill"], rootDir);
  assert.ok(missingErrors.some((e) => e.includes("missing SKILL.md")));

  // 3. Complete skill passes with 0 errors
  const completeSkillDir = path.join(rootDir, ".agents", "skills", "complete-skill");
  fs.mkdirSync(completeSkillDir, { recursive: true });
  fs.writeFileSync(path.join(completeSkillDir, "SKILL.md"), "# Complete Skill");

  const evalsDir = path.join(rootDir, ".agents", "evals");
  fs.mkdirSync(evalsDir, { recursive: true });
  fs.writeFileSync(path.join(evalsDir, "complete-skill.json"), "{}\n");

  fs.writeFileSync(
    path.join(rootDir, "README.md"),
    "| `complete-skill` | Use it for testing |\n",
  );

  assert.deepEqual(checkCompleteness(["complete-skill"], rootDir), []);
});

test("formatCommentBody escapes backticks in filenames and truncates list over 30 files", () => {
  const filesWithBacktick = [
    ".agents/skills/my-`skill`/SKILL.md",
  ];
  const bodyWithEscaped = formatCommentBody(filesWithBacktick, []);
  assert.match(bodyWithEscaped, /- \`\.agents\/skills\/my-'skill'\/SKILL.md\`/);

  const thirtyFiveFiles = Array.from({ length: 35 }, (_, i) => `.agents/skills/skill-${i}/SKILL.md`);
  const truncatedBody = formatCommentBody(thirtyFiveFiles, []);
  assert.match(truncatedBody, /Changed skill files: 35/);
  assert.match(truncatedBody, /- \`\.agents\/skills\/skill-0\/SKILL.md\`/);
  assert.match(truncatedBody, /- \`\.agents\/skills\/skill-29\/SKILL.md\`/);
  assert.match(truncatedBody, /- \.\.\. e mais 5/);
  assert.doesNotMatch(truncatedBody, /- \`\.agents\/skills\/skill-30\/SKILL.md\`/);
});

test("formatCommentBody formats completeness warnings with ⚠", () => {
  const body = formatCommentBody(
    [".agents/skills/bad-skill/SKILL.md"],
    ["Skill 'bad-skill' is missing eval file at .agents/evals/bad-skill.json"],
  );
  assert.match(body, /⚠ Skill 'bad-skill' is missing eval file at .agents\/evals\/bad-skill.json/);
});

test("runPrSkillChecks end-to-end writes pr-comment.md and reports status", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "pr-check-e2e-"));

  // Initialize git repo with initial commit
  execFileSync("git", ["init"], { cwd: rootDir });
  execFileSync("git", ["config", "user.name", "Test"], { cwd: rootDir });
  execFileSync("git", ["config", "user.email", "test@example.com"], { cwd: rootDir });

  const skillDir = path.join(rootDir, ".agents", "skills", "test-skill");
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, "SKILL.md"), "# Test Skill");
  fs.writeFileSync(path.join(rootDir, "README.md"), "# Catalog\n");

  execFileSync("git", ["add", "."], { cwd: rootDir });
  execFileSync("git", ["commit", "-m", "initial"], { cwd: rootDir });

  // Create branch with missing eval
  execFileSync("git", ["checkout", "-b", "feature"], { cwd: rootDir });
  fs.writeFileSync(path.join(skillDir, "SKILL.md"), "# Test Skill Updated");
  execFileSync("git", ["commit", "-am", "update skill"], { cwd: rootDir });

  const result = runPrSkillChecks({ rootDir, baseRef: "HEAD^" });
  assert.equal(result.success, false);
  assert.ok(result.errors.length > 0);

  const commentFile = path.join(rootDir, "pr-comment.md");
  assert.ok(fs.existsSync(commentFile));
  const commentContent = fs.readFileSync(commentFile, "utf8");
  assert.match(commentContent, /## Skill checks/);
  assert.match(commentContent, /⚠ Skill 'test-skill'/);
});
