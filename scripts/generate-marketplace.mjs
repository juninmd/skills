import path from 'node:path';
import {
  MARKETPLACE_FILE,
  createMarketplaceDocument,
  listPluginDirectories,
  readJson,
  readPluginMetadata,
  syncCatalogEntries,
  writeJson,
} from './lib/catalog.mjs';

const plugins = [];

for (const pluginDir of listPluginDirectories()) {
  const metadata = readPluginMetadata(pluginDir);
  if (!metadata) {
    console.warn(`Skipping ${path.basename(pluginDir)} because plugin.json is missing.`);
    continue;
  }

  syncCatalogEntries(pluginDir, metadata);
  plugins.push({
    name: metadata.name,
    source: `./plugins/${path.basename(pluginDir)}`,
    description: metadata.description,
    version: metadata.version ?? '1.0.0',
  });
}

if (!plugins.length) {
  console.error('No plugins were found.');
  process.exit(1);
}

const existing = (() => {
  try {
    return readJson(MARKETPLACE_FILE);
  } catch {
    return {};
  }
})();

writeJson(MARKETPLACE_FILE, createMarketplaceDocument(plugins, existing));
console.log(`Generated marketplace.json for ${plugins.length} plugin(s).`);
