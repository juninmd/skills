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

Open <http://localhost:5173>

### 🏗️ Contribute with Spec-Driven Development

Build new skills, agents, and rules using **Specification-Driven Development (SDD)** - a methodology where specifications become your primary artifact.

**Quickstart**:
1. Read the constitution: `cat .specify/memory/constitution.md`
2. Review the guide: `cat .specify/SPEC-DRIVEN-DEV-GUIDE.md`
3. Copy spec template: `cp .specify/templates/spec-template.md .specify/specs/[feature]/spec.md`
4. Use AI agent commands: `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`
5. Follow the spec → plan → tasks → implement → validate workflow

**Key Commands** (in Claude Code, GitHub Copilot, or supported AI agents):
```
/speckit.constitution  # Establish project principles
/speckit.specify       # Define requirements and user scenarios
/speckit.clarify       # Address ambiguities
/speckit.plan          # Create technical design
/speckit.tasks         # Break into actionable tasks
/speckit.implement     # Execute individual task
/speckit.checklist     # Validate completion
```

See `.specify/commands/slash-commands-guide.md` for complete command reference.

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

## 🧪 Testing

Run automated tests for skills, components, and utilities:

```bash
pnpm test          # Run tests in watch mode
pnpm test:run      # Run tests once (CI mode)
pnpm test:ui       # Open test UI in browser
pnpm test:coverage # Generate coverage report
```

**Test Coverage**: 34 tests covering utility functions and Vue components:
- CLI utilities (logger, platform path resolution)
- Vue components (SearchBox, CategoryGrid)
- Integration tests for platform compatibility

Target coverage: **> 80%** for all new code.

## ⚡ Performance Optimizations

The documentation site uses several optimizations for fast loading:

- **Lazy Loading**: Vue components load on-demand using `defineAsyncComponent`
- **Code Splitting**: Vite automatically splits vendor code (Vue, MiniSearch) into separate chunks
- **Component Splitting**: Heavy components (SearchBox, InstallTabs) load only when needed
- **Optimized Dependencies**: Pre-bundled for faster module resolution

Build metrics:
- Initial page load: Optimized with lazy component boundaries
- Bundle size: Reduced from ~9.5MB to ~5-6MB with splitting
- Search performance: Client-side MiniSearch for instant results

## 📦 CLI - Instalacao Global via NPX



Instale todas as skills, agents, rules, hooks e workflows globalmente com um unico comando:

```bash
npx @luizalabs/padrao-labs-agents install
```

### Comandos Disponiveis

```bash
npx @luizalabs/padrao-labs-agents install                     # Instala globalmente (auto-detecta ferramentas)
npx @luizalabs/padrao-labs-agents install --tools copilot,gemini  # Instala apenas para ferramentas especificas
npx @luizalabs/padrao-labs-agents init                        # Inicializa repo com dependency.yaml, sonar, hangar-info, gitlab-ci
npx @luizalabs/padrao-labs-agents cron                        # Configura auto-update diario (seg-sex 9h)
npx @luizalabs/padrao-labs-agents update                      # Atualiza para a versao mais recente
```

### Mapa de Instalacao Global por Ferramenta

| Ferramenta | Diretorio Global | agents | skills | rules | workflows | hooks | agents.md |
|---|---|---|---|---|---|---|---|
| **Copilot** | `~/.copilot/` | ✅ | ✅ | ✅ | ✅ | - | - |
| **Gemini CLI** | `~/.gemini/` | - | ✅ | - | - | ✅ | - |
| **Antigravity** | `~/.gemini/antigravity/` | ✅ | ✅ | ✅ | ✅ | - | ✅ AGENTS.md |
| **Claude** | `~/.claude/` | - | ✅ | ✅ | - | - | ✅ CLAUDE.md |
| **Cursor** | `~/.cursor/` | - | - | ✅ concatenado | - | - | - |
| **Windsurf** | `~/.windsurf/` | - | - | ✅ concatenado | - | - | - |
| **Cline** | `~/.cline/` | - | ✅ | ✅ | - | - | - |

> O CLI detecta automaticamente quais ferramentas estao instaladas no sistema e instala apenas para essas.

## 📋 Tool Integration Matrix (por projeto)

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
