---
name: naming-conventions
description: Padrões de nomenclatura para sistemas e arquivos.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Naming Conventions

## Sistemas
- Nomes de sistemas devem ser simples, acessíveis e em português ou amplamente compreendidos.
- **Sufixos obrigatórios** para identificar a natureza do serviço:
  - `-api` — serviços REST/GraphQL
  - `-worker` — processamento assíncrono/filas
  - `-cron` — jobs agendados
  - `-frontend` — interface web

## Branches (Git)
Seguir Conventional Commits para nomes de branch:
- `feat/<descricao>` — nova funcionalidade
- `fix/<descricao>` — correção de bug
- `chore/<descricao>` — manutenção, dependências
- `hotfix/<descricao>` — correção urgente em produção
- Kebab-case, minúsculas, sem espaços. Exemplo: `feat/add-telemetry-endpoint`

## Commits (Conventional Commits)
- `feat:` — nova funcionalidade
- `fix:` — correção de bug
- `docs:` — documentação
- `chore:` — tarefas de manutenção
- `refactor:` — refatoração sem mudança de comportamento
- `test:` — adição ou correção de testes
- `ci:` — alterações no pipeline

## Código
- **Python**: `snake_case` para variáveis e funções; `PascalCase` para classes; `UPPER_SNAKE_CASE` para constantes.
- **JavaScript/TypeScript**: `camelCase` para variáveis e funções; `PascalCase` para componentes/classes.
- **Frontend Web (arquivos e pastas)**: usar `kebab-case` para nomes de diretórios e arquivos (`checkout-form.tsx`, `user-menu.tsx`, `auth-store.ts`).
- **Frontend Web (componentes)**: componentes React exportados em `PascalCase`, mesmo quando o arquivo estiver em `kebab-case`.
- **Hooks**: prefixo obrigatório `use` em `camelCase` (`useCheckoutForm`, `useAuthSession`).
- **Stores**: nome explícito com sufixo `-store` para arquivos e `Store` para tipos/interfaces quando necessário (`cart-store.ts`, `AuthStore`).
- **Features**: alinhar nome da feature, rota e pasta sempre que possível (`billing-history/`, `/billing-history`, `BillingHistoryPage`).
- **Evitar nomes genéricos**: não criar diretórios ou módulos `utils`, `helpers`, `common` ou `misc` sem contexto de domínio claro.
- **Variáveis de ambiente**: sempre `UPPER_SNAKE_CASE` (ex: `DATABASE_URL`, `SONAR_TOKEN`).

