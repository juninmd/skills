---
max_turns: 8
timeout_seconds: 150
allowed_tools: [Skill]
runs: 3
---
I found this function while cleaning up. I grepped the repo and nothing imports `legacyCurrencyFormat`, and there's no test file for it either.

```ts
// src/utils/legacy-format.ts
export function legacyCurrencyFormat(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
```

Is it safe to just delete this function?
