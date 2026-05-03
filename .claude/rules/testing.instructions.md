---
name: testing
description: "Use when writing tests, enforcing TDD, improving assertions, or raising coverage with Vitest or Bun Test. Triggers: testing, TDD, unit tests, integration tests, coverage."
applyTo: '**/*.test.{ts,tsx,js,jsx}, **/*.spec.{ts,tsx,js,jsx}'
paths:
  - "**/*.test.{ts,tsx,js,jsx}"
  - "**/*.spec.{ts,tsx,js,jsx}"
trigger: glob
globs: "**/*.test.{ts,tsx,js,jsx},**/*.spec.{ts,tsx,js,jsx}"
---

# Rule: Testing

> **Mission:** Test first. Ship with confidence. Zero regressions.

## TDD Workflow (MANDATORY)

```
RED    → Write failing test describing expected behavior
GREEN  → Write MINIMAL code to pass (no over-engineering)
REFACTOR → Clean up; tests must still pass
```

## AAA Pattern (Always)

```typescript
describe('CheckoutService', () => {
  let service: CheckoutService;

  beforeEach(() => {
    const mockCartStore = createMock<CartStore>();
    const mockPaymentApi = createMock<PaymentApi>();
    service = new CheckoutService(mockCartStore, mockPaymentApi);
  });

  it('completes checkout when payment succeeds', async () => {
    // Arrange
    mockCartStore.getTotal.mockReturnValue(100);
    mockPaymentApi.charge.mockResolvedValue({ success: true });
    // Act
    const result = await service.checkout();
    // Assert
    expect(result.success).toBe(true);
    expect(mockPaymentApi.charge).toHaveBeenCalledWith(100);
  });

  it('throws CheckoutError when payment fails', async () => {
    mockPaymentApi.charge.mockRejectedValue(new Error('Card declined'));
    await expect(service.checkout()).rejects.toThrow(CheckoutError);
  });
});
```

## Test Naming — Behavioral (MANDATORY)

```typescript
// ✅ Describes expected behavior
it('returns user profile when valid token provided')
it('throws ValidationError when email is malformed')

// ❌ Avoid
it('should work')
it('test case 1')
```

## Test Types & Tools

| Type | Tool | Target |
|---|---|---|
| Unit | Vitest / Bun Test | Pure functions, hooks, services |
| Integration | Vitest + real DB in Docker | API routes, database operations |
| E2E | Playwright | Critical user flows |
| Component | Vitest + Testing Library | React components |

## Coverage Gate (CI BLOCKS BELOW THRESHOLD)

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
      reporter: ['text', 'lcov'],
      exclude: ['**/*.d.ts', '**/*.config.*', '**/index.ts', '**/types.ts'],
    },
  },
});
```

## React Testing Library

```typescript
it('displays error message when submission fails', async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'bad');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
});
```

## Anti-Patterns

- ❌ `any` in test code -> use strict typed mocks
- ❌ `setTimeout` / `sleep` — use `act()` or `waitFor()`
- ❌ Testing implementation details (private methods, internal state)
- ❌ Multiple behaviors in a single `it` block
- ❌ Brittle selectors (`data-testid` overuse — prefer `getByRole`)
- ❌ Shared mutable state between tests

## Checklist

- [ ] Failing test written BEFORE implementation (RED phase)
- [ ] Test file < 100 lines per `describe` block
- [ ] No `any` types in test code
- [ ] Coverage gate (≥80%) enforced in CI
- [ ] Integration tests use real adapters (not mocked DB)
- [ ] E2E tests cover auth, payment, and core flows
