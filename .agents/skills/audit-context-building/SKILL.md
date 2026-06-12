---
name: audit-context-building
description: "Audit Context Builder for Deep comprehension, Bottom-up understanding, Reducing hallucinations via function-analyzer."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, invoke_agent]
---

# Audit Context Builder

Expert methodology for building deep, accurate comprehension of complex codebases through ultra-granular analysis before starting the vulnerability-hunting phase.

**USE FOR:**
- Deep comprehension before bug discovery or security auditing.
- Bottom-up understanding instead of high-level guessing.
- Reducing hallucinations and context loss in large systems.
- Preparing for architecture reviews, threat modeling, or security audits.

**DO NOT USE FOR:**
- Reporting vulnerability findings or fix recommendations.
- Exploit reasoning or severity/impact rating.
- Final conclusions (this is **pure context building** only).

**INVOKES:**
- `function-analyzer` subagent for per-function deep analysis.

## Methodology and Phases
Implementation details for each phase are documented in:
1. [Audit Orientation and Phases](references/audit-phases.md)
2. [Function Micro-Analysis Guidelines](references/function-analysis.md)
3. [Stability, Consistency, and Subagents](references/stability-rules.md)

## Core Behavior
- **Ultra-Granular:** Line-by-line/block-by-block analysis by default.
- **Reasoning:** Apply First Principles, 5 Whys, and 5 Hows at micro scale.
- **Continuity:** Treat call chains as continuous execution flows; propagate invariants.
- **Anti-Hallucination:** Express uncertainty explicitly; anchor facts periodically.

## Checklist
- [ ] Resolve every ambiguity possible with a fast local read before asking the user.
- [ ] Identify major modules, entrypoints, and actors before deep analysis.
- [ ] Perform micro-analysis on every non-trivial function in scope.
- [ ] Track how state transforms and records assumptions that persist across steps.
- [ ] Update previous assumptions explicitly if contradicted by new evidence.
