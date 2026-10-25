import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export function parseSemver(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(version);
  if (!match) throw new Error(`Invalid semver: ${version}`);
  return {
    major: Number.parseInt(match[1], 10),
    minor: Number.parseInt(match[2], 10),
    patch: Number.parseInt(match[3], 10),
    prerelease: match[4] || null,
  };
}

export function formatSemver({ major, minor, patch }) {
  return `${major}.${minor}.${patch}`;
}

export function analyzeCommits(commits) {
  let bump = null; // null | "patch" | "minor" | "major"
  for (const msg of commits) {
    const trimmed = msg.trim();
    if (!trimmed || trimmed.includes("[skip ci]")) continue;

    // Breaking change indicator in type (feat!: or fix!:) or BREAKING CHANGE footer
    if (/^[a-z]+(\([a-z0-9._-]+\))?!:/.test(trimmed) || /^BREAKING[ -]CHANGE:/m.test(trimmed)) {
      return "major";
    }
    // Minor bump for new features
    if (/^feat(\([a-z0-9._-]+\))?:/.test(trimmed)) {
      if (bump !== "major") bump = "minor";
    }
    // Patch bump for fixes and performance improvements
    else if (/^(fix|perf)(\([a-z0-9._-]+\))?:/.test(trimmed)) {
      if (!bump) bump = "patch";
    }
  }
  return bump;
}

export function bumpVersion(currentVersion, bumpType) {
  const semver = parseSemver(currentVersion);
  if (bumpType === "major") {
    return formatSemver({ major: semver.major + 1, minor: 0, patch: 0 });
  }
  if (bumpType === "minor") {
    return formatSemver({ major: semver.major, minor: semver.minor + 1, patch: 0 });
  }
  if (bumpType === "patch") {
    return formatSemver({ major: semver.major, minor: semver.minor, patch: semver.patch + 1 });
  }
  return currentVersion;
}

export function updateManifests(root, newVersion) {
  const updated = [];

  const pkgPath = path.join(root, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    pkg.version = newVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    updated.push(pkgPath);
  }

  const pluginPath = path.join(root, "plugin.json");
  if (fs.existsSync(pluginPath)) {
    const plugin = JSON.parse(fs.readFileSync(pluginPath, "utf8"));
    plugin.version = newVersion;
    fs.writeFileSync(pluginPath, JSON.stringify(plugin, null, 2) + "\n");
    updated.push(pluginPath);
  }

  const marketPath = path.join(root, ".claude-plugin", "marketplace.json");
  if (fs.existsSync(marketPath)) {
    const market = JSON.parse(fs.readFileSync(marketPath, "utf8"));
    if (Array.isArray(market.plugins)) {
      for (const p of market.plugins) {
        if (p) p.version = newVersion;
      }
    }
    fs.writeFileSync(marketPath, JSON.stringify(market, null, 2) + "\n");
    updated.push(marketPath);
  }

  const agentPluginPath = path.join(root, ".agents", ".claude-plugin", "plugin.json");
  if (fs.existsSync(agentPluginPath)) {
    const agentPlugin = JSON.parse(fs.readFileSync(agentPluginPath, "utf8"));
    agentPlugin.version = newVersion;
    fs.writeFileSync(agentPluginPath, JSON.stringify(agentPlugin, null, 2) + "\n");
    updated.push(agentPluginPath);
  }

  const pluginsDir = path.join(root, "plugins");
  if (fs.existsSync(pluginsDir)) {
    for (const category of fs.readdirSync(pluginsDir)) {
      const categoryPluginPath = path.join(pluginsDir, category, ".claude-plugin", "plugin.json");
      if (fs.existsSync(categoryPluginPath)) {
        const catPlugin = JSON.parse(fs.readFileSync(categoryPluginPath, "utf8"));
        catPlugin.version = newVersion;
        fs.writeFileSync(categoryPluginPath, JSON.stringify(catPlugin, null, 2) + "\n");
        updated.push(categoryPluginPath);
      }
    }
  }

  return updated;
}

export function getLatestTag(cwd = process.cwd()) {
  try {
    return execFileSync("git", ["describe", "--tags", "--abbrev=0", "--match", "v[0-9]*"], {
      cwd,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch (err) {
    if (err && typeof err === "object" && err.stderr) {
      const stderr = err.stderr.toString();
      if (stderr.includes("No names found") || stderr.includes("No tags give") || stderr.includes("No exact match")) {
        return null;
      }
    }
    throw err;
  }
}

export function getCommitsSinceTag(tag, cwd = process.cwd()) {
  const range = tag ? `${tag}..HEAD` : "HEAD";
  const output = execFileSync("git", ["log", range, "--format=%B\x1e"], {
    cwd,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  return output.split("\x1e").map((c) => c.trim()).filter(Boolean);
}

export function getCurrentVersion(root) {
  const pkgPath = path.join(root, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  return pkg.version;
}

export function planRelease(root = process.cwd()) {
  const currentVersion = getCurrentVersion(root);
  const tag = getLatestTag(root);
  const commits = getCommitsSinceTag(tag, root);
  const bumpType = analyzeCommits(commits);
  const newVersion = bumpType ? bumpVersion(currentVersion, bumpType) : currentVersion;

  return {
    currentVersion,
    latestTag: tag,
    commitCount: commits.length,
    bumpType,
    newVersion,
    shouldRelease: Boolean(bumpType),
  };
}

function main() {
  const args = process.argv.slice(2);
  const isCheck = args.includes("--check");
  const isDryRun = args.includes("--dry-run");
  const root = process.cwd();

  const plan = planRelease(root);

  if (!plan.shouldRelease) {
    console.log(`No semantic release needed (current: v${plan.currentVersion}, commits: ${plan.commitCount}).`);
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, "should_release=false\n");
    }
    return;
  }

  console.log(`Semantic release planned: v${plan.currentVersion} -> v${plan.newVersion} (${plan.bumpType} bump)`);

  if (isCheck || isDryRun) {
    return;
  }

  updateManifests(root, plan.newVersion);
  console.log(`Updated manifests to v${plan.newVersion}.`);

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, "should_release=true\n");
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=v${plan.newVersion}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `raw_version=${plan.newVersion}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `bump_type=${plan.bumpType}\n`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
