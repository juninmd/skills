import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export function getChangedSkillFiles(baseRef, rootDir = process.cwd()) {
  const base = baseRef
    ? (baseRef.startsWith("origin/") || baseRef.startsWith("HEAD") || baseRef.includes("/") ? baseRef : `origin/${baseRef}`)
    : "HEAD^";
  try {
    const output = execFileSync(
      "git",
      ["diff", "--name-only", `${base}...HEAD`, "--", ".agents/skills"],
      { encoding: "utf8", cwd: rootDir, stdio: ["ignore", "pipe", "pipe"] },
    );
    return output
      .trim()
      .split(/\r?\n/)
      .filter(Boolean);
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString().trim() : "";
    const msg = stderr || error.message || String(error);
    throw new Error(`git diff failed: ${msg}`);
  }
}

export function getTouchedSkills(changedFiles) {
  const skills = new Set();
  for (const file of changedFiles) {
    const normalized = file.replaceAll("\\", "/");
    const match = normalized.match(/^\.agents\/skills\/([^/]+)/);
    if (match) {
      skills.add(match[1]);
    }
  }
  return Array.from(skills).sort();
}

export function checkCompleteness(touchedSkills, rootDir = process.cwd()) {
  const errors = [];
  const readmePath = path.join(rootDir, "README.md");
  const readmeContent = fs.existsSync(readmePath)
    ? fs.readFileSync(readmePath, "utf8")
    : "";

  for (const skill of touchedSkills) {
    const skillFile = path.join(rootDir, ".agents", "skills", skill, "SKILL.md");
    const evalFile = path.join(rootDir, ".agents", "evals", `${skill}.json`);

    if (!fs.existsSync(skillFile)) {
      errors.push(`Skill '${skill}' is missing SKILL.md`);
    }

    if (!fs.existsSync(evalFile)) {
      errors.push(`Skill '${skill}' is missing eval file at .agents/evals/${skill}.json`);
    }

    if (!readmeContent.includes(`| \`${skill}\` |`)) {
      errors.push(`Skill '${skill}' is missing from README catalog`);
    }
  }

  return errors;
}

export function formatCommentBody(changedFiles, completenessErrors = []) {
  const escapedFiles = changedFiles.map((file) => file.replaceAll("`", "'"));
  const displayed = escapedFiles.slice(0, 30).map((file) => `- \`${file}\``);
  if (escapedFiles.length > 30) {
    displayed.push(`- ... e mais ${escapedFiles.length - 30}`);
  }

  const lines = [
    "## Skill checks",
    "",
    changedFiles.length
      ? `Changed skill files: ${changedFiles.length}`
      : "No skill files changed.",
    ...displayed,
  ];

  if (completenessErrors.length > 0) {
    lines.push("");
    for (const err of completenessErrors) {
      lines.push(`⚠ ${err}`);
    }
  }

  return lines.join("\n");
}

export function runPrSkillChecks(options = {}) {
  const rootDir = options.rootDir ?? process.cwd();
  const baseRef = options.baseRef ?? process.env.GITHUB_BASE_REF;

  const changedFiles = getChangedSkillFiles(baseRef, rootDir);
  const touchedSkills = getTouchedSkills(changedFiles);
  const completenessErrors = checkCompleteness(touchedSkills, rootDir);

  const body = formatCommentBody(changedFiles, completenessErrors);
  fs.writeFileSync(path.join(rootDir, "pr-comment.md"), `${body}\n`);
  console.log(body);

  if (completenessErrors.length > 0) {
    for (const err of completenessErrors) {
      console.error(`ERROR: ${err}`);
    }
    return { success: false, errors: completenessErrors, changedFiles };
  }

  return { success: true, errors: [], changedFiles };
}

function main() {
  try {
    const result = runPrSkillChecks();
    if (!result.success) {
      process.exit(1);
    }
  } catch (error) {
    console.error(error.message || String(error));
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
