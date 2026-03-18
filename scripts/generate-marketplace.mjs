#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_FOLDER = path.join(__dirname, "..");
const PLUGINS_DIR = path.join(ROOT_FOLDER, "plugins");
const EXTERNAL_PLUGINS_FILE = path.join(PLUGINS_DIR, "external.json");
const MARKETPLACE_FILE = path.join(ROOT_FOLDER, ".github/plugin", "marketplace.json");

/**
 * Validate an external plugin entry has required fields and a non-local source
 */
function validateExternalPlugin(plugin, index) {
  const errors = [];
  const prefix = `external.json[${index}]`;

  if (!plugin.name || typeof plugin.name !== "string") {
    errors.push(`${prefix}: "name" is required and must be a string`);
  }
  if (!plugin.description || typeof plugin.description !== "string") {
    errors.push(`${prefix}: "description" is required and must be a string`);
  }
  if (!plugin.version || typeof plugin.version !== "string") {
    errors.push(`${prefix}: "version" is required and must be a string`);
  }

  if (!plugin.source) {
    errors.push(`${prefix}: "source" is required`);
  }

  return errors;
}

/**
 * Read external plugin entries from external.json
 */
function readExternalPlugins() {
  if (!fs.existsSync(EXTERNAL_PLUGINS_FILE)) {
    return [];
  }

  try {
    const content = fs.readFileSync(EXTERNAL_PLUGINS_FILE, "utf8");
    const plugins = JSON.parse(content);
    if (!Array.isArray(plugins)) {
      console.warn("Warning: external.json must contain an array");
      return [];
    }

    let hasErrors = false;
    for (let i = 0; i < plugins.length; i++) {
      const errors = validateExternalPlugin(plugins[i], i);
      if (errors.length > 0) {
        errors.forEach(e => console.error(`Error: ${e}`));
        hasErrors = true;
      }
    }
    if (hasErrors) {
      console.error("Error: external.json contains invalid entries");
      process.exit(1);
    }

    return plugins;
  } catch (error) {
    console.error(`Error reading external.json: ${error.message}`);
    return [];
  }
}

/**
 * Read plugin metadata from plugin.json file
 */
function readPluginMetadata(pluginDir) {
  const pluginJsonPath = path.join(pluginDir, ".github/plugin", "plugin.json");

  if (!fs.existsSync(pluginJsonPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(pluginJsonPath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading plugin.json for ${path.basename(pluginDir)}:`, error.message);
    return null;
  }
}

/**
 * Create relative symlinks for skills and agents
 */
function createPluginSymlinks(pluginPath, metadata) {
  const pluginJsonDir = path.join(pluginPath, ".github/plugin");
  const categories = ['skills', 'agents'];

  for (const category of categories) {
    if (metadata[category] && Array.isArray(metadata[category])) {
      const targetDir = path.join(pluginPath, category);
      
      // Clear and recreate target directory to remove stale symlinks
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }
      fs.mkdirSync(targetDir, { recursive: true });

      for (const itemRelPath of metadata[category]) {
        // Resolve absolute source path (relative to .github/plugin/)
        const absoluteSourcePath = path.resolve(pluginJsonDir, itemRelPath);
        const itemName = path.basename(absoluteSourcePath);
        const destPath = path.join(targetDir, itemName);

        if (fs.existsSync(absoluteSourcePath)) {
          const stats = fs.statSync(absoluteSourcePath);
          // Calculate relative path from the target link directory to the actual file/folder
          const relativeSourcePath = path.relative(targetDir, absoluteSourcePath);
          fs.symlinkSync(relativeSourcePath, destPath, stats.isDirectory() ? 'dir' : 'file');
        } else {
          console.warn(`⚠️ Warning: Target not found for symlink: ${absoluteSourcePath}`);
        }
      }
    }
  }
}

/**
 * Generate marketplace.json from plugin directories
 */
function generateMarketplace() {
  console.log("🔍 Gerando marketplace.json...");

  if (!fs.existsSync(PLUGINS_DIR)) {
    console.error(`Error: Plugins directory not found at ${PLUGINS_DIR}`);
    process.exit(1);
  }

  const pluginDirs = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

  console.log(`📂 Encontrados ${pluginDirs.length} diretórios de plugins`);

  const plugins = [];
  for (const dirName of pluginDirs) {
    const pluginPath = path.join(PLUGINS_DIR, dirName);
    const metadata = readPluginMetadata(pluginPath);

    if (metadata) {
      // Create symlinks for this plugin based on metadata
      createPluginSymlinks(pluginPath, metadata);

      plugins.push({
        name: metadata.name,
        source: `./plugins/${dirName}`,
        description: metadata.description,
        version: metadata.version || "1.0.0"
      });
      console.log(`✅ Adicionado e linkado: ${metadata.name}`);
    }
  }

  const externalPlugins = readExternalPlugins();
  if (externalPlugins.length > 0) {
    console.log(`\n🌐 Encontrados ${externalPlugins.length} plugins externos`);
    for (const ext of externalPlugins) {
      plugins.push(ext);
      console.log(`✅ Adicionado (Externo): ${ext.name}`);
    }
  }

  plugins.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

  const marketplace = {
    name: "padrao-labs-agents-root",
    metadata: {
      description: "Agents, Skills, Rules, and Workflows",
      version: "1.0.0",
      pluginRoot: "./"
    },
    owner: {
      name: "Antonio",
      email: "antonio.junior@luizalabs.com"
    },
    plugins: plugins
  };

  const marketplaceDir = path.dirname(MARKETPLACE_FILE);
  if (!fs.existsSync(marketplaceDir)) {
    fs.mkdirSync(marketplaceDir, { recursive: true });
  }

  fs.writeFileSync(MARKETPLACE_FILE, JSON.stringify(marketplace, null, 2) + "\n");

  console.log(`\n🎉 marketplace.json gerado com sucesso com ${plugins.length} plugins!`);
  console.log(`📍 Local: ${MARKETPLACE_FILE}`);
}

generateMarketplace();
