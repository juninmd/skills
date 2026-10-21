#!/usr/bin/env node
// Collapse error lines on stdin into stable signatures and mark each NEW or KNOWN against a ledger.
// Usage: <log source> | node signatures.mjs [--ledger ledger.json] [--pattern REGEX] [--top 15]
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const ledgerPath = opt("--ledger");
const pattern = new RegExp(opt("--pattern", "error|fail|fatal|panic|exception|traceback|crash|segfault|oom|timeout|refused"), "i");
const top = Number(opt("--top", 15));

// Volatile tokens are replaced so one defect yields one signature across time, ids, and counts.
export function signature(line) {
  return line
    .replace(/\x1b\[[0-9;]*m/g, "")
    .replace(/\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?/g, "<ts>")
    .replace(/\b\d{1,2}:\d{2}:\d{2}(\.\d+)?\b/g, "<ts>")
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "<uuid>")
    .replace(/\b0x[0-9a-f]+\b/gi, "<hex>")
    .replace(/\b\d{1,3}(\.\d{1,3}){3}(:\d+)?\b/g, "<ip>")
    .replace(/\b[0-9a-f]{12,}\b/gi, "<id>")
    .replace(/\d+/g, "<n>")
    .replace(/\s+/g, " ")
    .replace(/^(<ts>\s*)+/, "")
    .trim()
    .slice(0, 200);
}

export function summarize(lines, known = {}, re = pattern) {
  const groups = new Map();
  for (const line of lines) {
    if (!re.test(line)) continue;
    const key = signature(line);
    const g = groups.get(key) ?? { signature: key, count: 0, example: line.trim().slice(0, 240) };
    g.count += 1;
    groups.set(key, g);
  }
  return [...groups.values()]
    .map((g) => ({ ...g, status: known[g.signature]?.status ?? "NEW" }))
    .sort((a, b) => (b.status === "NEW") - (a.status === "NEW") || b.count - a.count);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const known = ledgerPath && fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, "utf8")) : {};
  const lines = fs.readFileSync(0, "utf8").split(/\r?\n/);
  const rows = summarize(lines, known);
  for (const r of rows.slice(0, top)) console.log(`${r.status}\t${r.count}\t${r.signature}\n\t e.g. ${r.example}`);
  console.log(`-- ${rows.length} signatures, ${rows.filter((r) => r.status === "NEW").length} new`);
}
