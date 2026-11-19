# TDD Principles and Workflow

Behavior-first development in thin vertical slices.

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
- **Observable behavior:** target public interfaces, never private helpers.
- **Refactor survival:** tests stay green while internals are restructured.
- **Minimal mocking:** fake only unstable boundaries (network, time, randomness). Exercise internal collaborators for real.
- **One step at a time:** write a single test for the next behavior, not a batch.

## 2. Red-Green-Refactor Cycle
1. **Slice:** pick the smallest end-to-end behavior worth proving.
2. **Red:** write one failing test that names an outcome a user cares about (return value, UI state, side effect). Run it. It must fail on its assertion, not error out on an import, typo, or missing fixture. If it passes first time, it covers existing behavior; fix the test.
3. **Green:** write the least code that passes. Resist generalizing early.
4. **Refactor:** with everything green, tidy code and tests: sharpen interfaces, remove duplication.
5. **Repeat:** start the next behavior only once this slice is verified and readable.
6. **Done:** run the whole suite, not just the new file, and name every failure.

## 3. Anti-Patterns
- **Testing privates:** ties tests to non-public helpers.
- **Wide mocks:** faking local classes that should run together.
- **Batch testing:** writing every test before any implementation.
- **Shape encoding:** asserting on an object's internal structure instead of its behavior.
- **False pass:** keeping tests that stay green while the logic is broken.
- **Tautological expectation:** computing the expected value with the code under test (section 5).
- **`any` in test code:** use strictly typed mocks.
- **`setTimeout` / `sleep`:** use `act()` or `waitFor()`.
- **Several behaviors per `it`:** one behavior per block.
- **Brittle selectors:** heavy `data-testid` use; prefer `getByRole`.
- **Shared mutable state:** nothing mutable passes between tests.

## 4. AAA Pattern (Always)

Keep real collaborators real and fake only the boundary you do not own (here, the payment network). Assert what a caller can observe, namely the result and the state left behind, not which internal method got called with what. Declare per-test handles at suite scope and assign them in `beforeEach`; a `const` inside `beforeEach` is invisible to every `it`.

```typescript
// order.ts — the subject, included so the example runs as-is
export class OrderError extends Error {}
export interface PaymentGateway { charge(amountCents: number): Promise<{ id: string }> }

export class Basket {
  private items: { priceCents: number; qty: number }[] = [];
  add(priceCents: number, qty = 1) { this.items.push({ priceCents, qty }); }
  get totalCents() { return this.items.reduce((sum, i) => sum + i.priceCents * i.qty, 0); }
  get isEmpty() { return this.items.length === 0; }
  clear() { this.items = []; }
}

export class OrderService {
  constructor(private basket: Basket, private gateway: PaymentGateway) {}
  async placeOrder() {
    const amountCents = this.basket.totalCents;
    let receipt: { id: string };
    try {
      receipt = await this.gateway.charge(amountCents);
    } catch (err) {
      throw new OrderError(`Payment failed: ${(err as Error).message}`);
    }
    this.basket.clear();
    return { status: 'paid' as const, amountCents, receiptId: receipt.id };
  }
}
```

```typescript
// order.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import { Basket, OrderError, OrderService } from './order';

describe('OrderService', () => {
  let basket: Basket;
  let rejectCard: boolean;
  let service: OrderService;

  beforeEach(() => {
    basket = new Basket();             // real collaborator
    rejectCard = false;
    service = new OrderService(basket, {
      async charge() {                 // fake network boundary
        if (rejectCard) throw new Error('Card declined');
        return { id: 'rcpt_1' };
      },
    });
  });

  it('charges the basket total and empties the basket when payment succeeds', async () => {
    // Arrange
    basket.add(1250, 2);
    // Act
    const result = await service.placeOrder();
    // Assert
    expect(result).toEqual({ status: 'paid', amountCents: 2500, receiptId: 'rcpt_1' });
    expect(basket.isEmpty).toBe(true);
  });

  it('throws OrderError and keeps the basket when the card is declined', async () => {
    basket.add(1250);
    rejectCard = true;
    const attempt = service.placeOrder();
    await expect(attempt).rejects.toBeInstanceOf(OrderError);
    await expect(attempt).rejects.toThrow('Payment failed: Card declined');
    expect(basket.totalCents).toBe(1250); // state unchanged on error
  });
});
```

The `2500` was computed by hand (2 × 1250), not read from `basket.totalCents`; see section 5.

## 5. Tautological Tests

If the expected value comes from the same rule as the code, or from the code's own helpers, the two agree by construction. The test stays green when the rule is wrong, since both sides are wrong in step.

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

- Source expected values independently: a literal, a worked example from the spec, or a hand-checked fixture. Table-driven cases with literal expectations are the preferred form.
- The same defect shows up as a snapshot accepted unread, a constant asserted equal to itself, or an expected string produced by the builder under test.
- Before writing the body, name the production change that would make this test fail. If none comes to mind, or only a deliberate decision (a constant's value, exact wording) would, test the behavior that depends on it instead.

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
Judge against the repository baseline and risk profile. Block regressions nobody can explain, and require direct coverage of changed behavior and critical paths.

## 9. React Testing Library
```typescript
it('displays error message when submission fails', async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'bad');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
});
```
