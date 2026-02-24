# Roadmap de Evolução Arquitetural

Este documento descreve os principais problemas arquiteturais identificados no projeto `padrao-labs-agents` e propõe um roteiro (roadmap) para refatoração e evolução da base de código.

## ⚠️ Problemas Arquiteturais Identificados

### 1. Estrutura do Monorepo Misturada (Root-Level Pollution)
Atualmente, o `package.json` na raiz do projeto atua simultaneamente como:
- Raiz do monorepo (usando `pnpm-workspace.yaml`).
- Configuração do projeto de documentação (VitePress).
- Centralizador de testes genéricos (Vitest).

**Impacto:** Misturar dependências de documentação (VitePress, Vue) com ferramentas de linting e scripts raiz gera um escopo poluído, dificulta a manutenção, além de ser um anti-pattern em monorepos.

### 2. Fonte de Verdade (Data Source) Mal Isolada
A pasta `.agents` reside na raiz do projeto e contém todos os arquivos Markdown (skills, workflows, rules, agents).
- O `cli/` usa um script manual (`scripts/bundle-agents.mjs`) para copiar/empacotar esses dados.
- O projeto raiz/docs usa `src/loader.js` para carregar esses dados no VitePress.

**Impacto:** A lógica de consumo e empacotamento dos dados está espalhada e frágil. Os dados não são facilmente testáveis de forma independente e estão acoplados aos scripts de build.

### 3. Duplicação de Diretórios e Configurações
- **Arquivos/Pastas de Agents:** Existem as pastas `.agent/workflows` e `.agents/workflows`, indicando duplicação ou resquícios de refatorações passadas.
- **VitePress:** A configuração do VitePress aparenta estar dividida/duplicada. Existe uma pasta `src/.vitepress/` e `docs/.vitepress/`, gerando confusão sobre onde a configuração real reside.

### 4. Gestão de Testes Descentralizada
O `vitest.config.ts` e a pasta `test/` estão na raiz, mas os scripts de teste no root executam testes globalmente, o que não reflete a separação do monorepo (CLI vs Docs).

---

## 🗺️ Roadmap Proposto

### Fase 1: Organização e Limpeza do Monorepo
**Objetivo:** Estabelecer uma fundação limpa para o pnpm workspaces.
1. **Separar a Documentação:** Mover toda a lógica do VitePress (`src/`, `docs/`, dependências do Vue/VitePress) para um pacote dedicado, ex: `apps/docs` ou `packages/docs`.
2. **Limpar o Root:** O `package.json` raiz deve conter apenas dependências globais de desenvolvimento (como `husky`, `turbo`, linting geral) e scripts orquestradores (ex: `pnpm -r build`).
3. **Consolidar Diretórios Duplicados:** Remover a pasta `.agent` e centralizar tudo em `.agents`.

### Fase 2: Extração do Core (`agents-core`)
**Objetivo:** Isolar a fonte de verdade em um pacote consumível.
1. Criar um pacote `packages/agents-core`.
2. Mover todo o conteúdo da pasta `.agents/` para dentro deste pacote.
3. Expor os arquivos através de exports ou funções auxiliares em TypeScript/Node.
4. Fazer o `cli` e o `docs` consumirem o `@luizalabs/agents-core` como dependência do workspace (`workspace:*`).

### Fase 3: Refatoração do CLI e Documentação
**Objetivo:** Remover scripts frágeis (como `loader.js` e `bundle-agents.mjs`).
1. **No CLI:** Ao invés de empacotar arquivos com scripts soltos de cópia, usar o pacote `agents-core` ou ferramentas de empacotamento que incorporem os assets automaticamente.
2. **Na Documentação:** O VitePress (agora no pacote `docs`) deve ler diretamente do `agents-core` através de módulos Node bem definidos, eliminando a necessidade de loaders complexos baseados em caminhos relativos na raiz.

### Fase 4: Descentralização e Melhoria dos Testes
**Objetivo:** Garantir a qualidade individual de cada pacote.
1. Mover os testes relacionados ao CLI para `cli/test/`.
2. Mover/criar testes de integridade dos Markdown para `packages/agents-core/test/` (ex: verificar se schemas das rules/skills são válidos).
3. Configurar scripts de teste individuais em cada `package.json` de workspace.
