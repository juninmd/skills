# Roadmap — referências novas de revisão, prova e automação

Status em 2026-09-17: **17/17 implementados**, todos como `references/*.md` de skills que já existem.
Nenhuma skill nova, nenhum `SKILL.md` alterado.

## Decisões

- **Sem mexer em `SKILL.md`.** `code-review`, `agent-engineering`, `finishing-dev` e `security-ops`
  estão a poucos tokens do teto de 1650; todas as refs novas entram pelo `TOPIC_MAP.md` da skill,
  que o gate de órfãos aceita.
- **Três vendors MIT em subdiretório**, com `LICENSE` e `UPSTREAM.md` (commit fixado e alterações
  locais), seguindo o precedente de `security-ops/references/security-audit/`:
  - `documentation/references/ai-writing-tells/`, de blader/humanizer (`9862685`);
  - `code-review/references/simplification/`, de addyosmani/agent-skills (`a120596`); o `name` do
    frontmatter virou `simplification`, porque o nome upstream está em `.agents/retired-skills.json`;
  - `software-architecture/references/deep-modules/`, de mattpocock/skills (`74ca5fe`); as chamadas
    a skills que não existem aqui viraram links para procedimentos locais, e o relatório HTML usa
    Mermaid `strict` e só abre depois de perguntar.
- **Guias por diretório são opt-in.** `directory-guides.md` não substitui o limite de uma tela de
  `codebase-mapping.md`, que segue como padrão; o ganho é atualizar só o que mudou, por hash.
- **Worktrees sem ref nova.** O conteúdo entrou como patch nas refs de worktree de `starting-dev`, e
  `git-workflow/references/TOPIC_MAP.md` aponta para lá. Isso resolve parte do item 7 do `roadmap.md`.
- **Checagens por ecossistema ficam fora do vendor de auditoria.** O vendor
  `security-ops/references/security-audit/` continua dono do método; `ecosystem-checks.md` é a
  camada concreta por toolchain.

## Checklist

| # | Tema | Destino | O que entra | Tipo |
| --- | --- | --- | --- | --- |
| 1 | PR de fora | `code-review/references/untrusted-contribution.md` | Tudo que o autor controla é dado; tabela de afirmações; triagem estática antes de executar; dependências e pipelines; checkout isolado | ref nova |
| 2 | Issues | mesma ref, "Issue reports" | Sintoma × diagnóstico do autor, reprodução com entrada própria, nada do relato roda no host, canal privado para vulnerabilidade | seção |
| 3 | Árvore antes do release | mesma ref, última seção | Faixa fixada por SHA, merge conferido contra o head aprovado, mudanças que colidem juntas, changelog completo | seção |
| 4 | Checagens por ecossistema | `security-ops/references/ecosystem-checks.md` | Hooks de install e build e chamadas de risco em nove toolchains, mais ajustes por framework | ref nova |
| 5 | Tickets na entrega | `finishing-dev/references/phase-done.md` | Um ticket por vez, `Fixes #n` no PR, fechar à mão só com confirmação e depois do merge | patch |
| 6 | Release | `git-workflow/references/release-management.md` | Bump divergente da classificação para e pede confirmação; rebase do branch de release antes da tag | patch |
| 7 | Depois do refactor | `code-review/references/refactor-followup.md` | Menor faixa possível, check não rodado aparece como não rodado, sobras da mudança, testes enfraquecidos | ref nova |
| 8 | Simplificação | `code-review/references/simplification/` | Sinais de complexidade e ciclo de uma mudança por teste | vendor |
| 9 | Desenho da prova | `starting-dev/references/proof-design.md` | Resultado e riscos, prova escolhida pelo que o sistema expõe, um check decisivo por resultado, veredito Proven/Conditional/Disproven | ref nova |
| 10 | Módulos profundos | `software-architecture/references/deep-modules/` | Vocabulário de módulo e seam, teste de deleção, candidatos a aprofundar | vendor |
| 11 | Guias por diretório | `starting-dev/references/directory-guides.md` | `ARCHITECTURE.md` por diretório e índice na raiz, atualização incremental por hash, opt-in | ref nova |
| 12 | Marcas de texto de IA | `documentation/references/ai-writing-tells/` | Padrões de prosa que soam gerados e como tirá-los sem mudar o conteúdo | vendor |
| 13 | Verificação de afirmações | `web-research/references/claim-verification.md` | Tabela de afirmações, fonte original datada, checagem de raciocínio, nova checagem após as edições | ref nova |
| 14 | Entrega em etapas | `agent-orchestration/references/parallel-subagents.md` | Etapas com checkpoint de revisão, no máximo duas revisões extras por checkpoint | patch |
| 15 | Candidatos a automação | `skill-authoring/references/automation-candidates.md` | Se uma tarefa recorrente merece um asset e qual a opção mais leve | ref nova |
| 16 | Workstreams em worktrees | `starting-dev/references/worktree-standards.md` e `worktree-workflow.md` | Um escritor por workstream, registro local, merge e limpeza com confirmação | patch |
| 17 | Critério de sucesso tipado | `starting-dev/references/loop-state.md` | `success` tipado, executor separado do verificador, `maxAttempts` com escalonamento | patch |

Placar: **7 refs novas**, **3 vendors MIT**, **5 patches** e **2 seções** (itens 2 e 3, dentro do
item 1), em 9 skills.

## Gates

- linha no `TOPIC_MAP.md` da skill dona;
- `pnpm run validate`, `pnpm run docs:build` e `pnpm run pr:check`;
- nos vendors, `UPSTREAM.md` com repositório, commit fixado, licença e alterações locais;
- **rode os gates num checkout limpo com LF**, como o CI: no Windows, CRLF infla a contagem de
  tokens, e arquivos não rastreados de outro trabalho reprovam `agents:validate` e `catalog:check`;
- o `cspell-action` do CI pode rejeitar palavra que o cspell local aceita; confira o job depois do push.
