import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { walkFiles } from "./walk-files.mjs";
import { validateSkill } from "./validate-agents.mjs";

const SKILLS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../skills");
export const SKILLS = fs.readdirSync(SKILLS_ROOT).filter((name) => fs.existsSync(path.join(SKILLS_ROOT, name, "SKILL.md"))).sort();
const CLIENTS = ["codex", "claude", "antigravity", "opencode"];
const MARKER = ".juninmd-distribution.json";
const json = (value) => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const sha256 = (data) => createHash("sha256").update(data).digest("hex");

export function readTree(root) {
  if (!fs.lstatSync(root).isDirectory()) throw new Error(`Expected real directory: ${root}`);
  const files = new Map();
  // A distribution must be reproducible from real files only: symlinks and
  // anything that isn't a plain file abort the whole read (walkFiles' own
  // wording, which names the offending absolute path).
  for (const absolute of walkFiles([root], { symlinks: "throw" })) {
    const relative = path.relative(root, absolute).split(path.sep).join("/");
    files.set(relative, fs.readFileSync(absolute));
  }
  return files;
}

export function readMetadata(root) {
  const metadata = JSON.parse(fs.readFileSync(path.join(root, "plugin.json"), "utf8"));
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) throw new Error("plugin.json must be an object");
  for (const key of ["name", "version", "description", "license"]) {
    if (typeof metadata[key] !== "string" || !metadata[key].trim()) throw new Error(`plugin.json requires ${key}`);
  }
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(metadata.name)) throw new Error("Invalid plugin name");
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(metadata.version)) throw new Error("Release version must be stable semver");
  if (typeof metadata.author?.name !== "string" || !metadata.author.name.trim()) throw new Error("plugin.json requires author.name");
  if (metadata.skills !== ".agents/skills") throw new Error("Canonical skills must be .agents/skills");
  return metadata;
}

function skillFiles(root) {
  const files = readTree(path.join(root, ".agents/skills"));
  const names = [...files.keys()].filter((file) => /^[^/]+\/SKILL\.md$/.test(file)).map((file) => file.split("/")[0]).sort();
  if (JSON.stringify(names) !== JSON.stringify(SKILLS)) throw new Error(`Distribution requires exactly the ${SKILLS.length} canonical skills`);
  // The full house-structure/budget/orphan-reference rule set lives in
  // validate-agents.mjs; a release must meet the same bar `pnpm run validate`
  // enforces, not a smaller bundling-only subset that can drift from it.
  for (const name of names) {
    const errors = validateSkill(path.join(root, ".agents/skills", name));
    if (errors.length) throw new Error(`Invalid skill ${name}: ${errors[0]}`);
  }
  for (const [file, data] of files) {
    if (!file.endsWith(".md")) continue;
    for (const match of data.toString("utf8").matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(match[1])) continue;
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), decodeURIComponent(match[1].split("#")[0])));
      if (!files.has(target) && ![...files.keys()].some((key) => key.startsWith(`${target}/`))) throw new Error(`Reference leaves bundle or is missing: ${file} -> ${match[1]}`);
    }
  }
  return files;
}

// Deterministic USTAR: regular files only, zero timestamps, no host paths or symlinks.
export function archive(files) {
  const chunks = [];
  for (const [name, data] of [...files].sort(([a], [b]) => a.localeCompare(b, "en"))) {
    if (name.startsWith("/") || name.includes("\\") || name.split("/").some((part) => !part || part === "." || part === "..")) throw new Error(`Unsafe archive path: ${name}`);
    const header = Buffer.alloc(512);
    let leaf = name;
    if (Buffer.byteLength(name) > 100) {
      const split = name.lastIndexOf("/");
      const prefix = name.slice(0, split);
      leaf = name.slice(split + 1);
      if (Buffer.byteLength(prefix) > 155 || Buffer.byteLength(leaf) > 100) throw new Error(`Archive path too long: ${name}`);
      header.write(prefix, 345, 155);
    }
    header.write(leaf, 0, 100);
    const octal = (value, offset, width) => header.write(value.toString(8).padStart(width - 1, "0") + "\0", offset, width);
    octal(0o644, 100, 8); octal(0, 108, 8); octal(0, 116, 8);
    octal(data.length, 124, 12); octal(0, 136, 12);
    header.fill(32, 148, 156); header.write("0", 156); header.write("ustar\0", 257); header.write("00", 263);
    const checksum = header.reduce((sum, byte) => sum + byte, 0);
    header.write(checksum.toString(8).padStart(6, "0") + "\0 ", 148, 8);
    chunks.push(header, data, Buffer.alloc((512 - data.length % 512) % 512));
  }
  return gzipSync(Buffer.concat([...chunks, Buffer.alloc(1024)]), { level: 9 });
}

export function planDistribution(root) {
  const metadata = readMetadata(root);
  const skills = skillFiles(root);
  const outputs = new Map();
  const common = { name: metadata.name, version: metadata.version, description: metadata.description, author: metadata.author, license: metadata.license };
  for (const client of CLIENTS) {
    const files = new Map();
    const pluginRoot = client === "codex" || client === "claude" ? `plugins/${metadata.name}/` : `${metadata.name}/`;
    const skillRoot = pluginRoot + (client === "opencode" ? ".opencode/skills/" : "skills/");
    for (const [file, data] of skills) files.set(skillRoot + file, data);
    files.set(pluginRoot + "LICENSE", fs.readFileSync(path.join(root, "LICENSE")));
    if (client === "codex") {
      files.set(pluginRoot + ".codex-plugin/plugin.json", json({ ...common, skills: "./skills/", interface: { displayName: "JuninMD Skills", shortDescription: `${SKILLS.length} engineering skills`, longDescription: metadata.description, developerName: metadata.author.name, category: "Productivity", capabilities: ["Write"], defaultPrompt: ["Use starting-dev to prepare this project.", "Use finishing-dev to review and prepare a PR."] } }));
      files.set(".agents/plugins/marketplace.json", json({ name: metadata.name, interface: { displayName: "JuninMD Skills" }, plugins: [{ name: metadata.name, source: { source: "local", path: `./plugins/${metadata.name}` }, policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" }, category: "Productivity" }] }));
    } else if (client === "claude") {
      files.set(pluginRoot + ".claude-plugin/plugin.json", json({ ...common, skills: "./skills/" }));
      files.set(".claude-plugin/marketplace.json", json({ name: metadata.name, owner: metadata.author, plugins: [{ name: metadata.name, source: `./plugins/${metadata.name}`, description: metadata.description, version: metadata.version }] }));
    } else if (client === "antigravity") files.set(pluginRoot + "plugin.json", json({ name: metadata.name, description: metadata.description }));
    for (const [file, data] of files) outputs.set(`${client}/${file}`, data);
    outputs.set(`${metadata.name}-${metadata.version}-${client}.tar.gz`, archive(files));
  }
  outputs.set("SHA256SUMS", Buffer.from([...outputs].filter(([file]) => file.endsWith(".tar.gz")).map(([file, data]) => `${sha256(data)}  ${file}`).join("\n") + "\n"));
  outputs.set(MARKER, json({ generator: "juninmd-skills", version: metadata.version, skillCount: SKILLS.length }));
  return outputs;
}

function compare(actual, expected) {
  return actual.size === expected.size && [...expected].every(([file, bytes]) => actual.get(file)?.equals(bytes));
}

export function buildDistribution(root) {
  const expected = planDistribution(root);
  const destination = path.resolve(root, "dist");
  if (fs.existsSync(destination)) {
    const actual = readTree(destination);
    if (compare(actual, expected)) return destination;
    const marker = actual.get(MARKER);
    if (!marker || JSON.parse(marker.toString("utf8")).generator !== "juninmd-skills") throw new Error("Refusing to replace unowned dist directory");
    // Only the fixed workspace/dist path is removed, after real-directory and ownership checks.
    fs.rmSync(destination, { recursive: true });
  }
  for (const [file, bytes] of expected) {
    const target = path.join(destination, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes, { flag: "wx" });
  }
  return destination;
}

export function checkDistribution(root) {
  if (!compare(readTree(path.join(root, "dist")), planDistribution(root))) throw new Error("Distribution is stale or modified; run dist:build");
}

function assertRealAncestors(target) {
  for (let current = path.resolve(target); ; current = path.dirname(current)) {
    if (fs.existsSync(current) && !fs.lstatSync(current).isDirectory()) throw new Error(`Destination ancestor is not a real directory: ${current}`);
    if (current === path.dirname(current)) break;
  }
}

export function installOpenCode(root, project) {
  if (!project) throw new Error("An explicit project path is required");
  const projectRoot = path.resolve(project);
  assertRealAncestors(projectRoot);
  if (!fs.existsSync(projectRoot)) throw new Error("Project directory must already exist");
  const files = skillFiles(root);
  const destination = path.join(projectRoot, ".opencode/skills");
  assertRealAncestors(destination);
  const pending = [];
  for (const name of SKILLS) {
    const target = path.join(destination, name);
    const expected = new Map([...files].filter(([file]) => file.startsWith(`${name}/`)).map(([file, bytes]) => [file.slice(name.length + 1), bytes]));
    if (fs.existsSync(target)) {
      if (!compare(readTree(target), expected)) throw new Error(`Existing skill differs; no files written: ${name}`);
    } else pending.push(...[...expected].map(([file, bytes]) => [path.join(target, file), bytes]));
  }
  for (const [file, bytes] of pending) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, bytes, { flag: "wx" });
  }
  return destination;
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  if (command === "build" && !args.length) console.log(`Built 4 distributions: ${buildDistribution(root)}`);
  else if (command === "check" && !args.length) { checkDistribution(root); console.log(`4 distributions match canonical source; ${SKILLS.length} skills each.`); }
  else if (command === "install" && args.length === 1) console.log(`OpenCode skills installed: ${installOpenCode(root, args[0])}`);
  else throw new Error("Usage: node .agents/tools/distribution.mjs build|check|install <project-directory>");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
