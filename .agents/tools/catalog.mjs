import fs from "node:fs";
import path from "node:path";
import { listSkills } from "./skill-metadata.mjs";

export const CATALOG_START = "<!-- skill-catalog:start -->";
export const CATALOG_END = "<!-- skill-catalog:end -->";

function summarize(description) {
  const normalized = description.replace(/\s+/g, " ").trim();
  const useFor = normalized.match(/\bUse for (.+?)(?:\.$|$)/i)?.[1];
  return useFor ?? normalized.split(".")[0];
}

export function renderCatalog(skills) {
  const rows = skills.map(
    ({ name, metadata }) => `| \`${name}\` | ${summarize(metadata.description)} |`,
  );
  return [
    CATALOG_START,
    "| Skill | Use it for |",
    "|---|---|",
    ...rows,
    CATALOG_END,
  ].join("\n");
}

export function replaceCatalog(readme, catalog) {
  const pattern = new RegExp(`${CATALOG_START}[\\s\\S]*?${CATALOG_END}`);
  if (!pattern.test(readme)) {
    throw new Error("README is missing skill catalog markers");
  }
  return readme.replace(pattern, catalog);
}

export function loadCatalog(root = process.cwd()) {
  return renderCatalog(listSkills(path.join(root, ".agents", "skills")));
}

export function writeCatalog(root = process.cwd()) {
  const readmePath = path.join(root, "README.md");
  const readme = fs.readFileSync(readmePath, "utf8");
  fs.writeFileSync(readmePath, replaceCatalog(readme, loadCatalog(root)));
}
