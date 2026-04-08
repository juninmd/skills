---
name: managing-quality
description: Tools and practices for Quality Assurance (QA), Automated Testing, and Test Data Generation.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/project] [options]"
---

# Quality Operations

This skill standardizes testing strategy and software validation.

## Instructions
1.  **Test Strategy:** Adopt the test pyramid (Unit > Integration > E2E).
    *   **Unit:** Jest (JS/TS) or Pytest (Python). Coverage > 80%.
    *   **E2E:** Playwright or Cypress for critical user flows.
2.  **Mocking and Data Generation:** Use libraries to generate realistic data, avoiding PII in test environments.
    *   **Tools:** `faker` (Python/JS) to generate names, emails, addresses.
3.  **Validation:** Validate input/output schemas (API Contracts).
    *   **Tools:** Zod (TS), Pydantic (Python).

## Test Automation

### 1. Unit Test Generation (Shift-Left)
**Trigger:** "generate tests for this function".
- **Analysis:** Identify parameters, returns, and exceptions.
- **Cases:** Define Happy Path, Edge Cases (null, empty), and Error Cases.
- **Tools:**
    - **Python:** `pytest`, `unittest`.
    - **JS/TS:** `jest`, `vitest`, `mocha`.
- **Best Practice:** Keep tests isolated (Mock dependencies).

### 2. E2E Automation (User Journey)
**Trigger:** "automate the checkout flow".
- **Planning:** Map the critical user journey.
- **Locators:** Use stable attributes (`data-testid`, `aria-label`) instead of fragile CSS selectors.
- **Tools:**
    - **Web:** `playwright`, `cypress`.
    - **Mobile:** `appium`, `detox`.
- **Best Practice:** Clean state (reset db/cookies) between tests.

## Common Capabilities

### 1. Generate Unit Tests
**Action:** Write tests covering happy path and edge cases.
**Output:** `.spec.ts` or `test_*.py` file following framework conventions.

### 2. Generate E2E Scenarios
**Action:** Create Playwright/Cypress script simulating a real user.
**Output:** Complete functional test with visual validations.

### 3. Generate Test Dataset (Specific: Datalake)
**Trigger:** "data mass", "products csv".
- **Action:** Generate SQL to extract 1P/3P SKUs from the Datalake (Internal Use).
- **Output:** CSV with `product_id, sku, seller_id`.

## Advanced Testing Strategies

- **Testcontainers (Integration without Mocks):** For integration tests, avoid mocking in-memory databases (e.g., sqlite-inmemory, mongomemoryserver). Use the `testcontainers-node` library.
  - **How it works:** It spins up a real Docker container with the exact production image on demand during the test suite startup and magically destroys it at the end.
  - **Advantage:** Guarantees 100% fidelity in transactions and queries executed, without the overhead of keeping mocks updated or suffering from in-memory database quirks versus production.
- **Property-Based Testing (fast-check):** For critical algorithms and complex logic (parsers, financial calculations, scheduling), use property-based testing using `fast-check`.
  - **How it works:** Instead of providing the input `a=1` and `b=2`, you tell the lib that the test accepts "two integers". The framework will run the same test 10000 times generating giant, negative, 0, and crazy float random numbers.
  - **Advantage:** The library aggressively explores "edge cases" in fractions of a second to force a validation or logic break in your implementation, catching bugs that a dev would normally ignore creating in manual TDD.
