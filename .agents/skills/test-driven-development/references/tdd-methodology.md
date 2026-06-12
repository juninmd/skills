# TDD Principles and Workflow

Detailed guidelines for behavior-first development and vertical slices.

## 1. Core Principles
- **Observable Behavior:** Tests must target public interfaces, not private implementation details.
- **Refactor Survival:** Tests should remain green through internal code restructures.
- **Minimal Mocking:** Mock only unstable boundaries (network, time, random). Prefer integration checks for internal collaborators.
- **Incrementalism:** Do not batch tests. Write exactly one test for the next specific behavior.

## 2. Red-Green-Refactor Cycle
1. **Vertical Slice:** Select the smallest end-to-end behavior to prove.
2. **Red:** Write one failing test that names a user-relevant outcome (return value, UI state, side effect).
3. **Green:** Implement the minimal code required to pass the test. Reject premature generalization.
4. **Refactor:** Clean up code and tests while green. Improve interfaces and remove duplication.
5. **Repeat:** Add the next behavior only after the current slice is verified and readable.

## 3. Anti-Patterns
- **Testing Privates:** Couplings tests to non-public helpers.
- **Wide Mocks:** Mocking local classes that should be exercised together.
- **Batch Testing:** Writing all tests before any implementation.
- **Shape Encoding:** Asserting on object internal structure instead of behavior.
- **False Pass:** Keeping tests that pass despite broken logic.
- **`any` in test code:** Use strict typed mocks instead.
- **`setTimeout` / `sleep`:** Use `act()` or `waitFor()`.
- **Multiple behaviors:** Avoid testing multiple behaviors in a single `it` block.
- **Brittle selectors:** Overusing `data-testid`; prefer `getByRole`.
- **Shared mutable state:** Avoid shared mutable state between tests.

## 4. AAA Pattern (Always)

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

## 5. Test Naming — Behavioral (MANDATORY)

```typescript
// ✅ Describes expected behavior
it('returns user profile when valid token provided')
it('throws ValidationError when email is malformed')

// ❌ Avoid
it('should work')
it('test case 1')
```

## 6. Test Types & Tools

| Type | Tool | Target |
|---|---|---|
| Unit | Vitest / Bun Test | Pure functions, hooks, services |
| Integration | Vitest + real DB in Docker | API routes, database operations |
| E2E | Playwright | Critical user flows |
| Component | Vitest + Testing Library | React components |

## 7. Coverage Gate
Configure tools to block CI below an 80% threshold across lines, branches, functions, and statements.

## 8. React Testing Library
```typescript
it('displays error message when submission fails', async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'bad');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
});
```
