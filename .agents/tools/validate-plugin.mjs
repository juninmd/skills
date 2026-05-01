import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const namePattern = /^[a-z0-9][a-z0-9-]{0,63}$/;

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`${path.relative(root, filePath)} is not valid JSON: ${error.message}`);
  }
}

function assert(condition, message, issues) {
  if (!condition) {
    issues.push(message);
  }
}

function validateName(name, label, issues) {
  assert(typeof name === 'string' && namePattern.test(name), `${label} must be kebab-case and <= 64 chars.`, issues);
}

function validatePath(relativePath, label, issues) {
  assert(typeof relativePath === 'string' && relativePath.length > 0, `${label} must be a non-empty string.`, issues);

  if (typeof relativePath !== 'string' || relativePath.length === 0) {
    return;
  }

  const resolvedPath = path.resolve(root, relativePath);
  assert(resolvedPath.startsWith(root), `${label} must stay inside the repository.`, issues);
  assert(fs.existsSync(resolvedPath), `${label} does not exist: ${relativePath}`, issues);
}

function validatePluginManifest(issues) {
  const manifestPath = path.join(root, 'plugin.json');
  assert(fs.existsSync(manifestPath), 'plugin.json must exist at the repository root.', issues);

  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  const manifest = readJson(manifestPath);
  validateName(manifest.name, 'plugin.json name', issues);
  validatePath(manifest.agents, 'plugin.json agents path', issues);
  validatePath(manifest.skills, 'plugin.json skills path', issues);

  return manifest;
}

function validateMarketplace(manifest, issues) {
  const marketplacePath = path.join(root, '.github', 'plugin', 'marketplace.json');
  assert(fs.existsSync(marketplacePath), '.github/plugin/marketplace.json must exist for marketplace installs.', issues);

  if (!fs.existsSync(marketplacePath)) {
    return;
  }

  const marketplace = readJson(marketplacePath);
  validateName(marketplace.name, 'marketplace name', issues);
  assert(Array.isArray(marketplace.plugins), 'marketplace plugins must be an array.', issues);

  const entry = marketplace.plugins?.find((plugin) => plugin.name === manifest?.name);
  assert(Boolean(entry), `marketplace must include plugin entry: ${manifest?.name ?? '(unknown)'}`, issues);

  if (!entry) {
    return;
  }

  assert(entry.source === '.', 'marketplace plugin source should point at the repository root plugin: "."', issues);
  validatePath(entry.agents, 'marketplace agents path', issues);
  validatePath(entry.skills, 'marketplace skills path', issues);
}

const issues = [];
const manifest = validatePluginManifest(issues);
validateMarketplace(manifest, issues);

if (issues.length > 0) {
  console.error(issues.map((issue) => `- ${issue}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Plugin manifest and marketplace metadata are valid.');
}
