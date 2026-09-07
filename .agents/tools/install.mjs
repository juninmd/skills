// Install this repo into Claude Code, Codex, and Antigravity (agy) via symlinks, so every
// client reads the canonical source and picks up edits without a reinstall.
//   node .agents/tools/install.mjs [claude|codex|agy|all]... [--dry-run] [--no-config]
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const AGENTS_ROOT = path.join(REPO, ".agents");
const SKILLS_ROOT = path.join(AGENTS_ROOT, "skills");
const HOME = os.homedir();
const INSTRUCTIONS = path.join(AGENTS_ROOT, "AGENTS.md");
const WINDOWS = process.platform === "win32";

// skills: where each skill directory is linked; files: [link, target] for instruction and config files.
const CLIENTS = {
  claude: {
    skills: path.join(HOME, ".claude", "skills"),
    files: [
      [path.join(HOME, ".claude", "CLAUDE.md"), INSTRUCTIONS],
      [path.join(HOME, ".claude", "settings.json"), path.join(AGENTS_ROOT, "clients", "claude", "settings.json")],
    ],
  },
  codex: {
    skills: path.join(HOME, ".codex", "skills"),
    files: [
      [path.join(HOME, ".codex", "AGENTS.md"), INSTRUCTIONS],
      [path.join(HOME, ".codex", "config.toml"), path.join(AGENTS_ROOT, "clients", "codex", "config.toml")],
    ],
  },
  agy: {
    skills: path.join(HOME, ".gemini", "config", "skills"),
    files: [[path.join(HOME, ".gemini", "GEMINI.md"), INSTRUCTIONS]],
  },
};

export function listSkills(root = SKILLS_ROOT) {
  return fs.readdirSync(root).filter((name) => fs.existsSync(path.join(root, name, "SKILL.md"))).sort();
}

// Claude Code and Gemini read `@path` imports, so an import stub tracks the repo like a symlink would.
const importStub = (target) => `@${target.replace(/\\/g, "/")}\n`;

function linkState(link, target) {
  let stat;
  try { stat = fs.lstatSync(link); } catch { return "missing"; }
  if (stat.isSymbolicLink()) {
    return path.resolve(path.dirname(link), fs.readlinkSync(link)) === path.resolve(target) ? "ok" : "stale";
  }
  if (stat.isFile() && fs.readFileSync(link, "utf8") === importStub(target)) return "ok";
  return "real";
}

function backupName(file) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
  return `${file}.bak-${stamp}`;
}

// Only Claude Code and Gemini honor `@path` imports; Codex AGENTS.md has no include syntax.
const IMPORT_CAPABLE = new Set(["CLAUDE.md", "GEMINI.md"]);

function link(linkPath, target, kind, dryRun, log) {
  const link = linkPath;
  const state = linkState(link, target);
  if (state === "ok") return log(`ok      ${link}`);
  let backup;
  if (state === "real") {
    backup = backupName(link);
    log(`backup  ${link} -> ${backup}`);
    if (!dryRun) fs.renameSync(link, backup);
  } else if (state === "stale") {
    log(`relink  ${link}`);
    if (!dryRun) fs.rmSync(link, { recursive: false, force: true });
  } else {
    log(`link    ${link} -> ${target}`);
  }
  if (dryRun) return;
  fs.mkdirSync(path.dirname(link), { recursive: true });
  try {
    // Junctions need no privilege on Windows; file symlinks need Developer Mode or an elevated shell.
    fs.symlinkSync(target, link, kind === "dir" ? (WINDOWS ? "junction" : "dir") : "file");
  } catch (error) {
    if (error.code === "EPERM" && IMPORT_CAPABLE.has(path.basename(link))) {
      fs.writeFileSync(link, importStub(target));
      return log(`import  ${link} (symlink denied; wrote an @import stub instead)`);
    }
    if (backup) fs.renameSync(backup, link); // leave the client exactly as it was
    throw error;
  }
}

function pruneStale(skillsDir, dryRun, log) {
  if (!fs.existsSync(skillsDir)) return;
  for (const name of fs.readdirSync(skillsDir)) {
    const entry = path.join(skillsDir, name);
    if (!fs.lstatSync(entry).isSymbolicLink()) continue;
    const target = path.resolve(path.dirname(entry), fs.readlinkSync(entry));
    if (target.startsWith(SKILLS_ROOT) && !fs.existsSync(path.join(target, "SKILL.md"))) {
      log(`prune   ${entry} (retired skill)`);
      if (!dryRun) fs.rmSync(entry, { recursive: false, force: true });
    }
  }
}

export function install(clients, { dryRun = false, config = true, log = console.log } = {}) {
  const skills = listSkills();
  const failures = [];
  for (const client of clients) {
    const spec = CLIENTS[client];
    if (!spec) throw new Error(`Unknown client '${client}'; use ${Object.keys(CLIENTS).join(", ")} or all`);
    log(`# ${client}`);
    pruneStale(spec.skills, dryRun, log);
    for (const name of skills) link(path.join(spec.skills, name), path.join(SKILLS_ROOT, name), "dir", dryRun, log);
    for (const [target, source] of spec.files) {
      if (!config && !source.endsWith("AGENTS.md")) continue;
      try {
        link(target, source, "file", dryRun, log);
      } catch (error) {
        failures.push(`${target}: ${error.message}`);
      }
    }
  }
  return { skills: skills.length, failures };
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const config = !args.includes("--no-config");
  const named = args.filter((arg) => !arg.startsWith("--"));
  const clients = !named.length || named.includes("all") ? Object.keys(CLIENTS) : named;
  try {
    const { skills, failures } = install(clients, { dryRun, config });
    console.log(`${dryRun ? "Planned" : "Linked"} ${skills} skills into ${clients.join(", ")}.`);
    if (failures.length) {
      console.error(failures.map((line) => `FAILED  ${line}`).join("\n"));
      if (WINDOWS) console.error("File symlinks on Windows need Developer Mode or an elevated shell; rerun there to link the config files.");
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
