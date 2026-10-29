# TDD Principles and Workflow

Detailed guidelines for behavior-first development and vertical slices.

## Contents
1. Core Principles
2. Red-Green-Refactor Cycle
3. Anti-Patterns
4. AAA Pattern (Always)
5. Tautological Tests
6. Test Naming — Behavioral
7. Test Types & Tools
8. Coverage Gate
9. React Testing Library

## 1. Core Principles
- **Observable Behavior:** Tests must target public interfaces, not private implementation details.
- **Refactor Survival:** Tests should remain green through internal code restructures.
- **Minimal Mocking:** Mock only unstable boundaries (network, time, random). Prefer integration checks for internal collaborators.
- **Incrementalism:** Do not batch tests. Write exactly one test for the next specific behavior.

## 2. Red-Green-Refactor Cycle
1. **Vertical Slice:** Select the smallest end-to-end behavior to prove.
2. **Red:** Write one failing test that names a user-relevant outcome (return value, UI state, side effect). Run it: it must fail on its assertion, not error on an import, typo, or missing fixture. A pass on the first run means it tests existing behavior — fix the test.
3. **Green:** Implement the minimal code required to pass the test. Reject premature generalization.
4. **Refactor:** Clean up code and tests while green. Improve interfaces and remove duplication.
5. **Repeat:** Add the next behavior only after the current slice is verified and readable.
6. **Done:** Run the full suite, not just the new file, and report every failure by name.

## 3. Anti-Patterns
- **Testing Privates:** Couples tests to non-public helpers.
- **Wide Mocks:** Mocking local classes that should be exercised together.
- **Batch Testing:** Writing all tests before any implementation.
- **Shape Encoding:** Asserting on object internal structure instead of behavior.
- **False Pass:** Keeping tests that pass despite broken logic.
- **Tautological Expectation:** Deriving the expected value with the code under test (section 5).
- **`any` in test code:** Use strict typed mocks instead.
- **`setTimeout` / `sleep`:** Use `act()` or `waitFor()`.
- **Multiple behaviors:** Avoid testing multiple behaviors in a single `it` block.
- **Brittle selectors:** Overusing `data-testid`; prefer `getByRole`.
- **Shared mutable state:** Avoid shared mutable state between tests.

## 4. AAA Pattern (Always)

Keep real collaborators real and fake only the boundary you do not own (here, the payment network). Assert what a caller can observe — the result and the state left behind — not which internal method was called with what. Declare per-test handles at suite scope and reassign them in `beforeEach`; a `const` inside `beforeEach` is out of scope in every `it`.

```typescript
// checkout.ts — the subject, included so the example runs as-is
export class CheckoutError extends Error {}
export interface PaymentGateway { charge(amountCents: number): Promise<{ id: string }> }

export class Cart {
  private lines: { priceCents: number; qty: number }[] = [];
  add(priceCents: number, qty = 1) { this.lines.push({ priceCents, qty }); }
  get totalCents() { return this.lines.reduce((sum, l) => sum + l.priceCents * l.qty, 0); }
  get isEmpty() { return this.lines.length === 0; }
  clear() { this.lines = []; }
}

export class CheckoutService {
  constructor(private cart: Cart, private gateway: PaymentGateway) {}
  async checkout() {
    const amountCents = this.cart.totalCents;
    let receipt: { id: string };
    try {
      receipt = await this.gateway.charge(amountCents);
    } catch (err) {
      throw new CheckoutError(`Payment failed: ${(err as Error).message}`);
    }
    this.cart.clear();
    return { status: 'paid' as const, amountCents, receiptId: receipt.id };
  }
}
```

```typescript
// checkout.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import { Cart, CheckoutError, CheckoutService } from './checkout';

describe('CheckoutService', () => {
  let cart: Cart;
  let declineCard: boolean;
  let service: CheckoutService;

  beforeEach(() => {
    cart = new Cart();                 // real collaborator
    declineCard = false;
    service = new CheckoutService(cart, {
      async charge() {                 // fake network boundary
        if (declineCard) throw new Error('Card declined');
        return { id: 'rcpt_1' };
      },
    });
  });

  it('charges the cart total and empties the cart when payment succeeds', async () => {
    // Arrange
    cart.add(1250, 2);
    // Act
    const result = await service.checkout();
    // Assert
    expect(result).toEqual({ status: 'paid', amountCents: 2500, receiptId: 'rcpt_1' });
    expect(cart.isEmpty).toBe(true);
  });

  it('throws CheckoutError and keeps the cart when the card is declined', async () => {
    cart.add(1250);
    declineCard = true;
    const attempt = service.checkout();
    await expect(attempt).rejects.toBeInstanceOf(CheckoutError);
    await expect(attempt).rejects.toThrow('Payment failed: Card declined');
    expect(cart.totalCents).toBe(1250); // unchanged state on error
  });
});
```

`2500` is worked out by hand (2 × 1250), not by calling `cart.totalCents` — see section 5.

## 5. Tautological Tests

An expected value computed by the same rule as the code — or by the code's own helpers — agrees with the code by construction. The test stays green when the rule is wrong, because both sides are wrong together.

```typescript
// ❌ Recomputes the rule under test; a wrong MEMBER_DISCOUNT still passes
it('applies the member discount', () => {
  const price = 80;
  expect(memberPrice(price)).toBe(price - price * MEMBER_DISCOUNT);
});

// ✅ Literal worked out from the pricing spec (10% off 80)
it('applies the 10% member discount', () => {
  expect(memberPrice(80)).toBe(72);
});
```

- Take expected values from an independent source: a literal, a worked example in the spec, or a hand-checked fixture. Table-driven cases with literal expectations are the preferred shape.
- Other forms of the same defect: a snapshot accepted without being read, a constant asserted equal to itself, an expected string built by the same builder under test.
- Gate before writing the body: name the production change that would make this test fail. If none comes to mind, or only a deliberate decision (a constant's value, exact wording) would, test the behavior that depends on it instead.

## 6. Test Naming — Behavioral (MANDATORY)

```typescript
// ✅ Describes expected behavior
it('returns user profile when valid token provided')
it('throws ValidationError when email is malformed')

// ❌ Avoid
it('should work')
it('test case 1')
```

## 7. Test Types & Tools

| Type | Tool | Target |
|---|---|---|
| Unit | Vitest / Bun Test | Pure functions, hooks, services |
| Integration | Vitest + real DB in Docker | API routes, database operations |
| E2E | Playwright | Critical user flows |
| Component | Vitest + Testing Library | React components |

## 8. Coverage Gate
Use the repository baseline and risk profile. Block unexplained regressions and require direct coverage of changed behavior and critical paths.

## 9. React Testing Library
```typescript
it('displays error message when submission fails', async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'bad');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
});
```

Adapted in part from obra/superpowers (MIT, © 2025 Jesse Vincent) and mattpocock/skills (MIT, © 2026 Matt Pocock).
