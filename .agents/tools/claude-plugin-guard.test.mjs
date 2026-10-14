import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { isPluginInstalled, pluginId, unlinkRepoSkills } from "./claude-plugin-guard.mjs";

const tempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), "plugin-guard-"));
const dirLink = (target, link) => fs.symlinkSync(target, link, process.platform === "win32" ? "junction" : "dir");

function writeRegistry(home, plugins) {
  const file = path.join(home, ".claude", "plugins", "installed_plugins.json");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ version: 2, plugins }));
}

function createSkills() {
  const root = tempDir();
  const skillsRoot = path.join(root, "repo-skills");
  for (const name of ["alpha", "beta"]) {
    fs.mkdirSync(path.join(skillsRoot, name), { recursive: true });
    fs.writeFileSync(path.join(skillsRoot, name, "SKILL.md"), `# ${name}\n`);
  }
  const skillsDir = path.join(root, "client-skills");
  fs.mkdirSync(skillsDir);
  return { root, skillsRoot, skillsDir };
}

test("the plugin id combines the Claude plugin name and the marketplace name", () => {
  const repo = tempDir();
  fs.mkdirSync(path.join(repo, ".claude-plugin"));
  fs.mkdirSync(path.join(repo, ".agents", ".claude-plugin"), { recursive: true });
  fs.writeFileSync(path.join(repo, ".claude-plugin", "marketplace.json"), JSON.stringify({ name: "skills" }));
  fs.writeFileSync(path.join(repo, ".agents", ".claude-plugin", "plugin.json"), JSON.stringify({ name: "juninmd" }));
  assert.equal(pluginId(repo), "juninmd@skills");
});

test("an installed plugin is detected from the Claude plugin registry", () => {
  const home = tempDir();
  writeRegistry(home, { "juninmd@skills": [{ scope: "user" }] });
  assert.equal(isPluginInstalled(home, "juninmd@skills"), true);
});

test("a missing registry, another plugin or an empty install list means symlinks stay allowed", () => {
  assert.equal(isPluginInstalled(tempDir(), "juninmd@skills"), false);
  const home = tempDir();
  writeRegistry(home, { "other@market": [{ scope: "user" }], "juninmd@skills": [] });
  assert.equal(isPluginInstalled(home, "juninmd@skills"), false);
});

test("unlinking removes repo skill links but keeps the repo skill content", () => {
  const { skillsRoot, skillsDir } = createSkills();
  dirLink(path.join(skillsRoot, "alpha"), path.join(skillsDir, "alpha"));
  assert.equal(unlinkRepoSkills(skillsDir, skillsRoot, ["alpha", "beta"], { log: () => {} }), 1);
  assert.equal(fs.existsSync(path.join(skillsDir, "alpha")), false);
  assert.equal(fs.readFileSync(path.join(skillsRoot, "alpha", "SKILL.md"), "utf8"), "# alpha\n");
});

test("links through an intermediate junction to the repo are also removed", () => {
  const { root, skillsRoot, skillsDir } = createSkills();
  const hop = path.join(root, "hop");
  dirLink(skillsRoot, hop);
  dirLink(path.join(hop, "beta"), path.join(skillsDir, "beta"));
  assert.equal(unlinkRepoSkills(skillsDir, skillsRoot, ["beta"], { log: () => {} }), 1);
  assert.equal(fs.existsSync(path.join(skillsDir, "beta")), false);
});

test("real directories and links to other sources are never removed", () => {
  const { root, skillsRoot, skillsDir } = createSkills();
  fs.mkdirSync(path.join(skillsDir, "alpha"));
  const foreign = path.join(root, "foreign-beta");
  fs.mkdirSync(foreign);
  dirLink(foreign, path.join(skillsDir, "beta"));
  assert.equal(unlinkRepoSkills(skillsDir, skillsRoot, ["alpha", "beta"], { log: () => {} }), 0);
  assert.equal(fs.existsSync(path.join(skillsDir, "alpha")), true);
  assert.equal(fs.lstatSync(path.join(skillsDir, "beta")).isSymbolicLink(), true);
});

test("a dry run reports links without removing them", () => {
  const { skillsRoot, skillsDir } = createSkills();
  dirLink(path.join(skillsRoot, "alpha"), path.join(skillsDir, "alpha"));
  assert.equal(unlinkRepoSkills(skillsDir, skillsRoot, ["alpha"], { dryRun: true, log: () => {} }), 1);
  assert.equal(fs.lstatSync(path.join(skillsDir, "alpha")).isSymbolicLink(), true);
});
