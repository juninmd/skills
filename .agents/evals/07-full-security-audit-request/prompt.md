---
max_turns: 8
timeout_seconds: 150
allowed_tools: [Skill]
runs: 3
---
Run a full security audit on this repo before we ship: check for hardcoded secrets, injection risks, and outdated dependencies with known CVEs.

```ts
const apiKey = "FAKE-API-KEY-FOR-EVAL-DO-NOT-USE";
export function callPaymentApi(payload: unknown) {
  return fetch("https://api.example.com/charge", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });
}
```
