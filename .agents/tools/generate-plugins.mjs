import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const AGENTS_ROOT = path.join(REPO_ROOT, ".agents");
const SKILLS_ROOT = path.join(AGENTS_ROOT, "skills");
const PLUGINS_DIR = path.join(REPO_ROOT, "plugins");

export const PLUGIN_CONTEXTS = {
  core: {
    name: "juninmd-core",
    displayName: "JuninMD Core Workflow",
    description: "Core software development lifecycle: planning, onboarding, git, review, characterization testing, and documentation.",
    keywords: ["workflow", "planning", "code-review", "git", "testing", "documentation"],
    skills: [
      "starting-dev",
      "finishing-dev",
      "git-workflow",
      "requirements-planning",
      "code-review",
      "test-engineering",
      "documentation",
    ],
  },
  web: {
    name: "juninmd-web",
    displayName: "JuninMD Web & Mobile",
    description: "Frontend, mobile, and design engineering: React, Next.js, Vite, Tailwind, iOS Swift, motion, and 3D.",
    keywords: ["frontend", "react", "nextjs", "mobile", "ios", "swift", "animation", "threejs"],
    skills: [
      "frontend-engineering",
      "mobile-engineering",
      "ios-engineering",
      "stack-selection",
      "motion-video",
      "threejs",
      "3d-models",
    ],
  },
  backend: {
    name: "juninmd-backend",
    displayName: "JuninMD Backend & Data",
    description: "Backend services, APIs, databases, architecture, package management, tooling, and modding.",
    keywords: ["backend", "api", "database", "sql", "architecture", "packages", "cli"],
    skills: [
      "backend-systems",
      "data-engineering",
      "software-architecture",
      "package-management",
      "tooling-dev",
      "bot-engineering",
      "goldsrc-modding",
    ],
  },
  devops: {
    name: "juninmd-devops",
    displayName: "JuninMD Cloud & DevOps",
    description: "Cloud infrastructure, CI/CD, containers, observability, performance engineering, automated releases, and security auditing.",
    keywords: ["cloud", "devops", "kubernetes", "docker", "ci-cd", "observability", "security", "performance"],
    skills: [
      "cloud-devops",
      "observability",
      "performance-engineering",
      "security-ops",
      "release-autoupdate",
    ],
  },
  ai: {
    name: "juninmd-ai",
    displayName: "JuninMD AI & Agents",
    description: "AI agent architecture, MCP servers, subagent orchestration, skill authoring, local voice dubbing, automated image loops, and daily AI ecosystem radar.",
    keywords: ["ai", "agents", "mcp", "subagents", "skills", "radar", "llm", "dubbing"],
    skills: [
      "agent-engineering",
      "agent-orchestration",
      "skill-authoring",
      "web-research",
      "radar-ia",
      "agy-image-babysitter",
      "local-dubbing",
    ],
  },
};

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export function generatePlugins(root = REPO_ROOT) {
  const rootManifest = JSON.parse(fs.readFileSync(path.join(root, "plugin.json"), "utf8"));
  const version = rootManifest.version;
  const license = rootManifest.license;
  const author = rootManifest.author;

  const pluginsDir = path.join(root, "plugins");
  const resolvedRoot = path.resolve(root);
  const resolvedPlugins = path.resolve(pluginsDir);
  if (!resolvedPlugins.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error(`Refusing to remove generated plugins outside the provided root: ${resolvedPlugins}`);
  }
  fs.rmSync(resolvedPlugins, { recursive: true, force: true });
  fs.mkdirSync(pluginsDir, { recursive: true });

  const marketplacePlugins = [
    {
      name: "juninmd",
      source: "./.agents",
      description: "Complete bundle: all 33 production-grade engineering skills.",
      version,
    },
  ];

  let totalMappedSkills = 0;

  for (const [key, ctx] of Object.entries(PLUGIN_CONTEXTS)) {
    const contextDir = path.join(pluginsDir, key);
    const claudeDir = path.join(contextDir, ".claude-plugin");
    const skillsDest = path.join(contextDir, "skills");

    fs.mkdirSync(claudeDir, { recursive: true });
    fs.mkdirSync(skillsDest, { recursive: true });

    // 1. Copy designated skills
    for (const skill of ctx.skills) {
      const srcSkill = path.join(root, ".agents", "skills", skill);
      if (!fs.existsSync(srcSkill)) {
        throw new Error(`Context '${key}' references non-existent skill: ${skill}`);
      }
      copyDirectory(srcSkill, path.join(skillsDest, skill));
      totalMappedSkills += 1;
    }

    // 2. Write plugin.json for the context
    const pluginJson = {
      name: ctx.name,
      displayName: ctx.displayName,
      description: ctx.description,
      version,
      author,
      homepage: rootManifest.homepage,
      repository: rootManifest.repository,
      license,
      keywords: ctx.keywords,
    };
    fs.writeFileSync(
      path.join(claudeDir, "plugin.json"),
      JSON.stringify(pluginJson, null, 2) + "\n"
    );

    // 3. Register in marketplace
    marketplacePlugins.push({
      name: ctx.name,
      source: `./plugins/${key}`,
      description: ctx.description,
      version,
    });
  }

  // Write updated marketplace.json
  const marketplacePath = path.join(root, ".claude-plugin", "marketplace.json");
  const marketplace = JSON.parse(fs.readFileSync(marketplacePath, "utf8"));
  marketplace.plugins = marketplacePlugins;
  fs.writeFileSync(marketplacePath, JSON.stringify(marketplace, null, 2) + "\n");

  console.log(`Generated 5 contextual plugins (${totalMappedSkills} skills partitioned) alongside master 'juninmd' bundle.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generatePlugins();
}
