# Architecture Improvement Vocabulary and Ranking

Standard terms and criteria for evaluating codebase architecture.

## 1. Vocabulary
- **Module:** Any unit of behavior with callers (function, service, route).
- **Interface:** The public surface callers must understand (inputs, outputs, invariants).
- **Depth:** Useful behavior hidden behind a concise interface.
- **Change Surface:** The ripple effect of a single conceptual change.
- **Test Surface:** Public points where behavior can be verified without coupling to internals.

## 2. Ranking Opportunities
Present candidates with:
- **Files:** Key modules involved.
- **Friction:** Evidence of maintenance cost (e.g., duplicate rules, thin wrappers).
- **Proposal:** Specific boundary or ownership change.
- **Payoff:** Improvements in locality, testability, and clarity.
- **Risk:** Potential regressions and mitigation steps.

## 3. The Deletion Question
If this module disappeared, would complexity vanish or spread? If it spreads, the module likely provides valuable depth.
