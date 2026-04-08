import fs from 'fs';
import path from 'path';

const root = path.join(process.cwd(), '.agents');
let hasErrors = false;

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, out);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(fullPath);
    }
  }
  return out;
}

function extractFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  return match ? match[1] : null;
}

function validateFrontmatterStyle(filePath, frontmatter) {
  const issues = [];

  const foldedOrLiteral = frontmatter.match(/^\w[\w-]*:\s*[>|]-\s*$/m);
  if (foldedOrLiteral) {
    issues.push('Uso de >- ou |- não permitido em atributos de frontmatter.');
  }

  const blockArrayTopLevel = frontmatter.match(/^\w[\w-]*:\s*\n\s*-\s+/m);
  if (blockArrayTopLevel) {
    issues.push('Arrays no frontmatter devem ser inline: [item1, item2].');
  }

  const blockArrayNested = frontmatter.match(/^\s{2}\w[\w-]*:\s*\n\s{4}-\s+/m);
  if (blockArrayNested) {
    issues.push('Arrays aninhados no frontmatter devem ser inline.');
  }

  const blockMapTopLevel = frontmatter.match(/^\w[\w-]*:\s*\n\s{2}\w[\w-]*:\s+/m);
  if (blockMapTopLevel) {
    issues.push('Objetos no frontmatter devem ser inline: { chave: valor }.');
  }

  if (issues.length > 0) {
    console.error(`❌ [${path.relative(process.cwd(), filePath)}]`);
    for (const issue of issues) {
      console.error(`   - ${issue}`);
    }
    hasErrors = true;
  }
}

if (!fs.existsSync(root)) {
  console.error('❌ Diretório .agents não encontrado.');
  process.exit(1);
}

const files = walk(root);

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const frontmatter = extractFrontmatter(text);
  if (!frontmatter) continue;
  validateFrontmatterStyle(file, frontmatter);
}

if (hasErrors) {
  console.error('\n🚨 Frontmatter fora do padrão inline detectado.');
  process.exit(1);
}

console.log('✅ Frontmatter inline validado com sucesso em .agents/**/*.md');
