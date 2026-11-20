// Local mirror of the lychee link check the CI workflow runs.
//
// CI caught broken links; `pnpm run validate` did not, so the two disagreed and
// a red gate only surfaced after a push. This resolves every relative Markdown
// link over the same file set, offline. External URLs are CI's job — they need
// the network and go stale for reasons a local run cannot fix.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walkFiles } from "./walk-files.mjs";

// Kept in step with the `files:` list in .github/workflows/validate.yml.
export const LINK_ROOTS = [
  "README.md",
  "docs",
  ".agents/AGENTS.md",
  ".agents/skills",
];

const SKIP_DIRECTORIES = new Set(["node_modules", "dist", ".vitepress"]);

// Symlinks are skipped, not followed: this walks the same kind of tree
// check-domains.mjs scans (a symlink install of the skills catalog), and
// following one here with no cycle guard could recurse forever.
export function collectMarkdown(roots, cwd = process.cwd()) {
  return walkFiles(roots, { cwd, skip: SKIP_DIRECTORIES, filter: (file) => file.endsWith(".md") });
}

// lychee does not check links in code: a Markdown example inside a fence must not fail the run.
function stripCode(text) {
  return text
    .replace(/^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?(?:^ {0,3}\1[ \t]*$|(?![\s\S]))/gm, "")
    .replace(/(`+)[^`\n][\s\S]*?\1/g, "");
}

function decodePath(target) {
  try {
    return decodeURIComponent(target);
  } catch {
    return null; // malformed %-escape: report it as broken instead of aborting every file
  }
}

export function findBrokenLinks(files) {
  const broken = [];
  for (const file of files) {
    const text = stripCode(fs.readFileSync(file, "utf8"));
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const target = match[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target)) continue;
      const withoutAnchor = target.split("#")[0];
      if (!withoutAnchor) continue;
      const decoded = decodePath(withoutAnchor);
      if (decoded === null) {
        broken.push({ file, target });
        continue;
      }
      const resolved = path.resolve(path.dirname(file), decoded);
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
