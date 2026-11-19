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
      "homologate",
      "git-workflow",
      "git-branch-cleanup",
      "requirements-planning",
      "code-review",
      "test-engineering",
      "documentation",
      "readme-standard",
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
      "portkill",
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
      "rea",
      "radar-ia",
      "peer-benchmark",
      "x-post-reading",
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