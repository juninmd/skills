---
name: managing-quality
description: Ferramentas e práticas para Garantia de Qualidade (QA), Testes Automatizados e Geração de Massa de Dados.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/project] [options]"
---

# Quality Operations

Esta skill padroniza a estratégia de testes e validação de software.

## Instructions
1.  **Test Strategy:** Adote a pirâmide de testes (Unit > Integration > E2E).
    *   **Unit:** Jest (JS/TS) ou Pytest (Python). Cobertura > 80%.
    *   **E2E:** Playwright ou Cypress para fluxos críticos de usuário.
2.  **Mocking & Data Generation:** Use bibliotecas para gerar dados realistas, evitando PII em ambientes de teste.
    *   **Tools:** `faker` (Python/JS) para gerar nomes, emails, endereços.
3.  **Validation:** Valide schemas de entrada/saída (API Contracts).
    *   **Tools:** Zod (TS), Pydantic (Python).

## Testing Automation

### 1. Unit Test Generation (Shift-Left)
**Gatilho:** "gere testes para esta função".
- **Analyze:** Identifique parâmetros, retornos e exceções.
- **Cases:** Defina Happy Path, Edge Cases (null, empty) e Error Cases.
- **Tools:**
    - **Python:** `pytest`, `unittest`.
    - **JS/TS:** `jest`, `vitest`, `mocha`.
- **Best Practice:** Mantenha testes isolados (Mock dependencies).

### 2. E2E Automation (User Journey)
**Gatilho:** "automatize o fluxo de checkout".
- **Plan:** Mapeie a jornada crítica do usuário.
- **Locators:** Use atributos estáveis (`data-testid`, `aria-label`) em vez de seletores CSS frágeis.
- **Tools:**
    - **Web:** `playwright`, `cypress`.
    - **Mobile:** `appium`, `detox`.
- **Best Practice:** Limpe o estado (reset db/cookies) entre testes.

## Common Capabilities

### 1. Generate Unit Tests
**Action:** Escrever testes cobrindo happy path e edge cases.
**Output:** Arquivo `.spec.ts` ou `test_*.py` seguindo convenções do framework.

### 2. Generate E2E Scenarios
**Action:** Criar script Playwright/Cypress simulando usuário real.
**Output:** Teste funcional completo com validações visuais.

### 3. Generate Test Dataset (Specific: Datalake)
**Gatilho:** "massa de dados", "csv produtos".
- **Ação:** Gerar SQL para extrair SKUs de 1P/3P do Datalake (Uso Interno).
- **Output:** CSV com `product_id, sku, seller_id`.

## Advanced Testing Strategies

- **Testcontainers (Integração sem Mocks):** Para testes de integração, evite mockar bancos de dados em memória (ex: sqlite-inmemory, mongomemoryserver). Utilize a biblioteca `testcontainers-node`.
  - **Como funciona:** Ele levanta um container Docker real com a imagem exata de produção sob demanda durante o início da suíte de testes e o destrói magicamente ao final.
  - **Vantagem:** Garante 100% de fidelidade nas transações e queries executadas, sem a sobrecarga de manter os mocks atualizados ou sofrer com particularidades do banco em memória versus produção.
- **Property-Based Testing (fast-check):** Para algoritmos críticos e lógicas complexas (parsers, cálculos financeiros, agendamentos), utilize testes baseados em propriedades usando `fast-check`.
  - **Como funciona:** Em vez de você fornecer o input `a=1` e `b=2`, você diz à lib que o teste aceita "dois números inteiros". O framework vai rodar o mesmo teste 10000 vezes gerando números aleatórios gigantes, negativos, 0 e floats malucos.
  - **Vantagem:** A biblioteca explora agressivamente os "edge cases" em frações de segundo para forçar uma quebra de validação ou de lógica na sua implementação, pegando bugs que um dev normalmente ignoraria criar no TDD manual.
