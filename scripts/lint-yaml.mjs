import fs from 'node:fs';
import path from 'node:path';
import { parseAllDocuments } from 'yaml';

const rootDir = process.cwd();
const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'coverage']);
const yamlFiles = [];
let skippedFiles = 0;
let hasErrors = false;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(rootDir, fullPath);

    if (entry.isDirectory()) {
      if (
        ignoredDirs.has(entry.name) ||
        relativePath.startsWith('apps/docs/docs/.vitepress/cache') ||
        relativePath.startsWith('apps/docs/docs/.vitepress/dist')
      ) {
        continue;
      }
      walk(fullPath);
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith('.yml') || entry.name.endsWith('.yaml'))) {
      yamlFiles.push(fullPath);
    }
  }
}

walk(rootDir);

for (const filePath of yamlFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);

  // Ignore templated/docs snippets that intentionally are not strict YAML.
  if (
    relativePath.includes('/resources/templates/') ||
    relativePath.includes('/exemplo/') ||
    content.includes('{{') ||
    content.includes('```')
  ) {
    skippedFiles += 1;
    continue;
  }

  if (content.includes('\t')) {
    console.error(`❌ [${relativePath}] Contém tab; use espaços em YAML.`);
    hasErrors = true;
  }

  const docs = parseAllDocuments(content, { prettyErrors: true });
  for (const doc of docs) {
    if (doc.errors.length > 0) {
      hasErrors = true;
      for (const err of doc.errors) {
        const line = err.linePos?.[0]?.line ?? '?';
        const col = err.linePos?.[0]?.col ?? '?';
        console.error(`❌ [${relativePath}:${line}:${col}] ${err.message}`);
      }
    }
  }
}

if (hasErrors) {
  console.error('\n🚨 YAML lint encontrou problemas.');
  process.exit(1);
}

console.log(`✅ YAML lint concluído com sucesso em ${yamlFiles.length - skippedFiles} arquivo(s) (${skippedFiles} ignorado(s)).`);
