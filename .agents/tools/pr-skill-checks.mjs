import fs from "node:fs";
import { execFileSync } from "node:child_process";

const base = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "HEAD^";
let changed = [];

try {
  changed = execFileSync("git", ["diff", "--name-only", `${base}...HEAD`, "--", ".agents/skills"], {
    encoding: "utf8",
  })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
} catch {
  changed = [];
}

const body = [
  "## Skill checks",
  "",
  changed.length ? `Changed skill files: ${changed.length}` : "No skill files changed.",
  ...changed.slice(0, 30).map((file) => `- \`${file}\``),
].join("\n");

fs.writeFileSync("pr-comment.md", `${body}\n`);
console.log(body);
