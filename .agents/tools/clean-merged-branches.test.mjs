import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const scripts = new URL("../skills/git-branch-cleanup/scripts", import.meta.url).pathname;
const hasPython = spawnSync("python3", ["--version"]).status === 0;

const git = (cwd, ...args) => spawnSync("git", args, { cwd, encoding: "utf8" });

test("deleting a local branch never runs shell metacharacters from its name", { skip: !hasPython }, () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), "branch-clean-"));
  const marker = path.join(repo, "pwned");
  git(repo, "init", "-q", "-b", "main");
  git(repo, "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", "init");
  // No spaces allowed in ref names, so ${IFS} stands in for one; the marker is relative to the repo cwd.
  const evil = "x$(touch${IFS}pwned)";
  assert.equal(git(repo, "branch", evil).status, 0, "git must accept the branch name for this test to mean anything");

  const code = `
import importlib.util, sys
spec = importlib.util.spec_from_file_location("cmb", ${JSON.stringify(path.join(scripts, "clean-merged-branches.py"))})
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
sys.exit(0 if mod.delete_local_branch(sys.argv[1]) else 3)
`;
  const result = spawnSync("python3", ["-c", code, evil], { cwd: repo, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(marker), false, "branch name was executed by a shell");
  assert.equal(git(repo, "branch", "--list", evil).stdout.trim(), "", "branch should be deleted");
});
