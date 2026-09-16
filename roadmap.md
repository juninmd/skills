# Roadmap — vendorizar skills de `skills-bestas`

Origem: `D:\Solutions\pessoal\skills-bestas` (418 skills, 3.459 arquivos, 38 MB, sem git).
Destino: este repo (24 skills guarda-chuva).

## Regra

Não copiar 1:1. 418 skills soltas duplicam triggers e estouram os gates de token.
Padrão da casa, já usado em `security-ops/references/security-audit/`: vendorizar como
`references/` dentro da skill guarda-chuva, com `UPSTREAM.md` (repo + commit + licença) e
o `LICENSE` original quando o upstream exigir.

Custo por item: entrada no `TOPIC_MAP.md` da skill, budget de token respeitado,
gate de orphan-ref verde, `UPSTREAM.md` preenchido.

## Tier 1 — lacunas reais

| # | Destino | Copiar / consolidar de | Por quê |
| --- | --- | --- | --- |
| 1 | DONE — `data-engineering/references/vector-databases.md` | `qdrant-*` (8 skills -> 1 ref) + `managing-vector-databases` | a description promete "vector storage" e não existe nenhuma ref |
| 2 | DONE — `data-engineering/references/redis-operations.md` | `redis-core`, `redis-search`, `redis-clustering`, `redis-security`, `redis-observability`, `redis-semantic-cache` (8 -> 1) | Redis está na description, zero ref |
| 3 | `security-ops/references/static-analysis.md` | `semgrep`, `semgrep-rule-creator`, `codeql`, `sarif-parsing` | `security-audit/` é metodologia, não ferramenta |
| 4 | `security-ops/references/fuzzing/` | `aflpp`, `libfuzzer`, `cargo-fuzz`, `atheris`, `address-sanitizer`, `ossfuzz` (Trail of Bits) | CC BY-SA 4.0: subdiretório com LICENSE, não inline no repo MIT |
| 5 | `security-ops/references/gha-security-review.md` | `gha-security-review` (Sentry) | pwn-request, expression injection, credential escalation |
| 6 | `agent-engineering/references/skill-scanner.md` | `skill-scanner` (Sentry) | audita skills de terceiros — o gate que falta para os 418 |
| 7 | `git-workflow/references/worktrees.md`, `merge-conflicts.md` | `using-git-worktrees`, `resolving-merge-conflicts` | 4 refs apenas, mas a description promete worktrees, rebase conflicts, bisect, reflog |
| 8 | `software-architecture/references/deep-modules.md` | `codebase-design` (Matt Pocock) | vocabulário de módulo profundo / seam; não coberto por `design-principles.md` |
| 9 | `code-review/references/panel-review.md` | `panel-review` (Trail of Bits) | revisão multi-perspectiva; complementa `expert-review.md`. CC BY-SA |
| 10 | `cloud-devops/references/renovate.md` | `managing-dependencies-renovate` | bump automatizado de dependência; hoje só regra manual |

~10 refs novas consolidando ~30 skills upstream.

Itens 1 e 2 entregues: `managing-vector-databases` foi descartado na leitura (é um catálogo genérico de capabilities, sem conteúdo acionável); `redis-connections` entrou junto, não estava na lista original.

Ordem sugerida: começar pelo item 1 e 2 (`data-engineering`) — é onde a description mente hoje.
Rodar o validador e revisar o diff antes de seguir.

## Tier 2 — condicional à stack ativa

Só vendorizar o que for usado toda semana; o resto o Context7 serve ao vivo.

- `expo-*` (12) -> `mobile-engineering`
- `aws-cdk-development`, `aws-sst-development`, `aws-cost-operations` -> `cloud-devops` / `performance-engineering`
- `figma-implement-design` -> `frontend-engineering`
- `resend`, `react-email` -> `backend-systems`
- `shadcn-ui`, `unocss`, `nuxt`, `pinia`, `vue-dev` -> `frontend-engineering`

## Tier 3 — não copiar

- Cripto/web3 (~30): `BOTCOIN`, `bankr*`, `clanker`, `qrcoin`, `moltycash`, `endaoment`, `neynar`, `zerion`, `onchainkit`, `0xwork`, `erc-8004`, `siwa`, `quicknode`, `alchemy`, `trustlayer-sybil-scanner`, `litcoin`, `stakr`, `zyfai`, `hydrex`, `helixa`, `symbiosis`, `agenticbets`
- Fluff de startup: `pricing`, `marketing-plan`, `mvp`, `first-customers`, `grow-sustainably`, `company-values`, `interpreting-culture-index`, `validate-idea`, `find-community`
- Piadas: `caveman`, `let-fate-decide`, `yoink`
- Já duplicados aqui: `commit`, `review-pr`, `find-bugs`, `playwright`, `tdd`, `tdd-workflow`, `test-driven-development`, `agents-md`, `skill-creator`

## Licenças a respeitar

- Trail of Bits (itens 4 e 9): CC BY-SA 4.0 — atribuição e share-alike; manter em subdiretório com LICENSE.
- OpenAI / Figma: `LICENSE.txt` por skill, copiar junto.
- No upstream só 32 das 418 skills carregam arquivo de licença; conferir o repo de origem antes de copiar.

## Estado auditado da origem (2026-09-15)

- 418 skills, 0 sem frontmatter, 0 com `name` != diretório, 0 nomes duplicados.
- 77 skills trazem `scripts/` (superfície de supply-chain — rodar o item 6 antes de vendorizar qualquer uma).
- Soma das descriptions ~102 KB (~26k tokens): não existe índice; descoberta é por grep.
