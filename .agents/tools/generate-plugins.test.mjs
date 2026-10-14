import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { generatePlugins, PLUGIN_CONTEXTS } from "./generate-plugins.mjs";

test("contextual plugin definitions map skills only", () => {
  for (const [name, context] of Object.entries(PLUGIN_CONTEXTS)) {
    assert.ok(context.skills.length > 0, `${name} must map at least one skill`);
    assert.equal("agents" in context, false, `${name} must not map retired agent roles`);
  }
});

test("regeneration replaces legacy roles with canonical skills in every context", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "skills-plugin-generation-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, "plugin.json"), JSON.stringify({ version: "1.1.0", license: "MIT" }));
  fs.mkdirSync(path.join(root, ".claude-plugin"));
  fs.writeFileSync(path.join(root, ".claude-plugin", "marketplace.json"), "{}");
  for (const [contextName, context] of Object.entries(PLUGIN_CONTEXTS)) {
    const legacy = path.join(root, "plugins", contextName, "agents");
    fs.mkdirSync(legacy, { recursive: true });
    fs.writeFileSync(path.join(legacy, "retired.agent.md"), "retired role");
    for (const skill of context.skills) {
      const source = path.join(root, ".agents", "skills", skill, "references");
      fs.mkdirSync(source, { recursive: true });
      fs.writeFileSync(path.join(source, "procedure.md"), `canonical ${skill}`);
    }
  }
  generatePlugins(root);
  for (const [contextName, context] of Object.entries(PLUGIN_CONTEXTS)) {
    const output = path.join(root, "plugins", contextName);
    assert.equal(fs.existsSync(path.join(output, "agents")), false);
    const manifest = JSON.parse(fs.readFileSync(path.join(output, ".claude-plugin", "plugin.json"), "utf8"));
    assert.equal(manifest.version, "1.1.0");
    for (const skill of context.skills) {
      assert.equal(fs.readFileSync(path.join(output, "skills", skill, "references", "procedure.md"), "utf8"), `canonical ${skill}`);
    }
  }
  const marketplace = JSON.parse(fs.readFileSync(path.join(root, ".claude-plugin", "marketplace.json"), "utf8"));
  assert.equal(marketplace.plugins.length, Object.keys(PLUGIN_CONTEXTS).length + 1);
  assert.ok(marketplace.plugins.every((entry) => entry.version === "1.1.0"));
  assert.doesNotMatch(marketplace.plugins[0].description, /agents/i);
});
