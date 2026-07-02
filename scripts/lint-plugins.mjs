import fs from 'node:fs';
import path from 'node:path';
import {
  PLUGINS_DIR,
  findPluginManifestPaths,
  listPluginDirectories,
  readJson,
} from './lib/catalog.mjs';

let hasErrors = false;
const manifestPaths = findPluginManifestPaths();

if (!listPluginDirectories().length) {
  console.error('No plugin directories were found.');
  process.exit(1);
}

for (const pluginDir of listPluginDirectories()) {
  const manifestPath = path.join(pluginDir, '.github', 'plugin', 'plugin.json');
  if (!fs.existsSync(manifestPath)) {
    hasErrors = true;
    console.error(`Missing manifest: ${path.relative(PLUGINS_DIR, manifestPath)}`);
  }
}

for (const manifestPath of manifestPaths) {
  const pluginName = path.basename(path.dirname(path.dirname(manifestPath)));
  const baseDir = path.dirname(manifestPath);
  let metadata;

  try {
    metadata = readJson(manifestPath);
  } catch (error) {
    hasErrors = true;
    console.error(`[${pluginName}] Invalid JSON: ${error.message}`);
    continue;
  }

  for (const category of ['skills', 'agents']) {
    const entries = metadata[category] ?? [];
    if (!Array.isArray(entries)) {
      hasErrors = true;
      console.error(`[${pluginName}] ${category} must be an array.`);
      continue;
    }

    for (const relativePath of entries) {
      const resolvedPath = path.resolve(baseDir, relativePath);
      if (!fs.existsSync(resolvedPath)) {
        hasErrors = true;
        console.error(`[${pluginName}] Missing ${category.slice(0, -1)}: ${relativePath}`);
      }
    }
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log(`Validated ${manifestPaths.length} plugin manifest(s).`);
