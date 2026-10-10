import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { listSkills } from "./install.mjs";

const TOOLS = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(TOOLS, "../..");
const INSTALLER = path.join(TOOLS, "install.mjs");
const CLIENTS = ["claude", "codex", "agy", "opencode"];
// Where each client keeps its skill links, relative to HOME.
const SKILL_DIRS = {
  claude: ".claude/skills",
  codex: ".codex/skills",
  agy: ".gemini/config/skills",
  opencode: ".config/opencode/skills",
};
// Config links and the canonical file each one must resolve to.
const CONFIG_LINKS = {
  ".claude/CLAUDE.md": ".agents/AGENTS.md",
  ".claude/settings.json": ".agents/clients/claude/settings.json",
  ".codex/AGENTS.md": ".agents/AGENTS.md",
  ".codex/config.toml": ".agents/clients/codex/config.toml",
  ".gemini/GEMINI.md": ".agents/AGENTS.md",
};
const SKIP_LINKS = process.platform === "win32" && "file symlinks need Developer Mode on Windows";
// Lines that mean the installer touched the filesystem; "ok" lines do not.
const CHANGE = /^(link|relink|backup|import|prune)\s/m;

// install.mjs reads its targets from os.homedir() at load time, so each run gets its own HOME.
function withHome(fn) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "install-test-"));
  try {
    return fn(home);
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
}

function run(home, args) {
  const result = spawnSync(process.execPath, [INSTALLER, ...args], {
    env: { ...process.env, HOME: home, USERPROFILE: home },
    encoding: "utf8",
  });
  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

const linkTarget = (link) => path.resolve(path.dirname(link), fs.readlinkSync(link));

test("a dry run plans the work and writes nothing", () =>
  withHome((home) => {
    const { status, out } = run(home, [...CLIENTS, "--dry-run"]);
    assert.equal(status, 0, out);
    assert.match(out, new RegExp(`^Planned ${listSkills().length} skills into`, "m"));
    assert.deepEqual(fs.readdirSync(home), []);
  }));

test("an unknown client fails with a message and no changes", () =>
  withHome((home) => {
    const { status, out } = run(home, ["vim"]);
    assert.equal(status, 1);
    assert.match(out, /Unknown client 'vim'/);
    assert.deepEqual(fs.readdirSync(home), []);
  }));

test("a real run links every skill and config file to the canonical source", { skip: SKIP_LINKS }, () =>
  withHome((home) => {
    const { status, out } = run(home, CLIENTS);
    assert.equal(status, 0, out);
    for (const client of CLIENTS) {
      for (const name of listSkills()) {
        const link = path.join(home, SKILL_DIRS[client], name);
        assert.equal(linkTarget(link), path.join(REPO, ".agents/skills", name), `${client}/${name}`);
      }
    }
    for (const [link, source] of Object.entries(CONFIG_LINKS)) {
      assert.equal(linkTarget(path.join(home, link)), path.join(REPO, source), link);
    }
  }));

test("a second run changes nothing", { skip: SKIP_LINKS }, () =>
  withHome((home) => {
    assert.equal(run(home, CLIENTS).status, 0);
    const { status, out } = run(home, CLIENTS);
    assert.equal(status, 0, out);
    assert.doesNotMatch(out, CHANGE);
  }));

test("an existing real file is moved aside, never overwritten", { skip: SKIP_LINKS }, () =>
  withHome((home) => {
    const claudeMd = path.join(home, ".claude", "CLAUDE.md");
    fs.mkdirSync(path.dirname(claudeMd), { recursive: true });
    fs.writeFileSync(claudeMd, "my own notes\n");
    const { status, out } = run(home, ["claude"]);
    assert.equal(status, 0, out);
    const backups = fs.readdirSync(path.dirname(claudeMd)).filter((name) => name.startsWith("CLAUDE.md.bak-"));
    assert.equal(backups.length, 1);
    assert.equal(fs.readFileSync(path.join(path.dirname(claudeMd), backups[0]), "utf8"), "my own notes\n");
    assert.equal(linkTarget(claudeMd), path.join(REPO, ".agents/AGENTS.md"));
  }));
