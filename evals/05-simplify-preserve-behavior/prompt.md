---
max_turns: 8
timeout_seconds: 150
allowed_tools: [Skill]
runs: 3
---
This code works but feels overbuilt for what it does. Can you review it and simplify it without changing its behavior?

```ts
class TaxCalculator {
  calculate(amount: number): number {
    return amount * 0.2;
  }
}

class TaxCalculatorFactory {
  static create(): TaxCalculator {
    return new TaxCalculator();
  }
}

const calculator = TaxCalculatorFactory.create();

export function getTax(amount: number): number {
  return calculator.calculate(amount);
}
```
