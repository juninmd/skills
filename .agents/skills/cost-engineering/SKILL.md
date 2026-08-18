---
name: cost-engineering
description: |
  Measure and reduce the unit cost of running software, including cloud spend and LLM token spend. Use for cost attribution, rightsizing, egress and storage tiering, caching economics, token budgets, model routing, and budget guardrails.
---

# Cost Engineering

## Workflow
1. Pick the unit that matters: cost per request, per tenant, per job, or per resolved task. Absolute spend hides regressions.
2. Attribute spend to that unit with tags, labels, or per-call accounting; unattributed cost cannot be optimized.
3. Rank line items by cost multiplied by growth rate, not by current size alone.
4. Fix the top item at its cause: wrong instance shape, chatty egress, retained storage tier, missing cache, or oversized model.
5. Re-measure the same unit after the change and record the delta with the traffic level it was measured at.
6. Add a guardrail that fails loudly: a budget alert, a quota, or a test that asserts the unit cost ceiling.

## Rules
- Never optimize cost before correctness and the latency budget; state the tradeoff explicitly when they conflict.
- Idle and forgotten resources usually beat algorithmic waste. Sweep orphaned volumes, snapshots, and environments first.
- Egress and cross-zone traffic are billed separately from compute; check them before rewriting code.
- Cache only what is expensive and reused; a cache with a low hit rate adds cost, latency, and staleness.
- For LLM calls, measure input and output tokens separately and cache the stable prefix; prompt bloat is a recurring bill.
- Route by difficulty: a smaller model on the easy path with escalation beats one large model on every path.
- Retries, fan-out, and polling multiply cost silently. Bound them and make the bound visible.

## Checklist
- [ ] Cost is attributed to an explicit unit.
- [ ] The change is measured as a before/after delta at a stated traffic level.
- [ ] A budget guardrail or ceiling test is in place.
