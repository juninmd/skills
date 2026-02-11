#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const AGENTS_DIR = path.join(ROOT, '.agents');
const DOCS_DIR = path.join(ROOT, 'docs');

const CATEGORIES = ['agents', 'skills', 'rules', 'hooks', 'workflows'];
// Base URLs for GitLab
const REPO_BASE_URL = 'https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/tree/main/.agents';
const RAW_BASE_URL = 'https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/-/raw/main/.agents';
const EDIT_BASE_URL = 'https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents/-/edit/main/.agents';

function formatTitle(name) {
  return name
    .replace(/\.[^/.]+$/, "") // remove extension
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
      let tags = [];
      let markdownPath = '';
      let files = [];
      let repoUrl = '';
      let installCmd = '';
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
         installCmd = `gemini skills install https://github.com/luizalabs/padrao-labs-agents --path .agents/${category}/${item}`;

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
         title = meta.title;
         description = meta.description;
         tags = meta.tags;
      }
      // --- Case 2: Markdown File (Agents, Rules) ---
      else if (stat.isFile() && item.endsWith('.md')) {
         if (item === 'index.md' || item === 'README.md') continue;

         itemId = path.basename(item, '.md');
         markdownPath = itemPath;
         repoUrl = `${REPO_BASE_URL}/${category}/${item}`;
         editUrl = `${EDIT_BASE_URL}/${category}/${item}`;
         rawUrl = `${RAW_BASE_URL}/${category}/${item}`;
         installCmd = `curl -L ${RAW_BASE_URL}/${category}/${item} -o ${item}`;
         files = [item];

         const content = fs.readFileSync(markdownPath, 'utf-8');
         const meta = extractMetadata(content, itemId, category);
         title = meta.title;
         description = meta.description;
         tags = meta.tags;
      }
      // --- Case 3: Scripts (Hooks) ---
      else if (stat.isFile() && (item.endsWith('.py') || item.endsWith('.sh') || item.endsWith('.js'))) {
         itemId = item; // hooks like pre-command.py should keep extension
         markdownPath = itemPath;
         repoUrl = `${REPO_BASE_URL}/${category}/${item}`;
         editUrl = `${EDIT_BASE_URL}/${category}/${item}`;
         rawUrl = `${RAW_BASE_URL}/${category}/${item}`;
         installCmd = `curl -L ${RAW_BASE_URL}/${category}/${item} -o ${item} && chmod +x ${item}`;
         files = [item];
         isScript = true;

         title = formatTitle(item);
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
        title: title || formatTitle(itemId),
        description: description,
        tags: tags,
        file: path.relative(AGENTS_DIR, markdownPath),
        path: markdownPath,
        files,
        relatedFiles,
        parameters,
        repoUrl,
        editUrl,
        rawUrl,
        installCmd,
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

  // Parse YAML frontmatter simple
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const yaml = frontmatterMatch[1];
    const nameMatch = yaml.match(/name:\s*(.+)/);
    const descMatch = yaml.match(/description:\s*(.+)/);
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

  return { title, description, tags };
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

function cleanMarkdownContent(raw) {
  let out = String(raw);
  out = out.replace(/^\uFEFF/, '');
  // Remove fenced code blocks wrapping the file content if present
  out = out.replace(/```[\w-]*\n([\s\S]*?)\n```/g, '$1');
  // Remove Frontmatter
  out = out.replace(/^---\n([\s\S]*?)\n---\n?/, '');
  return out.trim();
}

function createSymlinks() {
  for (const category of CATEGORIES) {
    const sourcePath = path.join(AGENTS_DIR, category);
    const targetPath = path.join(DOCS_DIR, `.agents-${category}`);

    // Clean old symlink
    if (fs.existsSync(targetPath)) {
      try { fs.unlinkSync(targetPath); } catch (e) {}
    }

    // Create new symlink
    if (fs.existsSync(sourcePath)) {
      try {
        fs.symlinkSync(sourcePath, targetPath, 'dir');
        console.log(`✅ Symlink: ${category} → docs/.agents-${category}`);
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
      sourceFile: `/.agents-${category}/${item.id}/${path.basename(item.path)}`
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
      const symlinkedPath = `/.agents-${category}/${item.isScript ? '' : item.id + '/'}${markdownFile}`;
      // Note: symlink structure.
      // Skills: .agents-skills/skill-id/SKILL.md
      // Agents: .agents-agents/agent-id.md (NO, symlink points to directory)
      // Wait, createSymlinks links the WHOLE category directory.
      // So:
      // Skills: docs/.agents-skills/skill-id/SKILL.md
      // Agents: docs/.agents-agents/agent-id.md
      // Hooks: docs/.agents-hooks/script.py

      // My logic above for symlinkedPath was: `/.agents-${category}/${item.id}/${markdownFile}`
      // This is wrong for files directly in the category folder.

      let finalSymPath = '';
      if (category === 'skills') {
          // Skills are directories
          finalSymPath = `/.agents-${category}/${item.id}/${markdownFile}`;
      } else {
          // Others are files directly in category folder
          finalSymPath = `/.agents-${category}/${markdownFile}`;
      }

      let pageContent = `---
title: ${JSON.stringify(item.title)}
description: ${JSON.stringify(item.description || '')}
itemId: ${JSON.stringify(item.id)}
category: ${JSON.stringify(category)}
---\n\n`;

      // Generate content wrapper

      if (category === 'skills' || (item.path.endsWith('.md') && !item.isScript)) {
        // Clean markdown content for cleaner display
        const raw = fs.readFileSync(item.path, 'utf8');
        const cleaned = cleanMarkdownContent(raw);

        // Save cleaned content
        const genDir = path.join(DOCS_DIR, '.generated-skills', item.id);
        if (!fs.existsSync(genDir)) fs.mkdirSync(genDir, { recursive: true });

        const genFilePath = path.join(genDir, markdownFile);
        fs.writeFileSync(genFilePath, cleaned, 'utf8');
        const genIncludePath = `/.generated-skills/${item.id}/${markdownFile}`;
        // Open SkillPage with gen-path pointing to cleaned generated markdown
        pageContent += `<SkillPage skill-id="${item.id}" source-path="${finalSymPath}" gen-path="${genIncludePath}" category="${category}">\n\n`;

        pageContent += `<!-- @include: @${genIncludePath} -->\n\n`;
      } else {
        // Scripts or other files: include directly as code block
        pageContent += `<SkillPage skill-id="${item.id}" source-path="${finalSymPath}" category="${category}">\n\n`;
        pageContent += `<<< @${finalSymPath}\n`;
      }

      pageContent += `</SkillPage>\n`;

      const pagePath = path.join(itemDocsPath, 'index.md');
      fs.writeFileSync(pagePath, pageContent);
    }
  }
  console.log(`✅ Paginas individuais geradas`);
}

function generateSidebarConfig(catalog) {
  const sidebar = {};
  for (const [category, items] of Object.entries(catalog)) {
    sidebar[`/${category}/`] = [{
      text: category.toUpperCase(),
      items: items.map(item => ({
        text: item.title,
        link: `/${category}/${item.id}/`
      }))
    }];
  }
  const configContent = `export const sidebar = ${JSON.stringify(sidebar, null, 2)};`;
  fs.writeFileSync(path.join(DOCS_DIR, '.vitepress/sidebar.js'), configContent);
  console.log('✅ Sidebar config gerado');
}

async function main() {
  console.log('🔄 Escaneando .agents...\n');
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

  console.log('\n✅ Loader completo!\n');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
