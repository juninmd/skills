import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  analyzeCommits,
  bumpVersion,
  formatSemver,
  parseSemver,
  updateManifests,
} from "./semantic-release.mjs";

test("parseSemver parses standard semver", () => {
  const v = parseSemver("1.2.3");
  assert.equal(v.major, 1);
  assert.equal(v.minor, 2);
  assert.equal(v.patch, 3);
});

test("bumpVersion calculates correct bumps", () => {
  assert.equal(bumpVersion("1.0.0", "patch"), "1.0.1");
  assert.equal(bumpVersion("1.0.0", "minor"), "1.1.0");
  assert.equal(bumpVersion("1.0.0", "major"), "2.0.0");
});

test("analyzeCommits classifies conventional commit prefixes", () => {
  assert.equal(analyzeCommits(["chore: cleanup"]), null);
  assert.equal(analyzeCommits(["docs: update readme"]), null);
  assert.equal(analyzeCommits(["fix: handle null pointer"]), "patch");
  assert.equal(analyzeCommits(["fix(auth): handle null pointer"]), "patch");
  assert.equal(analyzeCommits(["perf: optimize loop"]), "patch");
  assert.equal(analyzeCommits(["feat: add auto-release workflow"]), "minor");
  assert.equal(analyzeCommits(["feat(api): add endpoint", "fix: minor bug"]), "minor");
  assert.equal(analyzeCommits(["feat!: breaking overhaul"]), "major");
  assert.equal(analyzeCommits(["fix: patch", "BREAKING CHANGE: new contract"]), "major");
});

test("updateManifests updates all 4 plugin files in sync", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "plugin-test-"));
  try {
    fs.mkdirSync(path.join(tempDir, ".claude-plugin"), { recursive: true });
    fs.mkdirSync(path.join(tempDir, ".agents", ".claude-plugin"), { recursive: true });

    fs.writeFileSync(path.join(tempDir, "package.json"), JSON.stringify({ version: "1.0.0" }));
    fs.writeFileSync(path.join(tempDir, "plugin.json"), JSON.stringify({ version: "1.0.0" }));
    fs.writeFileSync(
      path.join(tempDir, ".claude-plugin", "marketplace.json"),
      JSON.stringify({ plugins: [{ version: "1.0.0" }] })
    );
    fs.writeFileSync(
      path.join(tempDir, ".agents", ".claude-plugin", "plugin.json"),
      JSON.stringify({ version: "1.0.0" })
    );

    const updated = updateManifests(tempDir, "1.2.0");
    assert.equal(updated.length, 4);

    assert.equal(JSON.parse(fs.readFileSync(path.join(tempDir, "package.json"))).version, "1.2.0");
    assert.equal(JSON.parse(fs.readFileSync(path.join(tempDir, "plugin.json"))).version, "1.2.0");
    assert.equal(
      JSON.parse(fs.readFileSync(path.join(tempDir, ".claude-plugin", "marketplace.json"))).plugins[0].version,
      "1.2.0"
    );
    assert.equal(
      JSON.parse(fs.readFileSync(path.join(tempDir, ".agents", ".claude-plugin", "plugin.json"))).version,
      "1.2.0"
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
