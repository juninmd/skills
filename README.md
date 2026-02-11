# 🤖 Luizalabs Agents & Skills Catalog

A complete documentation and discovery platform for Luizalabs development standards, AI agent configurations, skills, rules, hooks, and workflows.

## 📚 What's Included

- **70+ Skills** - Reusable development capabilities and patterns
- **Agents** - AI configurations for GitHub Copilot, Cursor, Antigravity, Gemini, and more
- **Rules** - Development standards, security guidelines, best practices
- **Hooks** - Pre-commit automation and Git patterns
- **Workflows** - CI/CD pipelines and deployment automation

## 🚀 Quick Start

### View Documentation Locally

```bash
npm install
npm run docs:dev
```

Open http://localhost:5173

### Use in Your Project

**GitHub Copilot (VS Code):**
```bash
mkdir -p .github
curl https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents.md -o agents.md
curl https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents.md -o .github/copilot-instructions.md
```

**Antigravity / Gemini:**
```bash
curl https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents.md -o AGENTS.md
```

**Cursor:**
```bash
curl https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents.md -o .cursorrules
```

## 📋 Tool Integration Matrix

| Tool | File | Location |
|------|------|----------|
| GitHub Copilot | `copilot-instructions.md` | `.github/` |
| Antigravity | `AGENTS.md` | Root `/` |
| Gemini CLI | `agents.md` + `.gemini.json` | Root `/` |
| Cursor | `.cursorrules` | Root `/` |
| Windsurf | `.windsurfrules` | Root `/` |
| Cline/Roo Code | `.clinerules` | Root `/` |

## 🏗️ Architecture

```
.agents/              ← Source of truth (READ-ONLY)
├── agents/
├── skills/           (70+ items)
├── rules/
├── hooks/
└── workflows/

docs/                 ← VitePress docs site
├── .vitepress/       (Config + components)
├── integration/      (Setup guides)
└── [auto-generated]

scripts/
└── loader.js         (Dynamic catalog generator)
```

## 🔄 How It Works

The loader dynamically:
1. Scans `.agents/` directory
2. Extracts metadata from markdown files
3. Generates VitePress docs WITHOUT duplicating files
4. Creates searchable catalog (catalog.json)
5. Maintains single source of truth

### Commands

```bash
npm run docs:dev          # Dev with watch
npm run docs:build        # Production build
npm run docs:preview      # Preview production
npm run generate:index    # Regenerate catalog
```

## 🔍 Features

✨ **Full-Text Search** - Search across all content  
🏷️ **Filter by Category** - Agents, Skills, Rules, etc  
📱 **Responsive Design** - Mobile-friendly  
🔗 **Zero Duplication** - Single source of truth  
📊 **JSON API** - Programmatic access via catalog.json  
🎨 **Modern UI** - Vue 3 + VitePress  

## 📖 Integration Guides

- [GitHub Copilot Setup](docs/integration/copilot.md)
- [Antigravity / Gemini](docs/integration/antigravity.md)
- [Gemini CLI](docs/integration/gemini.md)

## 🛠️ Development

**Requirements:**
- Node.js 18+
- npm or pnpm

**Setup:**
```bash
npm install
npm run docs:dev
```

## 🤝 Contributing

- Changes go ONLY to `.agents/` folder
- Run `npm run generate:index` before committing
- Do NOT edit generated files in `docs/`

## 📄 License

Part of Luizalabs · Magalu

---

**Status:** Active | Last Updated: Feb 2026 | Made with ❤️ by Luizalabs
