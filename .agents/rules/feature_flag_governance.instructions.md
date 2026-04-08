---
name: feature-flag-governance
description: Lifecycle and cleanup standards for feature flags to avoid permanent toggle debt.
applyTo: '**/*.{py,ts,tsx,js,jsx,go,java,kt}, **/*.md'
---

# Rule: Feature Flag Governance

## Lifecycle Rules
- Every new flag must include owner, creation date, and sunset date.
- Define explicit rollout strategy before enabling in production.
- Remove stale flags after rollout is complete.

## Implementation Rules
- Do not nest unrelated flags.
- Keep flag checks close to entry points, not spread across layers.
- Validate both enabled and disabled paths in tests.

## Governance Rules
- Review all active flags periodically.
- Treat expired flags as technical debt with fixed remediation SLA.
