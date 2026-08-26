// Local mirror of the lychee link check the CI workflow runs.
//
// CI caught broken links; `pnpm run validate` did not, so the two disagreed and
// a red gate only surfaced after a push. This resolves every relative Markdown
// link over the same file set, offline. External URLs are CI's job — they need
// the network and go stale for reasons a local run cannot fix.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Kept in step with the `files:` list in .github/workflows/validate.yml.
export const LINK_ROOTS = [
  "README.md",
  "docs",
  ".agents/AGENTS.md",
  ".agents/agents",
  ".agents/prompts",
  ".agents/skills",
];

const SKIP_DIRECTORIES = new Set(["node_modules", "dist", ".vitepress"]);

export function collectMarkdown(roots, cwd = process.cwd()) {
  const files = [];
  const walk = (target) => {
    const stats = fs.statSync(target);
    if (stats.isFile()) {
      if (target.endsWith(".md")) files.push(target);
      return;
    }
    for (const entry of fs.readdirSync(target)) {
      if (SKIP_DIRECTORIES.has(entry)) continue;
      walk(path.join(target, entry));
    }
  };
  for (const root of roots) {
    const resolved = path.resolve(cwd, root);
    if (fs.existsSync(resolved)) walk(resolved);
  }
  return files;
}

export function findBrokenLinks(files) {
  const broken = [];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const target = match[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target)) continue;
      const withoutAnchor = target.split("#")[0];
      if (!withoutAnchor) continue;
      const resolved = path.resolve(path.dirname(file), decodeURIComponent(withoutAnchor));
      // `--fallback-extensions md` in CI: a link may omit the .md suffix.
      if (fs.existsSync(resolved) || fs.existsSync(`${resolved}.md`)) continue;
      broken.push({ file, target });
    }
  }
  return broken;
}

function main() {
  const files = collectMarkdown(LINK_ROOTS);
  const broken = findBrokenLinks(files);
  if (broken.length) {
    console.error(
      broken
        .map(({ file, target }) => `ERROR: ${path.relative(process.cwd(), file)} -> ${target}`)
        .join("\n"),
    );
    process.exit(1);
  }
  console.log(`${files.length} Markdown files, no broken relative links.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
