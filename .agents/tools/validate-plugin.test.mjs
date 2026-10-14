import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validatePlugin } from "./validate-plugin.mjs";

const manifest = { name: "sample-skills", description: "Sample plugin.", version: "1.2.3", license: "MIT", skills: ".agents/skills", agents: ".agents/agents" };

function createRepo({ source = "./.agents", claude = {}, entry = {}, extraPlugins = [] } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "plugin-validator-"));
  const write = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), JSON.stringify(value));
  };
  fs.mkdirSync(path.join(root, ".agents/skills"), { recursive: true });
  fs.mkdirSync(path.join(root, ".agents/agents"), { recursive: true });
  write("plugin.json", manifest);
  write(".agents/.claude-plugin/plugin.json", { name: "sample", description: "Sample plugin.", version: "1.2.3", license: "MIT", ...claude });
  write(".claude-plugin/marketplace.json", {
    name: "skills",
    owner: { name: "Owner" },
    plugins: [{ name: "sample", source, version: "1.2.3", ...entry }, ...extraPlugins],
  });
  return root;
}

const errorsOf = (root) => validatePlugin(root).join("\n");

test("a Claude plugin in a subdirectory that mirrors plugin.json passes", () => {
  assert.deepEqual(validatePlugin(createRepo()), []);
});

test("sourcing the repository root fails because install copies node_modules", () => {
  assert.match(errorsOf(createRepo({ source: "./" })), /must be a \.\/subdirectory/);
});

test("a source escaping the repository fails", () => {
  assert.match(errorsOf(createRepo({ source: "./../elsewhere" })), /must be a \.\/subdirectory/);
});

test("a backslash source that escapes the repository on Windows fails", () => {
  assert.match(errorsOf(createRepo({ source: String.raw`./.agents\..\..\outside` })), /must be a \.\/subdirectory/);
});

test("a source that resolves back to the repository root fails", () => {
  assert.match(errorsOf(createRepo({ source: "./.agents/.." })), /must be a \.\/subdirectory/);
});

test("a non-array plugins field reports an error instead of crashing validation", () => {
  const root = createRepo();
  fs.writeFileSync(path.join(root, ".claude-plugin/marketplace.json"), JSON.stringify({ name: "skills", owner: { name: "Owner" }, plugins: { sample: {} } }));
  assert.match(errorsOf(root), /'plugins' must be an array/);
});

test("a remote object source is allowed next to the local plugin", () => {
  const remote = { name: "remote", source: { source: "github", repo: "owner/repo" } };
  assert.deepEqual(validatePlugin(createRepo({ extraPlugins: [remote] })), []);
});

test("a release that drifts from plugin.json fails so every client ships the same version", () => {
  assert.match(errorsOf(createRepo({ claude: { version: "9.9.9" } })), /'version' differs/);
});

test("a marketplace entry whose name differs from its manifest fails because installs use that id", () => {
  assert.match(errorsOf(createRepo({ entry: { name: "other" } })), /differs from marketplace entry/);
});

test("hooks at the plugin root fail because they would run in every consumer session", () => {
  const root = createRepo();
  fs.mkdirSync(path.join(root, ".agents/hooks"));
  assert.match(errorsOf(root), /must not ship 'hooks'/);
});

test("a missing marketplace fails", () => {
  const root = createRepo();
  fs.rmSync(path.join(root, ".claude-plugin"), { recursive: true });
  assert.match(errorsOf(root), /marketplace\.json is missing/);
});
