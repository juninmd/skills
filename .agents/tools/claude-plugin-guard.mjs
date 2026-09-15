// Keeps Claude Code on one install method: the juninmd plugin or skill symlinks, never both,
// because both load every skill description twice (`security-ops` and `juninmd:security-ops`).
import fs from "node:fs";
import path from "node:path";

export function pluginId(repo) {
  const marketplace = JSON.parse(fs.readFileSync(path.join(repo, ".claude-plugin", "marketplace.json"), "utf8"));
  const plugin = JSON.parse(fs.readFileSync(path.join(repo, ".agents", ".claude-plugin", "plugin.json"), "utf8"));
  return `${plugin.name}@${marketplace.name}`;
}

export function isPluginInstalled(home, id) {
  const registry = path.join(home, ".claude", "plugins", "installed_plugins.json");
  if (!fs.existsSync(registry)) return false;
  const installs = JSON.parse(fs.readFileSync(registry, "utf8")).plugins?.[id];
  return Array.isArray(installs) && installs.length > 0;
}

// Removes only links that resolve to this repo's skills; real directories and foreign links stay.
export function unlinkRepoSkills(skillsDir, skillsRoot, skills, { dryRun = false, log = console.log } = {}) {
  const root = fs.realpathSync(skillsRoot);
  let removed = 0;
  for (const name of skills) {
    const entry = path.join(skillsDir, name);
    let stat;
    try { stat = fs.lstatSync(entry); } catch { continue; }
    if (!stat.isSymbolicLink()) continue;
    let target;
    try { target = fs.realpathSync(entry); } catch { continue; }
    if (target !== path.join(root, name)) continue;
    log(`unlink  ${entry} (plugin installed)`);
    // A junction or symlink is removed without following it; the repo skill is untouched.
    if (!dryRun) fs.rmSync(entry, { recursive: false, force: true });
    removed += 1;
  }
  return removed;
}
