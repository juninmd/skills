import fs from 'node:fs';
import path from 'node:path';

export const ROOT_DIR = process.cwd();
export const AGENTS_DIR = path.join(ROOT_DIR, '.agents');
export const AGENT_FILES_DIR = path.join(AGENTS_DIR, 'agents');
export const SKILLS_DIR = path.join(AGENTS_DIR, 'skills');
export const PLUGINS_DIR = path.join(ROOT_DIR, 'plugins');
export const MARKETPLACE_FILE = path.join(ROOT_DIR, '.github', 'plugin', 'marketplace.json');

const IGNORED_DIRS = new Set(['.git', 'node_modules', 'coverage', 'dist']);

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function walkFiles(dirPath, filter, output = []) {
  if (!fs.existsSync(dirPath)) {
    return output;
  }

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        walkFiles(fullPath, filter, output);
      }
      continue;
    }

    if (filter(fullPath, entry.name)) {
      output.push(fullPath);
    }
  }

  return output;
}

export function listPluginDirectories() {
  if (!fs.existsSync(PLUGINS_DIR)) {
    return [];
  }

  return fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(PLUGINS_DIR, entry.name))
    .sort();
}

export function readPluginMetadata(pluginDir) {
  const manifestPath = path.join(pluginDir, '.github', 'plugin', 'plugin.json');
  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  return readJson(manifestPath);
}

export function findPluginManifestPaths() {
  return walkFiles(PLUGINS_DIR, (_, name) => name === 'plugin.json');
}

export function syncCatalogEntries(pluginDir, metadata) {
  const manifestDir = path.join(pluginDir, '.github', 'plugin');

  for (const category of ['skills', 'agents']) {
    const targetDir = path.join(pluginDir, category);
    fs.rmSync(targetDir, { recursive: true, force: true });
    ensureDir(targetDir);

    for (const relativeSource of metadata[category] ?? []) {
      const sourcePath = path.resolve(manifestDir, relativeSource);
      const targetPath = path.join(targetDir, path.basename(sourcePath));
      const recursive = fs.statSync(sourcePath).isDirectory();
      fs.cpSync(sourcePath, targetPath, { recursive });
    }
  }
}

export function createMarketplaceDocument(plugins, existing = {}) {
  return {
    name: existing.name ?? 'plugin-marketplace',
    metadata: {
      description: existing.metadata?.description ?? 'Generated plugin marketplace',
      version: existing.metadata?.version ?? '1.0.0',
      pluginRoot: existing.metadata?.pluginRoot ?? './',
    },
    owner: existing.owner ?? { name: 'Catalog Maintainers' },
    plugins: [...plugins].sort((left, right) => left.name.localeCompare(right.name)),
  };
}
