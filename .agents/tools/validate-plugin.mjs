import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SHARED_FIELDS = ["version", "description", "license"];
// Components a consumer's Claude Code would auto-apply; this plugin ships skills and agents only.
const FORBIDDEN_AT_PLUGIN_ROOT = ["settings.json", ".mcp.json", ".lsp.json", "hooks"];

function readJson(file, label, errors) {
  if (!fs.existsSync(file)) {
    errors.push(`${label} is missing`);
    return undefined;
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${label} is invalid JSON: ${error.message}`);
    return undefined;
  }
}

// Claude Code copies a local source into its plugin cache, so it must be a self-contained
// subdirectory: the repo root would drag node_modules (pnpm symlinks fail on Windows).
function validateLocalEntry(root, manifest, entry, errors) {
  const pluginRoot = path.resolve(root, entry.source);
  const relative = path.relative(path.resolve(root), pluginRoot);
  // Resolve with the host path rules: on Windows a backslash would otherwise slip past a posix-only check.
  if (!entry.source.startsWith("./") || entry.source.includes("\\") || !relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    errors.push(`marketplace.json source for '${entry.name}' must be a ./subdirectory, not the repository root`);
    return;
  }
  const claude = readJson(path.join(pluginRoot, ".claude-plugin", "plugin.json"), `${entry.source}/.claude-plugin/plugin.json`, errors);
  if (!claude) return;
  if (claude.name !== entry.name) errors.push(`Claude plugin name '${claude.name}' differs from marketplace entry '${entry.name}'`);
  if (entry.version && entry.version !== claude.version) {
    errors.push(`marketplace.json version '${entry.version}' differs from Claude plugin '${claude.version}'`);
  }
  for (const field of SHARED_FIELDS) {
    if (claude[field] !== manifest[field]) errors.push(`Claude plugin '${field}' differs from plugin.json`);
  }
  for (const directory of ["skills", "agents"]) {
    if (!fs.existsSync(path.join(pluginRoot, directory))) errors.push(`Claude plugin source has no ${directory}/ directory`);
  }
  for (const name of FORBIDDEN_AT_PLUGIN_ROOT) {
    if (fs.existsSync(path.join(pluginRoot, name))) errors.push(`Claude plugin root must not ship '${name}'`);
  }
}

function validateClaudeMarketplace(root, manifest, errors) {
  const marketplace = readJson(path.join(root, ".claude-plugin", "marketplace.json"), ".claude-plugin/marketplace.json", errors);
  if (!marketplace) return;
  for (const field of ["name", "owner", "plugins"]) {
    if (!marketplace[field]) errors.push(`marketplace.json is missing '${field}'`);
  }
  if (!Array.isArray(marketplace.plugins)) {
    errors.push("marketplace.json 'plugins' must be an array");
    return;
  }
  const local = marketplace.plugins.filter((entry) => typeof entry?.source === "string");
  if (!local.length) errors.push("marketplace.json has no local plugin entry");
  for (const entry of local) validateLocalEntry(root, manifest, entry, errors);
}

export function validatePlugin(root) {
  const errors = [];
  const manifest = readJson(path.join(root, "plugin.json"), "plugin.json", errors);
  if (!manifest) return errors;
  for (const field of ["name", "description", "version", "license", "skills"]) {
    if (!manifest[field]) errors.push(`plugin.json is missing '${field}'`);
  }
  for (const field of ["skills", "agents"]) {
    if (manifest[field] && !fs.existsSync(path.join(root, manifest[field]))) {
      errors.push(`plugin.json '${field}' path does not exist: ${manifest[field]}`);
    }
  }
  validateClaudeMarketplace(root, manifest, errors);
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = validatePlugin(process.cwd());
  if (errors.length) {
    console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
    process.exit(1);
  }
  console.log("Plugin manifests valid.");
}
