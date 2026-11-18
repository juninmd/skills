#!/usr/bin/env node
// Semantic release planner for Tauri 2 desktop apps. Node >= 20, no dependencies.
// Usage: node scripts/release.mjs plan | notes TAG SHA PREV OUT | manifest REL SIGDIR NOTES OUT TAG VER | verify MANIFEST REL TAG VER
// Pattern from juninmd/canto-widget (scripts/release*.ts). Prune PLATFORMS to the targets the app ships.
import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const PLATFORMS = {
  "windows-x86_64": /_x64-setup\.exe$/,
  "darwin-aarch64": /_aarch64\.app\.tar\.gz$/,
  "darwin-x86_64": /_x64\.app\.tar\.gz$/,
  "linux-x86_64": /_(?:amd64|x86_64)\.AppImage$/,
};
const RANK = { patch: 1, minor: 2, major: 3 };
const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const gh = (...args) => execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const lines = (text) => (text ? text.split("\n") : []);
const repo = () => process.env.GITHUB_REPOSITORY ?? gh("repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner");

export function title(message) {
  const all = message.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return all[0]?.startsWith("Merge pull request") ? (all[1] ?? all[0]) : (all[0] ?? "");
}
function lineBump(line) {
  if (/^[a-z][\w-]*(?:\([^\r\n()]+\))?!:/i.test(line)) return "major";
  const type = /^([a-z][\w-]*)(?:\([^\r\n()]+\))?:/i.exec(line)?.[1]?.toLowerCase();
  if (type === "feat") return "minor";
  if (type === "fix" || type === "perf") return "patch";
  return undefined;
}
const strongest = (a, b) => (!a || !b ? (a ?? b) : RANK[b] > RANK[a] ? b : a);

/** Bump asked by one commit: title, BREAKING CHANGE footer, or squash-body bullets. */
export function releaseBump(message) {
  if (/^BREAKING[ -]CHANGE\s*:/im.test(message)) return "major";
  let bump = lineBump(title(message));
  for (const line of message.split(/\r?\n/).slice(1)) {
    const bullet = /^[*-]\s+(.+)$/.exec(line.trim())?.[1];
    if (bullet) bump = strongest(bump, lineBump(bullet));
  }
  return bump;
}
export function bumpVersion(version, bump) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!m) throw new Error(`Invalid version: ${version}`);
  const [major, minor, patch] = m.slice(1).map(Number);
  return bump === "major" ? `${major + 1}.0.0` : bump === "minor" ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`;
}
const bundle = (assets, version, re) => assets.find((n) => n.includes(version) && re.test(n) && assets.includes(`${n}.sig`));
export const hasRequiredAssets = (assets, version) =>
  assets.includes("latest.json") && Object.values(PLATFORMS).every((re) => bundle(assets, version, re));

/** Walk first-parent commits oldest first; every commit that asks for a bump becomes the next version. */
export function planReleases(commits, tags, releases, previousTag) {
  let version = previousTag.replace(/^v/, "");
  let prior = previousTag;
  let pending;
  const out = [];
  for (const c of commits) {
    if (!/^[0-9a-f]{40}$/.test(c.sha)) throw new Error(`Invalid commit: ${c.sha}`);
    pending = strongest(pending, releaseBump(c.message));
    if (!pending || c.taggable === false) continue; // folded into the next taggable release
    version = bumpVersion(version, pending);
    pending = undefined;
    const tag = `v${version}`;
    if (tags.get(tag) && tags.get(tag) !== c.sha) throw new Error(`${tag} already points to another commit`);
    const rel = releases.get(tag);
    if (rel && !rel.draft) {
      if (!hasRequiredAssets(rel.assets, version)) throw new Error(`${tag} was published without complete installers`);
    } else out.push({ sha: c.sha, tag, version, previousTag: prior });
    prior = tag;
  }
  return out;
}

/** GITHUB_TOKEN cannot tag a commit whose .github/workflows differs from every branch tip. */
const workflowsTree = (rev) => git("ls-tree", rev, ".github/workflows").split(/\s+/)[2] ?? "";

function plan() {
  const tagNames = lines(git("tag", "--list", "v[0-9]*.[0-9]*.[0-9]*"));
  const tags = new Map(tagNames.map((t) => [t, git("rev-parse", `${t}^{commit}`)]));
  const rows = lines(gh("api", "--paginate", `repos/${repo()}/releases?per_page=100`, "--jq",
    ".[] | {tag: .tag_name, draft: .draft, assets: [.assets[].name]} | @json")).map((l) => JSON.parse(l));
  const releases = new Map(rows.map((r) => [r.tag, r]));
  const published = rows.filter((r) => /^v\d+\.\d+\.\d+$/.test(r.tag) && !r.draft && tags.has(r.tag))
    .sort((a, b) => b.tag.localeCompare(a.tag, undefined, { numeric: true }));
  const previous = published.find((r) => { try { git("merge-base", "--is-ancestor", r.tag, "origin/main"); return true; } catch { return false; } });
  if (!previous) throw new Error("No published SemVer release found on main: publish a first v0.1.0 release by hand");
  const tip = workflowsTree("origin/main");
  const commits = lines(git("rev-list", "--first-parent", "--reverse", `${previous.tag}..origin/main`)).map((sha) => {
    const wf = workflowsTree(sha);
    return { sha, message: git("log", "-1", "--format=%B", sha), taggable: wf === "" || wf === tip };
  });
  const pending = planReleases(commits, tags, releases, previous.tag);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `candidate=${JSON.stringify(pending[0] ?? {})}\nmore=${pending.length > 1}\n`);
  }
  console.log(JSON.stringify(pending));
}

const GROUPS = [["feat", "Novidades"], ["fix", "Correções"], ["perf", "Desempenho"], ["refactor", "Refatoração"]];
/** Deterministic notes: the updater manifest must carry byte-identical text, so no timestamps or randomness. */
export function releaseNotes(tag, previousTag, repository, subjects) {
  const buckets = new Map(GROUPS.map(([k]) => [k, []]));
  for (const s of subjects) {
    const m = /^([a-z]+)(?:\([^)]*\))?!?:\s*(.+)$/i.exec(s);
    const bucket = m && buckets.get(m[1].toLowerCase());
    if (bucket) bucket.push(m[2]);
  }
  const body = GROUPS.flatMap(([k, label]) => (buckets.get(k).length ? [`### ${label}`, ...buckets.get(k).map((x) => `- ${x}`), ""] : []));
  const compare = `https://github.com/${repository}/compare/${previousTag}...${tag}`;
  return `${tag}\n\n${body.join("\n")}\n**Changelog completo:** ${compare}\n`;
}
function notes([tag, sha, previousTag, out]) {
  const range = lines(git("rev-list", "--first-parent", "--reverse", `${previousTag}..${sha}`));
  const subjects = range.flatMap((c) => {
    const [first, ...rest] = git("log", "-1", "--format=%B", c).split(/\r?\n/);
    const bullets = rest.flatMap((l) => /^[*-]\s+(.+)$/.exec(l.trim())?.[1] ?? []);
    return bullets.length ? bullets : [title(first)];
  });
  writeFileSync(out, releaseNotes(tag, previousTag, repo(), subjects));
}

export function createManifest(release, signatures, tag, version, notesText, repository, now = new Date().toISOString()) {
  if (release.tag_name !== tag || !release.draft || !notesText.trim()) throw new Error("Invalid tag, draft or changelog");
  const names = release.assets.map((a) => a.name);
  const prefix = `https://api.github.com/repos/${repository}/releases/assets/`;
  const platforms = Object.fromEntries(Object.entries(PLATFORMS).map(([p, re]) => {
    const name = bundle(names, version, re);
    const asset = release.assets.find((a) => a.name === name);
    const signature = name ? signatures.get(`${name}.sig`)?.trim() : undefined;
    if (!asset || !signature) throw new Error(`Missing installer or signature for ${p}`);
    return [p, { signature, url: `${prefix}${asset.id}` }];
  }));
  return { version, notes: notesText, pub_date: now, platforms };
}
export function verifyManifest(manifest, release, tag, version, repository) {
  if (release.tag_name !== tag || !release.draft || manifest.version !== version) throw new Error("Invalid tag, draft or version");
  if (manifest.notes?.trim() !== release.body?.trim()) throw new Error("Updater notes differ from the release body");
  const names = release.assets.map((a) => a.name);
  if (!hasRequiredAssets(names, version)) throw new Error("Incomplete installers");
  const prefix = `https://api.github.com/repos/${repository}/releases/assets/`;
  for (const [p, re] of Object.entries(PLATFORMS)) {
    const e = manifest.platforms?.[p];
    const id = e?.url?.startsWith(prefix) ? e.url.slice(prefix.length) : "";
    const asset = /^\d+$/.test(id) ? release.assets.find((a) => a.id === Number(id)) : undefined;
    if (!e?.signature || !asset || asset.name !== bundle(names, version, re)) throw new Error(`Invalid updater entry for ${p}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [cmd, ...a] = process.argv.slice(2);
  if (cmd === "plan") plan();
  else if (cmd === "notes" && a.length === 4 && /^v\d+\.\d+\.\d+$/.test(a[0])) notes(a);
  else if (cmd === "manifest" && a.length === 6) {
    const [rel, sigs, notesPath, out, tag, version] = a;
    const signatures = new Map(readdirSync(sigs).filter((n) => n.endsWith(".sig")).map((n) => [n, readFileSync(join(sigs, n), "utf8")]));
    const m = createManifest(JSON.parse(readFileSync(rel, "utf8")), signatures, tag, version, readFileSync(notesPath, "utf8"), repo());
    writeFileSync(out, `${JSON.stringify(m, null, 2)}\n`);
  } else if (cmd === "verify" && a.length === 4) {
    verifyManifest(JSON.parse(readFileSync(a[0], "utf8")), JSON.parse(readFileSync(a[1], "utf8")), a[2], a[3], repo());
    console.log(`Updater ${a[2]} verified`);
  } else throw new Error("Use: plan | notes TAG SHA PREV OUT | manifest REL SIGDIR NOTES OUT TAG VER | verify MANIFEST REL TAG VER");
}
