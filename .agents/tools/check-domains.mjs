// Every http(s) host a skill cites must be approved, with a reason, in
// .agents/approved-domains.toml.
//
// Skills are instructions an agent follows, so a URL in one is a place the agent
// may fetch, install from, or send data to. An unreviewed host reaches every
// client on the next install; this gate makes adding one a visible decision.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DOMAIN_ROOTS = [".agents/skills"];
export const ALLOWLIST_FILE = ".agents/approved-domains.toml";
export const SECTIONS = new Set(["approved", "placeholders"]);

// A match stops at the next scheme, so a URL nested in a query or fragment is checked too.
const URL_PATTERN = /https?:\/\/(\[[0-9a-f:.]+\]|(?:(?!https?:\/\/)[^\s<>"'`()[\]{}|\\^])*)/gi;
const LABEL = "[a-z0-9]([a-z0-9-]*[a-z0-9])?";
const HOST_PATTERN = new RegExp(`^${LABEL}(\\.${LABEL})*$|^\\[[0-9a-f:.]+\\]$`);
// A wildcard needs at least two labels after "*.", so "*.com" cannot approve a whole TLD.
const WILDCARD_PATTERN = new RegExp(`^\\*\\.${LABEL}(\\.${LABEL})+$`);

// A strict TOML subset: `[section]` headers and `"host" = "reason"` pairs. Anything
// else fails loudly instead of being guessed at, so no parser dependency is needed.
export function parseAllowlist(text) {
  const entries = new Map();
  const errors = [];
  const seen = new Set();
  let section = null;
  text.replace(/^\uFEFF/, "").split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    const where = `line ${index + 1}`;
    if (!line || line.startsWith("#")) return;
    const header = line.match(/^\[([a-z]+)\]$/);
    if (header) {
      section = header[1];
      if (!SECTIONS.has(section)) errors.push(`${where}: unknown section [${section}]`);
      if (seen.has(section)) errors.push(`${where}: section [${section}] is declared twice`);
      seen.add(section);
      return;
    }
    const pair = line.match(/^"([^"\\]+)"\s*=\s*"([^"\\]*)"\s*(#.*)?$/);
    if (!pair) return errors.push(`${where}: expected "host" = "reason" (no backslashes or inner quotes)`);
    const [, host, reason] = pair;
    if (!section) return errors.push(`${where}: "${host}" is outside a section`);
    if (!(host.startsWith("*.") ? WILDCARD_PATTERN : HOST_PATTERN).test(host)) {
      errors.push(`${where}: "${host}" is not a lowercase hostname or a "*.name.tld" wildcard`);
    }
    if (!reason.trim()) errors.push(`${where}: "${host}" needs a reason`);
    if (entries.has(host)) errors.push(`${where}: "${host}" is listed twice`);
    entries.set(host, { section, reason });
  });
  return { entries, errors };
}

export function extractHosts(text) {
  const found = [];
  // Undo JSON-escaped slashes and backslash separators that browsers read as "//".
  const normalized = text.replace(/\\\//g, "/").replace(/(https?:)\\\\/gi, "$1//");
  normalized.split(/\r?\n/).forEach((line, index) => {
    for (const match of line.matchAll(URL_PATTERN)) {
      let host = match[1].split(/[/?#]/)[0];
      host = host.slice(host.lastIndexOf("@") + 1);
      if (!host.startsWith("[")) host = host.split(":")[0];
      host = host.toLowerCase().replace(/[.,;:!?*]+$/, "");
      if (host) found.push({ host, line: index + 1 });
    }
  });
  return found;
}

// A `*.domain` entry covers subdomains only; the apex needs its own entry.
export function approvingEntry(host, entries) {
  if (entries.has(host)) return host;
  for (let dot = host.indexOf("."); dot !== -1; dot = host.indexOf(".", dot + 1)) {
    const wildcard = `*${host.slice(dot)}`;
    if (entries.has(wildcard)) return wildcard;
  }
  return null;
}

// Everything a symlink install ships is scanned; links are not followed, so a loop cannot recurse.
export function collectFiles(roots, cwd = process.cwd()) {
  const files = [];
  const walk = (target) => {
    const stats = fs.lstatSync(target);
    if (stats.isSymbolicLink()) return;
    if (stats.isFile()) return files.push(target);
    for (const entry of fs.readdirSync(target)) walk(path.join(target, entry));
  };
  for (const root of roots) {
    const resolved = path.resolve(cwd, root);
    if (fs.existsSync(resolved)) walk(resolved);
  }
  return files.sort();
}

// UTF-16 with a byte-order mark is text (Windows PowerShell saves .ps1 that way); other NULs mean binary.
export function readText(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xfe) return buffer.subarray(2).toString("utf16le");
  if (buffer[0] === 0xfe && buffer[1] === 0xff) return Buffer.from(buffer.subarray(2)).swap16().toString("utf16le");
  return buffer.includes(0) ? null : buffer.toString("utf8");
}

const display = (cwd, file) => path.relative(cwd, file).split(path.sep).join("/");

export function checkDomains(files, allowlistText, cwd = process.cwd()) {
  const { entries, errors } = parseAllowlist(allowlistText);
  const used = new Set();
  for (const file of files) {
    const text = readText(fs.readFileSync(file));
    if (text === null) continue;
    for (const { host, line } of extractHosts(text)) {
      const where = `${display(cwd, file)}:${line}`;
      if (!HOST_PATTERN.test(host)) {
        errors.push(`${where}: "${host}" is not a hostname; use a literal host or a reserved placeholder`);
        continue;
      }
      const entry = approvingEntry(host, entries);
      if (entry) used.add(entry);
      else errors.push(`${where}: ${host} is not approved in ${ALLOWLIST_FILE}`);
    }
  }
  for (const host of entries.keys()) {
    if (!used.has(host)) errors.push(`${ALLOWLIST_FILE}: "${host}" is approved but no skill cites it; remove it`);
  }
  return { errors, hosts: used.size };
}

function main() {
  const allowlist = path.resolve(ALLOWLIST_FILE);
  if (!fs.existsSync(allowlist)) {
    console.error(`ERROR: ${ALLOWLIST_FILE} is missing`);
    process.exit(1);
  }
  const files = collectFiles(DOMAIN_ROOTS);
  const { errors, hosts } = checkDomains(files, fs.readFileSync(allowlist, "utf8"));
  if (errors.length) {
    console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(`${files.length} skill files, ${hosts} approved hosts, no unapproved domains.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
