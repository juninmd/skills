---
max_turns: 8
timeout_seconds: 150
allowed_tools: [Skill]
runs: 3
---
I just finished implementing exponential backoff retry logic on my branch. Can you review it and get it ready so I can open the PR?

```ts
export async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      if (attempt >= maxAttempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 100));
    }
  }
}
```
