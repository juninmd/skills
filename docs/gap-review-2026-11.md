# Revisão de lacunas vs. maiores repositórios de skills (2026-11-15)

Base: `juninmd/skills` v1.12.0. Contagens de stars são aproximadas (blogs/agregadores, nov/2026; verificar no GitHub).

## 1. Inventário

- 39 skills em `.agents/skills`, 5 plugins (`ai`, `backend`, `core`, `devops`, `web`), 53 arquivos de evals, 17 validadores em `.agents/tools` com testes.
- Tier 1 (descrição): ~3,6k tokens no total (≈92/skill). Tier 2 (corpo): 0,8k–2,8k por skill, orçamento 3k imposto no CI.
- Roteamento offline: 196/200 prompts acertam o dono (98%). Margem mínima 0,09 (`homologate` vs `radar-ia`).
- Falhas atuais (do `pnpm run evals`):
  - `security-ops`: "auditar MCP de terceiros" cai em `agent-engineering`.
  - `starting-dev`: "escrever AGENTS.md" cai em `agent-orchestration`; "handoff" cai em `frontend-engineering`.
  - `web-research`: "verificar versão/breaking changes" cai em `homologate`.
- Clients: Claude Code, Codex e OpenCode. Sem hooks, sem slash commands, sem personas de agente para Claude.

## 2. Comparação

| Repo | Stars (aprox.) | Skills | O que faz melhor que nós |
|---|---:|---:|---|
| mattpocock/skills | ~320k | 38 | Skills pequenas e invocáveis (`/grill-me`, `/handoff`, `/wait-what`), router (`ask-matt`), glossário de domínio, `to-tickets`/`wayfinder`, `pr`, `wizard`, `retro`, `teach`, instalador `setup-*` |
| obra/superpowers | ~300k | 15 | Skill de entrada `using-superpowers` que força checar skills antes de agir, fluxo fixo brainstorm→plano→execução, `subagent-driven-development` com revisão em 2 estágios, `diagnosing-superpowers`, instalação em ~15 clientes |
| anthropics/skills | ~180k | 20 | Skills de arquivos (docx/pdf/pptx/xlsx), `mcp-builder`, `webapp-testing`, `skill-creator` com loop de avaliação, spec oficial |
| addyosmani/agent-skills | ~117k | 25 | Comandos `/spec /plan /build /test /review /ship`, personas (`code-reviewer`, `security-auditor`), `doubt-driven-development`, `constraint-driven-development`, checklists de referência, evals (90 arquivos) |
| ComposioHQ/awesome-claude-skills | ~79k | lista | Curadoria e descoberta; não é um modelo de conteúdo |
| affaan-m/ECC, sickn33, alirezarezvani | — | 450–4300 | Volume e cobertura de domínios; sem controle de qualidade/tokens |

Onde já lideramos: contrato imposto (checklist 100%), orçamento de tokens no CI, evals de roteamento com negativos, catálogo gerado, `benchmark-*` reproduzível, aliases de skills aposentadas.

## 3. Lacunas priorizadas

**P0 (alto valor, baixo risco)**
1. **Corrigir as 4 falhas de roteamento** acima (descrições/evals). Meta: 100% rank 1, margem mínima ≥ 0,5.
2. **Skill/seção de entrada (meta-router)** estilo `using-superpowers`/`ask-matt`: texto curto que manda checar skills antes de agir.
3. **Instalação multi-cliente documentada**: Cursor, Gemini CLI, Copilot CLI, Antigravity (superpowers cobre ~15).

**P1**
4. **Interview/grilling** (4 skills tocam no tema, nenhuma é dona): `grill-me`, `interview-me`, `to-questionnaire`.
5. **Glossário de domínio + ADR inline** (`GLOSSARY.md`): só 3 skills mencionam.
6. **Quebra em tickets/tracer bullets** (`to-tickets`, `wayfinder`): só 2 skills citam "tracer".
7. **Slash commands e personas** para Claude Code (`/spec /plan /build /test /review /ship`, `code-reviewer`, `security-auditor`); já existe `.agents/clients/opencode/agents`.
8. **Revisão em 2 estágios por subagentes** (spec primeiro, qualidade depois) em `agent-orchestration`/`code-review`.

**P2**
9. **Skills de arquivos de escritório** (docx/pdf/pptx/xlsx) e **MCP builder** (existe `agent-engineering` para MCP, sem fluxo de build).
10. **Skill de PR**: resumo visual, evidência antes/depois, porta de mão única/dupla. `git-workflow`/`finishing-dev` cobrem parcialmente.
11. **Definition of done / constraints** como arquivo do projeto: 0 menções.
12. **Deprecação/migração** (Chesterton's Fence, zombie code): 0 menções a Chesterton; deprecação aparece em 9 skills sem dono.
13. **Evals com modelo real** em CI (hoje `evals:plugin` é manual) e mais negativos entre vizinhos.
14. **Hooks de verificação**: bloquear "pronto" sem evidência; detectar teste pulado ou check silenciado.

## 4. Ideias a copiar (com atribuição e licença)

- `using-superpowers`: "se há 1% de chance de uma skill se aplicar, carregue".
- `ask-matt`: skill roteadora listando só os fluxos invocáveis.
- `doubt-driven-development`: CLAIM→EXTRACT→DOUBT→RECONCILE→STOP.
- `constraint-driven-development`: detectar agente silenciando checagens.
- `wait-what`: re-explicar em linguagem simples usando o glossário.

## 5. Próximos passos

Um PR por item P0 (1, 2, 3), validando com `pnpm run validate`. Depois P1 em lotes pequenos, mantendo o orçamento de 3k tokens por corpo.
