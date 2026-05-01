# Code Quality Skills

Skills for code auditing, type safety, and design principles.

## `audit-context-building`

**Invoke:** `/audit-context-building`

Ultra-granular line-by-line code analysis for vulnerability and quality finding.

**Methodology:**
- **First Principles** — question every assumption about what the code should do
- **5 Whys** — trace root causes, not just symptoms
- **5 Hows** — enumerate exploitation and remediation paths

**Output:** annotated file with findings at specific line numbers, severity ratings, and remediation code samples.

**Use when:** preparing for a security review, investigating a production incident, auditing legacy code before a major refactor.

---

## `auditing-code`

**Invoke:** `/auditing-code`

Static analysis, linting, and code smell detection.

**Languages:** Python (ruff, pylint), JavaScript/TypeScript (Biome, ESLint), any language via structural pattern matching.

**Detects:**
- Unused variables and imports
- Dead code paths
- Duplicated logic
- Overly complex functions (cyclomatic complexity)
- Missing error handling
- Inconsistent naming

---

## `validating-typescript`

**Invoke:** `/validating-typescript`

Strict TypeScript type safety enforcement.

**Rules enforced:**
- No `any` — use `unknown` with type narrowing
- Zod schemas for all external inputs (API bodies, env vars, localStorage)
- Branded types for IDs and domain primitives
- Exhaustive union handling with discriminated unions
- No non-null assertions (`!`) without justification
- `strict: true` in `tsconfig.json`

---

## `applying-design-principles`

**Invoke:** `/applying-design-principles`

Refactoring to Clean Code, SOLID, DRY, KISS, YAGNI.

**SOLID in practice:**
- **S** — One reason to change per module/class
- **O** — Extend via composition, not modification
- **L** — Subtypes are substitutable for their base
- **I** — Small, focused interfaces
- **D** — Depend on abstractions, not concretions

**DRY:** extract logic when duplicated 3+ times with the same semantics.

**YAGNI:** don't build for hypothetical future requirements.

---

## `karpathy-guidelines`

**Invoke:** `/karpathy-guidelines`

Avoid common LLM-assisted coding mistakes, based on Andrej Karpathy's guidelines.

**Key rules:**
- Don't trust generated code without reading it
- Don't add complexity you don't understand
- Verify imports and library versions actually exist
- Test edge cases explicitly — LLMs optimize for the happy path
- Keep functions small and verifiable
- Don't accept "this should work" without running it
