import fs from "node:fs";
import path from "node:path";
import { collectMarkdown } from "./check-links.mjs";

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A procedure link is valid; a call to its former skill name is no longer executable.
export function findRetiredHandoffs(text, migrations) {
  const errors = [];
  let fence;
  for (const [index, source] of text.split(/\r?\n/).entries()) {
    const marker = source.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1][0];
      else if (marker[1][0] === fence) fence = undefined;
      continue;
    }
    const line = source.replace(/\[[^\]]*\]\([^)]+\)/g, "").replace(/https?:\/\/\S+/g, "");
    for (const [name, owner] of Object.entries(migrations)) {
      const token = escapeRegExp(name);
      const invocation = new RegExp(`(?<![\\w/.-])[/$]${token}(?![\\w/-]|\\.\\w)`);
      const bare = new RegExp(`(?<![\\w/.-])${token}(?![\\w/-]|\\.\\w)`);
      if (invocation.test(line) || (!fence && bare.test(line))) {
        errors.push({ name, owner, line: index + 1 });
      }
    }
  }
  return errors;
}

export function checkRetiredHandoffs(agentsRoot) {
  const migrationFile = path.join(agentsRoot, "retired-skills.json");
  if (!fs.existsSync(migrationFile)) return [];
  let migrations;
  try {
    migrations = JSON.parse(fs.readFileSync(migrationFile, "utf8"));
  } catch (error) {
    return [`retired-skills.json: ${error.message}`];
  }
  if (!migrations || typeof migrations !== "object" || Array.isArray(migrations)) {
    return ["retired-skills.json: expected a retired-name to owner object"];
  }
  const errors = [];
  for (const [name, owner] of Object.entries(migrations)) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || typeof owner !== "string" ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(owner)) {
      errors.push(`retired-skills.json: invalid migration '${name}'`);
      continue;
    }
    if (!fs.existsSync(path.join(agentsRoot, "skills", owner, "SKILL.md"))) {
      errors.push(`retired-skills.json: '${name}' has missing owner '${owner}'`);
    }
    if (fs.existsSync(path.join(agentsRoot, "skills", name, "SKILL.md"))) {
      errors.push(`retired-skills.json: '${name}' is still an active skill`);
    }
  }
  const files = collectMarkdown(["AGENTS.md", "agents", "skills"], agentsRoot);
  for (const file of files) {
    for (const { name, owner, line } of findRetiredHandoffs(fs.readFileSync(file, "utf8"), migrations)) {
      errors.push(`${path.relative(agentsRoot, file)}:${line}: retired skill '${name}'; link its procedure or route to '${owner}'`);
    }
  }
  return errors;
}
