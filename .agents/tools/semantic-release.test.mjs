import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  analyzeCommits,
  bumpVersion,
  formatSemver,
  getCommitsSinceTag,
  getLatestTag,
  parseSemver,
  planRelease,
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

test("analyzeCommits classifies conventional commit prefixes and BREAKING CHANGE footers", () => {
  assert.equal(analyzeCommits(["chore: cleanup"]), null);
  assert.equal(analyzeCommits(["docs: update readme"]), null);
  assert.equal(analyzeCommits(["fix: handle null pointer"]), "patch");
  assert.equal(analyzeCommits(["fix(auth): handle null pointer"]), "patch");
  assert.equal(analyzeCommits(["perf: optimize loop"]), "patch");
  assert.equal(analyzeCommits(["feat: add auto-release workflow"]), "minor");
  assert.equal(analyzeCommits(["feat(api): add endpoint", "fix: minor bug"]), "minor");
  assert.equal(analyzeCommits(["feat!: breaking overhaul"]), "major");
  assert.equal(analyzeCommits(["fix: patch", "BREAKING CHANGE: new contract"]), "major");
  assert.equal(analyzeCommits(["feat: x\n\nBREAKING CHANGE: y"]), "major");
  assert.equal(analyzeCommits(["feat: x\n\nBREAKING-CHANGE: y"]), "major");
});

test("updateManifests updates all plugin files including sub-plugin manifests and marketplace entries in sync", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "plugin-test-"));
  try {
    fs.mkdirSync(path.join(tempDir, ".claude-plugin"), { recursive: true });
    fs.mkdirSync(path.join(tempDir, ".agents", ".claude-plugin"), { recursive: true });
    fs.mkdirSync(path.join(tempDir, "plugins", "core", ".claude-plugin"), { recursive: true });

    fs.writeFileSync(path.join(tempDir, "package.json"), JSON.stringify({ version: "1.0.0" }));
    fs.writeFileSync(path.join(tempDir, "plugin.json"), JSON.stringify({ version: "1.0.0" }));
    fs.writeFileSync(
      path.join(tempDir, ".claude-plugin", "marketplace.json"),
      JSON.stringify({
        plugins: [
          { name: "juninmd", version: "1.0.0" },
          { name: "juninmd-core", version: "1.0.0" },
        ],
      })
    );
    fs.writeFileSync(
      path.join(tempDir, ".agents", ".claude-plugin", "plugin.json"),
      JSON.stringify({ version: "1.0.0" })
    );
    fs.writeFileSync(
      path.join(tempDir, "plugins", "core", ".claude-plugin", "plugin.json"),
      JSON.stringify({ version: "1.0.0" })
    );

    const updated = updateManifests(tempDir, "1.2.0");
    assert.equal(updated.length, 5);

    assert.equal(JSON.parse(fs.readFileSync(path.join(tempDir, "package.json"))).version, "1.2.0");
    assert.equal(JSON.parse(fs.readFileSync(path.join(tempDir, "plugin.json"))).version, "1.2.0");
    const m = JSON.parse(fs.readFileSync(path.join(tempDir, ".claude-plugin", "marketplace.json")));
    assert.equal(m.plugins[0].version, "1.2.0");
    assert.equal(m.plugins[1].version, "1.2.0");
    assert.equal(
      JSON.parse(fs.readFileSync(path.join(tempDir, ".agents", ".claude-plugin", "plugin.json"))).version,
      "1.2.0"
    );
    assert.equal(
      JSON.parse(fs.readFileSync(path.join(tempDir, "plugins", "core", ".claude-plugin", "plugin.json"))).version,
      "1.2.0"
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("integration: BREAKING CHANGE footer in commit body results in major bump", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "git-repro-"));
  try {
    execSync("git init " + tempDir);
    execSync("git -C " + tempDir + " config user.name \"Test\"");
    execSync("git -C " + tempDir + " config user.email \"test@example.com\"");
    fs.writeFileSync(path.join(tempDir, "package.json"), JSON.stringify({ version: "1.0.0" }));
    execSync("git -C " + tempDir + " add package.json");
    execSync("git -C " + tempDir + " commit -m \"chore: init\"");
    execSync("git -C " + tempDir + " tag v1.0.0");
    execSync("git -C " + tempDir + " commit --allow-empty -m \"feat(api): novo formato\" -m \"BREAKING CHANGE: remove o campo x\"");

    const plan = planRelease(tempDir);
    assert.equal(plan.bumpType, "major");
    assert.equal(plan.newVersion, "2.0.0");
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("integration: shell injection in tag name is mitigated and handled safely", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "git-sec-"));
  const pwnedFile = path.join(tempDir, "pwned");
  try {
    execSync("git init " + tempDir);
    execSync("git -C " + tempDir + " config user.name \"Test\"");
    execSync("git -C " + tempDir + " config user.email \"test@example.com\"");
    fs.writeFileSync(path.join(tempDir, "package.json"), JSON.stringify({ version: "1.0.0" }));
    execSync("git -C " + tempDir + " add package.json");
    execSync("git -C " + tempDir + " commit -m \"chore: init\"");

    // Try creating tag with shell injection pattern if git allows
    const maliciousTag = "v1.0.0;touch " + pwnedFile;
    let tagCreated = false;
    try {
      execSync("git -C " + tempDir + " tag \"" + maliciousTag + "\"");
      tagCreated = true;
    } catch {
      // Git rejected invalid tag name
    }

    if (tagCreated) {
      const tag = getLatestTag(tempDir);
      assert.equal(tag, maliciousTag);
      const commits = getCommitsSinceTag(tag, tempDir);
      assert.ok(Array.isArray(commits));
      assert.equal(fs.existsSync(pwnedFile), false);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("integration: non-semver tag (latest) is ignored by getLatestTag", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "git-tag-"));
  try {
    execSync("git init " + tempDir);
    execSync("git -C " + tempDir + " config user.name \"Test\"");
    execSync("git -C " + tempDir + " config user.email \"test@example.com\"");
    fs.writeFileSync(path.join(tempDir, "package.json"), JSON.stringify({ version: "1.0.0" }));
    execSync("git -C " + tempDir + " add package.json");
    execSync("git -C " + tempDir + " commit -m \"chore: init\"");
    execSync("git -C " + tempDir + " tag latest");

    const tag = getLatestTag(tempDir);
    assert.equal(tag, null);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("integration: non-tag git error in getLatestTag throws error instead of returning null", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "not-a-repo-"));
  try {
    assert.throws(() => {
      getLatestTag(tempDir);
    });
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
