---
name: explain
description: "Explain code step by step, including logic, purpose, dependencies, edge cases, and pitfalls. Triggers: explain this code, walk me through this function, how does this work."
argument-hint: "[file or code snippet]"
---
# Code Explanation

When the user invokes `/explain` $ARGUMENTS:

- If no code or file is provided, ask: "What code or file should I explain?"
- Respond in the same language the user is using.

## Output Structure

1. **High-Level Summary** — 1-2 sentences: what does this code do and why does it exist?

2. **Step-by-Step Breakdown**
   - Walk through the logic in execution order
   - Explain non-obvious algorithms, regex, bitwise ops, or obscure syntax in plain terms
   - Highlight key variables, function calls, and control flow decisions

3. **Context & Dependencies**
   - Design pattern in use (Singleton, Observer, Repository, etc.)
   - Side effects: DB writes, network calls, file I/O, global state mutations
   - What the caller is expected to provide and what it gets back

4. **Edge Cases & Pitfalls**
   - Input values that could cause unexpected behavior (null, empty, negative, overflow)
   - Security concerns (injection, unvalidated input, exposed secrets)
   - Performance traps (N+1, unbounded loops, blocking calls)

5. **Improvement Opportunities** *(only if obvious)*
   - One or two concrete suggestions — not a full refactor

## Tone

Educational and objective. The reader is a competent developer, not a beginner. Skip trivialities ("this is a for loop"), focus on the non-obvious.
