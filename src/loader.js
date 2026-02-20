#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const AGENTS_DIR = path.join(ROOT, '.agent');
const DOCS_DIR = path.join(ROOT, 'docs');

const CATEGORIES = ['agents', 'skills', 'rules', 'hooks', 'workflows'];
// Base URLs for GitLab
const REPO_BASE_URL = 'https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/tree/main/.agent';
const RAW_BASE_URL = 'https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/-/raw/main/.agent';
const EDIT_BASE_URL = 'https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/-/edit/main/.agent';

function generateInstallCommands(category, item, isDirectory = false) {
  const commands = {};
  const gitRepoHttpUrl = 'https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents';
  const itemName = isDirectory ? item : path.basename(item, path.extname(item));
  const itemPath = isDirectory ? item : path.basename(item);

  // SKILLS
  if (category === 'skills') {
    commands.gemini = `mkdir -p ~/.gemini/skills && cp -r .agent/skills/${item} ~/.gemini/skills/`;
    commands.copilot = `mkdir -p ~/.copilot/skills && cp -r .agent/skills/${item} ~/.copilot/skills/`;
    commands.antigravity = `mkdir -p ~/.gemini/antigravity/skills && cp -r .agent/skills/${item} ~/.gemini/antigravity/skills/`;
  }
  // RULES
  else if (category === 'rules') {
    commands.copilot = `mkdir -p ~/.copilot/rules && cp -r .agent/rules/${item} ~/.copilot/rules/`;
    commands.antigravity = `mkdir -p ~/.gemini/antigravity/rules && cp -r .agent/rules/${item} ~/.gemini/antigravity/rules/`;
    // Gemini CLI: sem suporte para rules
  }
  // WORKFLOWS
  else if (category === 'workflows') {
    commands.copilot = `mkdir -p ~/.copilot/workflows && cp -r .agent/workflows/${item} ~/.copilot/workflows/`;
    commands.antigravity = `mkdir -p ~/.gemini/antigravity/workflows && cp -r .agent/workflows/${item} ~/.gemini/antigravity/workflows/`;
    // Gemini CLI: sem suporte para workflows
  }
  // HOOKS (apenas Gemini CLI)
  else if (category === 'hooks') {
    commands.gemini = 'Configure hooks: ~/.gemini/settings.json (see https://geminicli.com/docs/hooks/)';
    // Copilot e Antigravity não suportam hooks diretamente
  }
  // AGENTS (mantém como está)
  else if (category === 'agents') {
    commands.gemini = `gemini rules add ${gitRepoHttpUrl} --path .agent/agents/${itemPath}`;
    commands.copilot = `copilot rules add ${gitRepoHttpUrl} --path .agent/agents/${itemPath}`;
    commands.antigravity = `antigravity rules add ${gitRepoHttpUrl} --path .agent/agents/${itemPath}`;
  }

  return commands;
}

function formatTitle(name) {
  return name
    .replace(/\.[^/.]+$/, "") // remove extension
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const TITLE_ACRONYMS = {
  ai: 'IA',
  api: 'API',
  ci: 'CI',
  cd: 'CD',
  cli: 'CLI',
  devops: 'DevOps',
  qa: 'QA',
  ui: 'UI',
  ux: 'UX',
  seo: 'SEO',
  iot: 'IoT',
  mcp: 'MCP',
  sdk: 'SDK',
  k8s: 'K8s',
  llm: 'LLM',
  gcp: 'GCP',
  aws: 'AWS'
};

const TITLE_STOP_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'para', 'com']);
const TITLE_CATEGORY_SUFFIXES = new Set(['skill', 'skills', 'rule', 'rules', 'workflow', 'workflows', 'agent', 'agents', 'hook', 'hooks']);

function isSlugLikeTitle(value) {
  if (!value) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  return /^[a-z0-9]+([_-][a-z0-9]+)+$/.test(trimmed) || /^[a-z0-9-_.]+$/.test(trimmed);
}

function normalizeTitleToken(word, index) {
  const clean = word.trim();
  if (!clean) return '';

  const lower = clean.toLowerCase();
  if (TITLE_ACRONYMS[lower]) {
    return TITLE_ACRONYMS[lower];
  }

  if (TITLE_STOP_WORDS.has(lower) && index > 0) {
    return lower;
  }

  if (/^[A-Z0-9]{2,}$/.test(clean)) {
    return clean;
  }

  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function normalizeItemTitle(rawTitle, itemId, category) {
  const fallback = (itemId || '').replace(/\.[^/.]+$/, '').trim();
  let source = (rawTitle || '').trim();

  if (!source) source = fallback;

  source = source
    .replace(/^\s*(skill|rule|workflow|agent|hook)\s*:\s*/i, '')
    .replace(/\.[^/.]+$/, '')
    .trim();

  source = source.replace(/\s+(skill|skills|rule|rules|workflow|workflows|agent|agents|hook|hooks)$/i, '').trim();

  const shouldTransform = isSlugLikeTitle(source) || source.toLowerCase() === fallback.toLowerCase();

  if (!shouldTransform) {
    return source;
  }

  let words = source
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  while (words.length > 1) {
    const lastWord = words[words.length - 1].toLowerCase();
    if (TITLE_CATEGORY_SUFFIXES.has(lastWord) && (category !== 'skills' || lastWord !== 'skills')) {
      words.pop();
      continue;
    }
    break;
  }

  const normalizedWords = words.map((word, index) => normalizeTitleToken(word, index)).filter(Boolean);
  return normalizedWords.join(' ') || formatTitle(fallback);
}

function scanAgentsDirectory() {
  const catalog = {};
  for (const category of CATEGORIES) {
    const categoryPath = path.join(AGENTS_DIR, category);
    if (!fs.existsSync(categoryPath)) continue;

    catalog[category] = [];
    const items = fs.readdirSync(categoryPath);

    for (const item of items) {
      const itemPath = path.join(categoryPath, item);
      const stat = fs.statSync(itemPath);

      let itemId = '';
      let title = '';
      let description = '';
      let metadata = {};
      let tags = [];
      let markdownPath = '';
      let files = [];
      let repoUrl = '';
      let installCmd = '';
      let installCmds = {};
      let isScript = false;
      let editUrl = '';
      let rawUrl = '';

      // --- Case 1: Directory (Skills) ---
      if (stat.isDirectory()) {
         const markdownFile = findMarkdownFile(itemPath);
         if (!markdownFile) continue;

         itemId = item;
         markdownPath = path.join(itemPath, markdownFile);
         repoUrl = `${REPO_BASE_URL}/${category}/${item}`;
         editUrl = `${EDIT_BASE_URL}/${category}/${item}/${markdownFile}`;
         rawUrl = `${RAW_BASE_URL}/${category}/${item}/${markdownFile}`;
         installCmds = generateInstallCommands(category, item, true);
         installCmd = installCmds.gemini;

         // Files list (all except .git, recursive for some folders)
         const getFiles = (dir, base = '') => {
           let results = [];
           const list = fs.readdirSync(dir);
           for (const f of list) {
             if (f === '.git' || f === 'node_modules') continue;
             const fPath = path.join(dir, f);
             const fStat = fs.statSync(fPath);
             const relPath = base ? path.join(base, f) : f;
             if (fStat.isDirectory()) {
               results = results.concat(getFiles(fPath, relPath));
             } else {
               results.push(relPath);
             }
           }
           return results;
         };
         files = getFiles(itemPath);

         const content = fs.readFileSync(markdownPath, 'utf-8');
         const meta = extractMetadata(content, itemId, category);
         title = normalizeItemTitle(meta.title, itemId, category);
         description = meta.description;
         tags = meta.tags;
         metadata = meta.metadata;
      }
      // --- Case 2: Markdown File (Agents, Rules) ---
      else if (stat.isFile() && item.endsWith('.md')) {
         if (item === 'index.md' || item === 'README.md') continue;

         itemId = path.basename(item, '.md');
         markdownPath = itemPath;
         repoUrl = `${REPO_BASE_URL}/${category}/${item}`;
         editUrl = `${EDIT_BASE_URL}/${category}/${item}`;
         rawUrl = `${RAW_BASE_URL}/${category}/${item}`;
         installCmds = generateInstallCommands(category, item, false);
         installCmd = installCmds.gemini;
         files = [item];

         const content = fs.readFileSync(markdownPath, 'utf-8');
         const meta = extractMetadata(content, itemId, category);
         title = normalizeItemTitle(meta.title, itemId, category);
         description = meta.description;
         tags = meta.tags;
         metadata = meta.metadata;
      }
      // --- Case 3: Scripts (Hooks) ---
      else if (stat.isFile() && (item.endsWith('.py') || item.endsWith('.sh') || item.endsWith('.js'))) {
         itemId = item; // hooks like pre-command.py should keep extension
         markdownPath = itemPath;
         repoUrl = `${REPO_BASE_URL}/${category}/${item}`;
         editUrl = `${EDIT_BASE_URL}/${category}/${item}`;
         rawUrl = `${RAW_BASE_URL}/${category}/${item}`;
         installCmds = generateInstallCommands(category, item, false);
         installCmd = installCmds.gemini;
         files = [item];
         isScript = true;

         title = normalizeItemTitle(item, itemId, category);
         description = `Automation script: ${item}`;
         tags = ['script', path.extname(item).substring(1)];
      }
      else {
         continue;
      }

      // --- Collect Sibling/Related Files ---
      let relatedFiles = [];
      if (!stat.isDirectory()) {
        const parentDir = path.dirname(itemPath);
        const siblings = fs.readdirSync(parentDir);
        relatedFiles = siblings
          .filter(f => f !== item && f !== 'index.md' && f !== 'README.md' && !f.startsWith('.'))
          .map(f => f);
      }

      // --- Extract Parameters ---
      let parameters = [];
      if (stat.isDirectory()) {
        const formsPath = path.join(itemPath, 'FORMS.md');
        if (fs.existsSync(formsPath)) {
          parameters = extractParameters(fs.readFileSync(formsPath, 'utf8'));
        } else {
          parameters = extractParameters(fs.readFileSync(markdownPath, 'utf8'));
        }
      } else {
        parameters = extractParameters(fs.readFileSync(markdownPath, 'utf8'));
      }

      catalog[category].push({
        id: itemId,
        name: itemId,
        title: normalizeItemTitle(title, itemId, category),
        description: description,
        tags: tags,
        metadata: metadata,
        file: path.relative(AGENTS_DIR, markdownPath),
        path: markdownPath,
        files,
        relatedFiles,
        parameters,
        repoUrl,
        editUrl,
        rawUrl,
        installCmd,
        installCmds,
        isScript
      });
    }
  }
  return catalog;
}

function findMarkdownFile(dirPath) {
  const patterns = ['SKILL.md', 'RULES.md', 'HOOKS.md', 'AGENTS.md', 'WORKFLOWS.md', 'README.md'];
  for (const pattern of patterns) {
    if (fs.existsSync(path.join(dirPath, pattern))) {
      return pattern;
    }
  }
  return null;
}

function extractMetadata(content, itemId, category) {
  const lines = content.split('\n');
  let title = itemId;
  let description = '';
  let tags = [];
  let metadata = {};

  // Parse YAML frontmatter simple
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const yaml = frontmatterMatch[1];
    const nameMatch = yaml.match(/name:\s*(.+)/);
    const descMatch = yaml.match(/description:\s*(.+)/);

    // Extract metadata block (simplified parser)
    const metadataMatch = yaml.match(/metadata:\s*\n([\s\S]*?)(?=\n\w+:|$)/);
    if (metadataMatch) {
      const metaBlock = metadataMatch[1];
      // Extract works_on array
      const worksOnMatch = metaBlock.match(/works_on:\s*\[(.*?)\]/);
      if (worksOnMatch) {
        const worksOn = worksOnMatch[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
        metadata.works_on = worksOn;
        metadata.name = (nameMatch && nameMatch[1].trim()) || title;
        metadata.description = (descMatch && descMatch[1].trim()) || description;
      }
    }

    if (nameMatch) title = nameMatch[1].trim();
    if (descMatch) description = descMatch[1].trim();
  }

  // Fallback title
  if (!title || title === itemId) {
    const titleMatch = lines.find(line => line.startsWith('# '));
    if (titleMatch) title = titleMatch.replace('# ', '').trim();
  }

  // Fallback description
  if (!description) {
    const descLines = lines.slice(0, 20).filter(l => !l.startsWith('#') && l.trim());
    if (descLines.length > 0) description = descLines[0].substring(0, 150).trim();
  }

  // Extract tags
  const tagsMatch = content.match(/tags?:\s*\[(.*?)\]/i);
  if (tagsMatch) tags = tagsMatch[1].split(',').map(t => t.trim());

  return { title, description, tags, metadata };
}

function extractParameters(content) {
  const parameters = [];
  const lines = content.split('\n');
  let currentParam = null;

  // Simple parser for "### 1. Name", "- **Field:** name", etc.
  for (const line of lines) {
    const fieldMatch = line.match(/^[-*]\s+\*\*Field:\*\*\s+`?([\w_]+)`?/i);
    const typeMatch = line.match(/^[-*]\s+\*\*Type:\*\*\s+(.+)/i);
    const descMatch = line.match(/^[-*]\s+\*\*Description:\*\*\s+(.+)/i);
    const reqMatch = line.match(/^[-*]\s+\*\*Required:\*\*\s+(.+)/i);
    const headerMatch = line.match(/^###?\s+\d*\.?\s*(.+)/);

    if (headerMatch) {
      if (currentParam && currentParam.name) parameters.push(currentParam);
      currentParam = { title: headerMatch[1].trim() };
    } else if (fieldMatch) {
      if (!currentParam) currentParam = {};
      currentParam.name = fieldMatch[1].trim();
    } else if (typeMatch) {
      if (!currentParam) currentParam = {};
      currentParam.type = typeMatch[1].trim();
    } else if (descMatch) {
      if (!currentParam) currentParam = {};
      currentParam.description = descMatch[1].trim();
    } else if (reqMatch) {
      if (!currentParam) currentParam = {};
      currentParam.required = reqMatch[1].toLowerCase().includes('yes');
    }
  }
  if (currentParam && currentParam.name) parameters.push(currentParam);
  return parameters;
}

function cleanMarkdownContent(raw, itemId, category) {
  let out = String(raw);
  out = out.replace(/^\uFEFF/, '');
  // For agents and skills, keep code blocks as is to avoid JSX parsing issues
  if (category === 'agents' || category === 'skills') {
    // Remove Frontmatter
    out = out.replace(/^---\n([\s\S]*?)\n---\n?/, '');
    return out;
  }
  // For other categories, remove wrapping code fences (without g flag to avoid removing internal code blocks)
  out = out.replace(/^`{3,}[\w-]*\n([\s\S]*)\n`{3,}$/, '$1');
  // Remove Frontmatter
  out = out.replace(/^---\n([\s\S]*?)\n---\n?/, '');
  return out.trim();
}

function createSymlinks() {
  for (const category of CATEGORIES) {
    const sourcePath = path.join(AGENTS_DIR, category);
    const targetPath = path.join(DOCS_DIR, `.agent-${category}`);

    // Clean old symlink
    if (fs.existsSync(targetPath)) {
      try { fs.unlinkSync(targetPath); } catch (e) {}
    }

    // Create new symlink
    if (fs.existsSync(sourcePath)) {
      try {
        fs.symlinkSync(sourcePath, targetPath, 'dir');
        console.log(`✅ Symlink: ${category} → docs/.agent-${category}`);
      } catch (e) {
        console.warn(`⚠️  Symlink failed for ${category}: ${e.message}`);
      }
    }
  }
}

function generateCatalogJson(catalog) {
  const outputPath = path.join(DOCS_DIR, 'catalog.json');
  const catalogWithLinks = {};

  for (const [category, items] of Object.entries(catalog)) {
    catalogWithLinks[category] = items.map(item => ({
      ...item,
      url: `/${category}/${item.id}/`,
      sourceFile: category === 'skills'
        ? `/.agent-${category}/${item.id}/${path.basename(item.path)}`
        : `/.agent-${category}/${path.basename(item.path)}`
    }));
  }

  fs.writeFileSync(outputPath, JSON.stringify(catalogWithLinks, null, 2));
  console.log(`✅ Catalogo gerado`);
}

function generateCategoryIndexes(catalog) {
  for (const [category, items] of Object.entries(catalog)) {
    const categoryDocsPath = path.join(DOCS_DIR, category);
    if (!fs.existsSync(categoryDocsPath)) {
      fs.mkdirSync(categoryDocsPath, { recursive: true });
    }

    // --- Generate Category Index Page ---
    // Uses the Vue component <CategoryLayout> to handle logic
    const indexContent = `<CategoryLayout category="${category}" />\n`;
    const indexPath = path.join(categoryDocsPath, 'index.md');
    fs.writeFileSync(indexPath, indexContent);
    console.log(`✅ Indice: ${category}`);

    // --- Generate Individual Item Pages ---
    for (const item of items) {
      const itemDocsPath = path.join(categoryDocsPath, item.id);
      if (!fs.existsSync(itemDocsPath)) {
        fs.mkdirSync(itemDocsPath, { recursive: true });
      }

      // Determine the filename from the path
      const markdownFile = path.basename(item.path);
      const symlinkedPath = `/.agent-${category}/${item.isScript ? '' : item.id + '/'}${markdownFile}`;
      // Note: symlink structure.
      // Skills: .agent-skills/skill-id/SKILL.md
      // Agents: .agent-agents/agent-id.md (NO, symlink points to directory)
      // Wait, createSymlinks links the WHOLE category directory.
      // So:
      // Skills: docs/.agent-skills/skill-id/SKILL.md
      // Agents: docs/.agent-agents/agent-id.md
      // Hooks: docs/.agent-hooks/script.py

      // My logic above for symlinkedPath was: `/.agent-${category}/${item.id}/${markdownFile}`
      // This is wrong for files directly in the category folder.

      let finalSymPath = '';
      if (category === 'skills') {
          // Skills are directories
          finalSymPath = `/.agent-${category}/${item.id}/${markdownFile}`;
      } else {
          // Others are files directly in category folder
          finalSymPath = `/.agent-${category}/${markdownFile}`;
      }

      // We'll build the frontmatter later (after gen paths are known)
      let pageContent = '';
      const fmBase = {
        title: item.title,
        description: item.description || '',
        metadata: item.metadata || {},
        skillId: item.id,
        category: category,
        installCmds: item.installCmds || {},
        repoUrl: item.repoUrl || '',
        editUrl: item.editUrl || '',
        rawUrl: item.rawUrl || '',
        files: item.files || [],
        relatedFiles: item.relatedFiles || [],
        parameters: item.parameters || []
      };

      // Generate content wrapper

      if (category === 'skills' || (item.path.endsWith('.md') && !item.isScript)) {
        // Clean markdown content for cleaner display
        const raw = fs.readFileSync(item.path, 'utf8');
        const cleanedContent = cleanMarkdownContent(raw, item.id, category);

        const genDir = path.join(DOCS_DIR, '.generated-skills', item.id);
        if (!fs.existsSync(genDir)) fs.mkdirSync(genDir, { recursive: true });

        const genFilePath = path.join(genDir, markdownFile);
        fs.writeFileSync(genFilePath, raw, 'utf8');
        const genIncludePath = `/.generated-skills/${item.id}/${markdownFile}`;

        // Build frontmatter now that we know genIncludePath and finalSymPath
        const frontmatter = Object.assign({}, fmBase, {
          genPath: genIncludePath,
          sourcePath: finalSymPath
        });

        pageContent += '---\n';
        for (const [k, v] of Object.entries(frontmatter)) {
          if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
            pageContent += `${k}:\n`;
            for (const [subk, subv] of Object.entries(v)) {
              if (Array.isArray(subv)) {
                pageContent += `  ${subk}: ${JSON.stringify(subv)}\n`;
              } else if (typeof subv === 'string') {
                pageContent += `  ${subk}: '${subv}'\n`;
              } else {
                pageContent += `  ${subk}: ${JSON.stringify(subv)}\n`;
              }
            }
          } else {
            pageContent += `${k}: ${JSON.stringify(v)}\n`;
          }
        }
        pageContent += '---\n\n';

        // Emit SkillPage component WITHOUT inlined attribute concatenation; the component
        // will read props from frontmatter. Place cleaned markdown inside the component slot.
        pageContent += `<SkillPage>\n\n`;
        pageContent += cleanedContent + '\n\n';
        pageContent += `</SkillPage>\n`;
      } else {
        // Scripts or other files: include directly as code block
        const frontmatter = Object.assign({}, fmBase, {
          genPath: '',
          sourcePath: finalSymPath
        });

        pageContent += '---\n';
        for (const [k, v] of Object.entries(frontmatter)) {
          if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
            pageContent += `${k}:\n`;
            for (const [subk, subv] of Object.entries(v)) {
              pageContent += `  ${subk}: "${subv}"\n`;
            }
          } else {
            pageContent += `${k}: ${JSON.stringify(v)}\n`;
          }
        }
        pageContent += '---\n\n';

        pageContent += `<SkillPage>\n\n`;
        pageContent += `<<< @${finalSymPath}\n\n`;
        pageContent += `</SkillPage>\n`;
      }

      const pagePath = path.join(itemDocsPath, 'index.md');
      fs.writeFileSync(pagePath, pageContent);
    }
  }
  console.log(`✅ Paginas individuais geradas`);
}

function generateSidebarConfig(catalog) {
  const categoryTitles = {
    agents: 'Agentes',
    skills: 'Skills (Capacidades)',
    rules: 'Regras',
    hooks: 'Hooks (Automações)',
    workflows: 'Workflows (Fluxos)'
  };

  const sidebar = {};
  for (const [category, items] of Object.entries(catalog)) {
    sidebar[`/${category}/`] = [{
      text: categoryTitles[category] || category.toUpperCase(),
      items: items.map(item => ({
        text: item.title,
        link: `/${category}/${item.id}/`
      }))
    }];
  }
  const vitepressDir = path.join(DOCS_DIR, '.vitepress');
  if (!fs.existsSync(vitepressDir)) {
    fs.mkdirSync(vitepressDir, { recursive: true });
  }
  const configContent = `export const sidebar = ${JSON.stringify(sidebar, null, 2)};`;
  fs.writeFileSync(path.join(vitepressDir, 'sidebar.js'), configContent);
  console.log('✅ Sidebar config gerado');
}

function copySrcToDocs() {
  const srcPath = path.join(ROOT, 'src');
  if (!fs.existsSync(srcPath)) {
    console.log('⚠️  Pasta src não encontrada, pulando cópia');
    return;
  }

  const copyRecursive = (src, dest) => {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const files = fs.readdirSync(src);
      for (const file of files) {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        copyRecursive(srcFile, destFile);
      }
    } else {
      fs.copyFileSync(src, dest);
    }
  };

  copyRecursive(srcPath, DOCS_DIR);
  console.log('✅ Arquivos de src copiados para docs');
}

async function main() {
  console.log('🔄 Escaneando .agent...\n');
  const catalog = scanAgentsDirectory();

  console.log(`📊 Catalogo:`);
  for (const [category, items] of Object.entries(catalog)) {
    console.log(`  ${category}: ${items.length} items`);
  }

  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  createSymlinks();
  generateCatalogJson(catalog);
  generateCategoryIndexes(catalog);
  generateSidebarConfig(catalog);
  copySrcToDocs();

  console.log('\n✅ Loader completo!\n');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
