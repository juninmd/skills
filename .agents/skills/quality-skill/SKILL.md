---
name: quality-ops
description: Ferramentas e práticas para Garantia de Qualidade (QA), Testes Automatizados e Geração de Massa de Dados.
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

## Common Capabilities

### 1. Generate Unit Tests
**Gatilho:** "crie testes unitários para esta função".
- **Ação:** Escrever testes cobrindo happy path e edge cases.
- **Output:** Arquivo `.spec.ts` ou `test_*.py`.

### 2. Generate E2E Scenarios
**Gatilho:** "teste o fluxo de login".
- **Ação:** Criar script Playwright/Cypress simulando usuário.

### 3. Generate Test Dataset (Specific: Datalake)
**Gatilho:** "massa de dados", "csv produtos".
- **Ação:** Gerar SQL para extrair SKUs de 1P/3P do Datalake (Uso Interno).
- **Output:** CSV com `product_id, sku, seller_id`.
