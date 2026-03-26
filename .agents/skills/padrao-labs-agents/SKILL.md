---
name: padrao-labs-agents
description: Habilidade que consolida as melhores práticas de desenvolvimento, padrões de arquitetura e processos de CI/CD (integração contínua) adotados nos projetos e repositórios oficiais do Luizalabs.
metadata:
    works_on: [copilot, antigravity, gemini]
argument-hint: "[project/file]"
---

# Padrão Labs Agents

## Description
Esta habilidade consolida as melhores práticas de desenvolvimento, padrões de arquitetura e processos de CI/CD (integração contínua) adotados nos projetos e repositórios oficiais do Luizalabs (como code-quality-luizalabs, ci-knife, universal-ci, arguinho, auto-keydb e agent-skills). Use essa habilidade ao criar, refatorar ou auditar projetos para garantir aderência estrita às convenções do Labs.

## Instructions

### 1. Mindset e Workflow Orientado a Agentes (Agent Skills)
- **Mentalidade de Agente:** Pense em cada projeto como um agente autônomo que deve ser capaz de operar, evoluir e se integrar com outros agentes (serviços) seguindo um conjunto rigoroso de regras e padrões.
- **Segurança Suprema:** NUNCA faça commit de secrets, `.env` ou chaves. Proteja dados sensíveis (PII) removendo-os dos logs. Use senhas/chaves vindas de variáveis de ambiente.

### 2. Stack Backend 1: Node.js e NestJS (TypeScript)
- **Tecnologias Core:** NestJS (TypeScript), Prisma ORM (PostgreSQL), Jest (Testes), pnpm (Gerenciador de Pacotes).
- **Estrutura:** O diretório `__tests__/` deve espelhar a estrutura de `src/`. Agrupe funcionalidades em módulos isolados.
- **Nomenclatura:** Kebab-case para arquivos (`feature.controller.ts`), PascalCase para classes/tipos, camelCase para métodos/variáveis.
- **Práticas:** Sem uso de `any`. DTOs blindados com `class-validator`. Controllers "magros", regras de negócios nos services/flux. Respostas de erro usando exceções HTTP padrão do Nest.

### Sugestões de Stacks

### 3. Stack Backend 2: Python e FastAPI
- **Tecnologias Core:** Python 3.13+, FastAPI (`uvicorn[standard]`), e o gerenciador de pacotes ultrarrápido **`uv`**.
- **Ambiente:** Obrigatório o uso do nome `.venv` para ambientes virtuais. 
- **Ferramental de Qualidade:** Formatação com `black`, Linting com `ruff` e `flake8`, ordenação com `isort` e tipagem com `pyright`.
- **Práticas:** Use exaustivamente `async/await` e Type Hints explícitos.

### 4. Stack Frontend: React Moderno
- **Tecnologias Core:** React 19, Vite, Tailwind CSS 4, e `pnpm` como gerenciador.
- **Práticas:** Uso exclusivo de componentes funcionais com Hooks. Prefira Tailwind CSS a escrever CSS customizado. Foco em Core Web Vitals e acessibilidade (WCAG).

### 5. Integração CI/CD e Universal CI
- **Universal CI:** Use o pipeline do gitlab `.gitlab-ci.yml`.
- **Sugestão de Stages Padrões:** `commitlint`, `install`, `test`, `build`, `security`, `deploy`, `release`, `gmud`.
- **CI-Knife (Canivete Suíço):** CLI para deploys (ArgoCD/GCS), Rollbacks, Releases e validações de GMUD. Todo MR passa por análise semântica (`commitlint`) e aprovações (SLA).

### 6. Arquivo Makefile (para python)
- A CLI de CI/CD assume que todo repositório deve ser operável via `make`. O arquivo `Makefile` deve conter na primeira linha `SHELL := /bin/bash`.
- **Comandos Mandatórios:** O `Makefile` DEVE implementar os seguintes targets:
  - `run` (Para iniciar a aplicação localmente - definindo o PYTHONPATH no Python).
  - `coverage` (Para executar os testes do projeto gerando output visual/html).
  - `clean` (Para limpar diretórios de cache e coverage).


### 7. Padrão Exigido: Docker e Docker-Compose
- **Dockerfile:** O contêiner de build deve conter o comando `apt-get install -y --no-install-recommends make` para suportar comandos via Makefile local ou CI.
- **Ambiente Local:** O uso do `docker-compose up` é incentivado para instanciar bancos locais (ex: Keycloak, PostgreSQL, MongoDB, Redis/KeyDB). Não coloque senhas ou segredos expostos no repositório.

### 8. Configurações do Jest (Testes Node.js)
- O arquivo de setup dos testes (`setup.ts` ou `jest.config.js`) deve mockar fortemente recursos externos e dependências intrusivas.
- Mocking do OpenTelemetry é vital para os testes não poluírem a rede ou o log do CI (`jest.mock('@opentelemetry/api')`).
- Falsifique o relógio via `jest.useFakeTimers()` e injete horários controlados usando `Date.now = jest.fn(() => 1503187200000)` para testabilidade pura e previsível.

### 9. Infraestrutura, Cloud e ArgoCD
- **Gestão de Segredos:** Utilize o Google Secret Manager (GSM). No ArgoCD, as injeções devem ocorrer pelo padrão `gcp:secretmanager:projects/{project_id}/secrets/{secret_name}`.
- **Backstage / Catálogo:** Todo serviço deve incluir um arquivo `hangar-info.yaml` (padrão Backstage) na raiz para catalogação.

### 10. Padrões de Qualidade e Governança Rigorosos
- **Cobertura de Testes:** A barra é alta. **90% de cobertura mínima de testes é obrigatória.** Projetos Python utilizam relatórios `cobertura`, Node usam relatórios do Jest (`ts-jest`). O pipeline rejeitará se a cobertura cair.
- **Observabilidade:** Logs não devem conter informações sensíveis de cliente (PII). Nível de log padrão deve ser ERROR via OpenTelemetry + (Bunyan/Pino).