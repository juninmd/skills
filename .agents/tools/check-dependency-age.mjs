import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const REGISTRY = "https://registry.npmjs.org";
// The official Vite packument exceeds 37 MiB; keep a bound above real registry data.
export const MAX_RESPONSE = 64 * 1024 * 1024;
const MAX_REQUESTS = 6;
const TIMEOUT_MS = 15_000;
const GLOBAL_MS = 120_000;

export function parseLockfile(text) {
  const lock = parse(text);
  if (!lock || !/^9(?:\.0)?$/.test(String(lock.lockfileVersion))) {
    throw new Error("unsupported pnpm lockfile major; expected pnpm lockfileVersion 9");
  }
  const packages = lock.packages;
  if (!packages || typeof packages !== "object" || !Object.keys(packages).length) {
    throw new Error("lockfile has no package records");
  }
  const records = new Map();
  for (const [key, value] of Object.entries(packages)) {
    const match = key.match(/^(@[a-z0-9._~-]+\/[a-z0-9._~-]+|[a-z0-9._~-]+)@(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?)(?:\([^)]*\))?$/i);
    if (!match || !value?.resolution?.integrity || value.resolution.tarball || value.resolution.repo) {
      throw new Error("unsupported or incomplete registry package record");
    }
    const [name, version] = match.slice(1);
    if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version)) throw new Error(`invalid package version: ${key}`);
    if (!/^sha(512|256)-[A-Za-z0-9+/=]+$/.test(value.resolution.integrity)) throw new Error(`invalid integrity: ${key}`);
    const id = `${name}@${version}`;
    if (records.has(id) && records.get(id).integrity !== value.resolution.integrity) {
      throw new Error(`conflicting locked integrity for ${id}`);
    }
    if (!records.has(id)) records.set(id, { name, version, integrity: value.resolution.integrity, lockKeys: [] });
    records.get(id).lockKeys.push(key);
  }
  return [...records.values()];
}

async function boundedJson(fetchImpl, url, deadline) {
  const controller = new AbortController();
  if (Date.now() >= deadline) throw new Error("global registry deadline exceeded");
  const timer = setTimeout(() => controller.abort(), Math.max(1, Math.min(TIMEOUT_MS, deadline - Date.now())));
  try {
    const response = await fetchImpl(url, { redirect: "error", signal: controller.signal });
    if (!response.ok) throw new Error(`registry returned HTTP ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error("registry response has no bounded body");
    let size = 0;
    const chunks = [];
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_RESPONSE) {
        await reader.cancel();
        controller.abort();
        throw new Error("registry response exceeds 64 MiB");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  } finally { clearTimeout(timer); }
}

export async function checkDependencyAge(lockText, { minimumAgeMinutes = 1440, workspaceText = "", now = () => Date.now(), fetchImpl = fetch } = {}) {
  if (!Number.isInteger(minimumAgeMinutes) || minimumAgeMinutes < 1440) throw new Error("minimum release age must be an integer of at least 1440 minutes");
  if (workspaceText) {
    const configured = parse(workspaceText)?.minimumReleaseAge;
    if (!Number.isSafeInteger(configured) || configured < 1440) {
      throw new Error("workspace minimumReleaseAge must be an integer of at least 1440 minutes");
    }
    minimumAgeMinutes = Math.max(minimumAgeMinutes, configured);
  }
  const records = parseLockfile(lockText);
  const deadline = Date.now() + GLOBAL_MS;
  const errors = [];
  let index = 0;
  let checked = 0;
  async function worker() {
    while (index < records.length && errors.length < 20) {
      const record = records[index++];
      try {
        checked += 1;
        const metadata = await boundedJson(fetchImpl, `${REGISTRY}/${encodeURIComponent(record.name)}`, deadline);
        const timestamp = metadata?.time?.[record.version];
        const published = typeof timestamp === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(timestamp) ? Date.parse(timestamp) : NaN;
        if (!Number.isFinite(published) || new Date(published).toISOString() !== timestamp || metadata?.versions?.[record.version]?.dist?.integrity !== record.integrity) {
          throw new Error("missing, invalid, or integrity-mismatched official release metadata");
        }
        const currentTime = now();
        if (published > currentTime) throw new Error("official publication timestamp is in the future");
        if (currentTime - published < minimumAgeMinutes * 60_000) throw new Error(`release is younger than ${minimumAgeMinutes} minutes`);
      } catch (error) {
        const message = String(error.message);
        const reason = /^(registry returned HTTP \d+|registry response exceeds 64 MiB|registry response has no bounded body|global registry deadline exceeded|missing, invalid, or integrity-mismatched official release metadata|official publication timestamp is in the future|release is younger than \d+ minutes)$/.test(message)
          ? message : "registry metadata request or parsing failed";
        errors.push({ package: `${record.name}@${record.version}`, reason });
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(MAX_REQUESTS, records.length) }, worker));
  return { ok: errors.length === 0, checked, total: records.length, errors: errors.slice(0, 20) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = path.resolve(process.argv[2] || "pnpm-lock.yaml");
  const workspaceText = await fs.readFile(path.join(path.dirname(file), "pnpm-workspace.yaml"), "utf8");
  const result = await checkDependencyAge(await fs.readFile(file, "utf8"), { workspaceText });
  console.log(`Dependency age check: ${result.checked}/${result.total} unique packages checked; ${result.errors.length} failures.`);
  if (!result.ok) { for (const error of result.errors) console.error(`${error.package}: ${error.reason}`); process.exitCode = 1; }
}
