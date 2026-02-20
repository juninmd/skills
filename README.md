# 🤖 Luizalabs Agents & Skills Catalog

A complete documentation and discovery platform for Luizalabs development standards, AI agent configurations, skills, rules, hooks, and workflows.

## 📚 What's Included

- **70+ Skills** - Reusable development capabilities and patterns. The default specification for the skills is [https://agentskills.io/specification](https://agentskills.io/specification).
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

Build new skills, agents, and rules using **Specification-Driven Development (SDD)** — a methodology where specifications become your primary artifact. Works with **any AI agent** (Antigravity, Gemini, Copilot, Claude, Cursor, etc.).

**Quickstart**:

1. Read the constitution: `cat .specify/memory/constitution.md`
2. Create your feature spec: `pnpm spec:init my-feature`
3. Fill in `.specify/specs/my-feature/spec.md`
4. Ask your AI agent: `Follow the workflow in .agents/workflows/sdd-new-feature.md`
5. Follow the spec → plan → tasks → implement → validate workflow

**Spec Commands** (migrated from Bash to Node.js):

| Bash (old) | npm/pnpm (new) | Makefile | Description |
|-----------|---|----------|---|
| `bash .specify/scripts/init-spec.sh <name>` | `pnpm spec:init <name>` | `make spec-init FEATURE=<name>` | Scaffold new feature spec |
| `bash .specify/scripts/validate-spec.sh` | `pnpm spec:validate` | `make spec-validate` | Validate all specs |
| `bash .specify/scripts/validate-spec.sh <name>` | `pnpm spec:validate <name>` | `make spec-validate FEATURE=<name>` | Validate specific spec |
| `bash .specify/scripts/spec-status.sh` | `pnpm spec:status` | `make spec-status` | Show specs status dashboard |
| N/A | `pnpm spec:check` | `make spec-check` | Validate + show status (combined) |

**All three original scripts are now consolidated into a single Node.js implementation** (`check-spec.mjs`) for better maintainability and cross-platform compatibility.

**Agent Workflows** (in `.agents/workflows/`):

| Workflow | Description |
|----------|-------------|
| `sdd-new-feature.md` | Complete flow to create a new feature |
| `sdd-validate.md` | Pre-merge validation with checklist |
| `sdd-review.md` | Spec/plan review against constitution |

See [SPEC-DRIVEN-DEV-GUIDE.md](.specify/SPEC-DRIVEN-DEV-GUIDE.md) for the complete guide.

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
| **Copilot** | `~/.agents/` | ✅ | ✅ | ✅ | - | - | - |
| **Gemini CLI** | `~/.gemini/` | - | ✅ | - | - | ✅ | - |
| **Antigravity** | `~/.gemini/antigravity/` | ✅ | ✅ | ✅ | ✅ | - | ✅ AGENTS.md |

> O CLI detecta automaticamente quais ferramentas estao instaladas no sistema e instala apenas para essas.

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
