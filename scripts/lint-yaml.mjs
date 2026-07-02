import fs from 'node:fs';
import path from 'node:path';
import { parseAllDocuments } from 'yaml';
import { ROOT_DIR, walkFiles } from './lib/catalog.mjs';

let hasErrors = false;
let checkedFiles = 0;
let skippedFiles = 0;

for (const filePath of walkFiles(ROOT_DIR, (_, name) => name.endsWith('.yml') || name.endsWith('.yaml'))) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  if (relativePath.startsWith('node_modules') || relativePath.startsWith('coverage')) {
    continue;
  }

  const text = fs.readFileSync(filePath, 'utf8');
  if (
    relativePath.includes(`${path.sep}resources${path.sep}templates${path.sep}`) ||
    relativePath.includes(`${path.sep}assets${path.sep}`) ||
    text.includes('{{') ||
    text.includes('```')
  ) {
    skippedFiles += 1;
    continue;
  }

  if (text.includes('\t')) {
    hasErrors = true;
    console.error(`[${relativePath}] YAML must use spaces instead of tabs.`);
  }

  checkedFiles += 1;
  for (const document of parseAllDocuments(text, { prettyErrors: true })) {
    for (const error of document.errors) {
      hasErrors = true;
      const line = error.linePos?.[0]?.line ?? '?';
      const column = error.linePos?.[0]?.col ?? '?';
      console.error(`[${relativePath}:${line}:${column}] ${error.message}`);
    }
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log(`Validated ${checkedFiles} YAML file(s) (${skippedFiles} skipped).`);
