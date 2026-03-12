# 🤖 Luizalabs Agents & Skills Catalog

A complete documentation and discovery platform for Luizalabs development standards, AI agent configurations, skills, rules, hooks, and workflows.

## 📚 What's Included

- **70+ Skills** - Reusable development capabilities and patterns. The default specification for the skills is [https://agentskills.io/specification](https://agentskills.io/specification).
- **Agents** - AI configurations for GitHub Copilot, Cursor, Antigravity, Gemini, and more
- **Rules** - Development standards, security guidelines, best practices
- **Hooks** - Pre-commit automation and Git patterns
- **Workflows** - CI/CD pipelines and deployment automation

## 🏗️ Architecture

This project is structured as a modern **Monorepo** using `pnpm workspaces`.

```text
padrao-labs-agents/
├── .agents/          ← 🌟 SOURCE OF TRUTH (READ-ONLY for consumers)
│   ├── agents/
│   ├── skills/       (70+ items)
│   ├── rules/
│   ├── hooks/
│   └── workflows/
├── apps/
│   └── docs/         ← VitePress Documentation Site
├── cli/              ← NPM CLI Package (@luizalabs/padrao-labs-agents)
├── package.json      ← Monorepo Root (Orchestration & Global Scripts)
└── pnpm-workspace.yaml
```

## 🚀 Quick Start (Development)

**Requirements:**

- Node.js 18+
- pnpm 8+

```bash
# Install dependencies for all workspaces
pnpm install

# Run the documentation site locally (starts on http://localhost:5173)
pnpm run dev

# Build both the CLI and the Documentation
pnpm run build

# Run tests across all workspaces
pnpm run test
```

## 📦 CLI - Instalação e Uso

### 🌐 Instalação Global (Recomendado)

Instale todas as skills, agents, rules, hooks e workflows globalmente com um único comando:

```bash
npx @luizalabs/padrao-labs-agents install
```

#### Comandos Disponíveis

```bash
npx @luizalabs/padrao-labs-agents install                     # Instala globalmente (auto-detecta ferramentas)
npx @luizalabs/padrao-labs-agents install --tools copilot,gemini  # Instala apenas para ferramentas específicas
npx @luizalabs/padrao-labs-agents init                        # Inicializa repo com arquivos padrão
npx @luizalabs/padrao-labs-agents cron                        # Configura auto-update diário
npx @luizalabs/padrao-labs-agents update                      # Atualiza para a versão mais recente
```

#### Mapa de Instalação Global por Ferramenta

| Ferramenta      | Diretório Global         | agents | skills | rules | workflows | hooks |
| --------------- | ------------------------ | ------ | ------ | ----- | --------- | ----- |
| **Copilot**     | `~/.agents/`             | ✅     | ✅     | ✅    | -         | -     |
| **Gemini CLI**  | `~/.gemini/`             | -      | ✅     | -     | -         | ✅    |
| **Antigravity** | `~/.gemini/antigravity/` | ✅     | ✅     | ✅    | ✅        | -     |

> O CLI detecta automaticamente quais ferramentas estão instaladas no sistema e instala apenas para essas.

#### 🔄 Auto-Update Automático (Cron)

O CLI registra **automaticamente** um job de cron durante a instalação, mantendo suas configurações de agentes sempre atualizadas.

| Detalhe     | Valor                                             |
| ----------- | ------------------------------------------------- |
| **Horário** | Segunda a Sexta, 09:00                            |
| **Comando** | `npx @luizalabs/padrao-labs-agents@latest update` |
| **Log**     | `~/.padrao-labs/cron.log`                         |

```bash
# Verificar se está ativo
crontab -l | grep padrao-labs

# Remover o auto-update (não recomendado)
npx @luizalabs/padrao-labs-agents cron --remove
```

> **CI/CD:** O cron é ignorado automaticamente em ambientes com `CI`, `GITLAB_CI`, `GITHUB_ACTIONS`, etc.
> **Sem crontab:** Em sistemas sem suporte a cron (Windows, Docker), um aviso é exibido e a instalação continua normalmente.

### 🎯 Instalar Skills Individuais

Instale skills específicas do repositório GitLab privado com um único comando:

```bash
# Sintaxe
padrao-labs-agents skill install <skill-name>

# Exemplos
padrao-labs-agents skill install applying-yagni
padrao-labs-agents skill install applying-dry
padrao-labs-agents skill install applying-solid
padrao-labs-agents skill install applying-kiss
padrao-labs-agents skill install applying-clean-code
```

#### ⚙️ Como Funciona o Cache

- **Primeiro `install`**: Clona o repositório uma única vez em `~/.padrao-labs/padrao-labs-agents/` (~2.9 MB)
- **Próximos `install`**: Reutiliza o cache existente (instantâneo!)
- **Cada skill**: Cria um symlink local apontando para o arquivo no repositório (~4 KB)
- **Eficiência**: Instalar 10 skills = 2.9 MB total (não 29+ MB como seria com cópias!)

#### 📍 Localização das Skills Instaladas

```
~/.agents/skills/
├── applying-yagni/ → ~/.padrao-labs/padrao-labs-agents/.agents/skills/applying-yagni/
├── applying-dry/ → ~/.padrao-labs/padrao-labs-agents/.agents/skills/applying-dry/
└── ...
```

#### 📖 Documentação Detalhada

Para mais informações sobre a arquitetura e funcionamento: [SKILL_INSTALL_GUIDE.md](SKILL_INSTALL_GUIDE.md)

### 💻 Uso Local em Desenvolvimento

Se você quiser testar alterações da CLI antes de publicá-la, siga os passos abaixo:

1. Clone o repositório:

```bash
git clone https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents.git
cd padrao-labs-agents
```

2. Instale as dependências e faça o build:

```bash
pnpm install
pnpm run build
```

3. Entre na pasta da CLI e crie o link simbólico global:

```bash
cd cli
npm build
npm link
```

4. Agora você pode usar o comando da CLI em qualquer lugar do seu terminal para testar:

```bash
padrao-labs-agents --help
padrao-labs-agents install --dry-run
padrao-labs-agents skill install applying-yagni
```

**Dica:** Para remover o link depois, execute `npm unlink -g @luizalabs/padrao-labs-agents` dentro da pasta `cli`.

## 🤝 Como Usar no seu Projeto (Manual)

Caso não queira usar o CLI, você pode baixar as definições manualmente:

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

O monorepo utiliza o `vitest` com configurações otimizadas e isoladas para cada pacote.

```bash
pnpm test          # Executa todos os testes recursivamente
pnpm test:run      # Executa apenas uma vez (modo CI)
pnpm test:coverage # Gera relatório de cobertura
```

## 🔄 Como a Documentação Funciona

O projeto usa um script interno (`apps/docs/src/loader.js`) que, durante o processo de build ou dev:

1. Escaneia a pasta raiz `.agents/`.
2. Extrai metadados e conteúdos dos arquivos Markdown.
3. Gera a estrutura do VitePress **sem duplicar arquivos reais** na raiz do projeto.
4. Cria o catálogo pesquisável (`catalog.json`).

## ✍️ Contribuindo

- **Nova Skill ou Regra?** Adicione ou modifique arquivos **APENAS** dentro da pasta raiz `.agents/`.
- **Alterar o site?** Modifique os componentes em `apps/docs/`.
- **Alterar o CLI?** Modifique o código em `cli/src/`.

---

Part of Luizalabs · Magalu
