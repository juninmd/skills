import fs from 'node:fs';
import path from 'node:path';
import { AGENTS_DIR, walkFiles } from './lib/catalog.mjs';
import { extractFrontmatterRaw, findInlineStyleIssues } from './lib/frontmatter.mjs';

let hasErrors = false;

if (!fs.existsSync(AGENTS_DIR)) {
  console.error('.agents directory is missing.');
  process.exit(1);
}

for (const filePath of walkFiles(AGENTS_DIR, (_, name) => name.endsWith('.md'))) {
  const rawFrontmatter = extractFrontmatterRaw(fs.readFileSync(filePath, 'utf8'));
  if (!rawFrontmatter) {
    continue;
  }

  const issues = findInlineStyleIssues(rawFrontmatter);
  if (!issues.length) {
    continue;
  }

  hasErrors = true;
  console.error(path.relative(process.cwd(), filePath));
  for (const issue of issues) {
    console.error(`  - ${issue}`);
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log('Validated inline frontmatter style.');
