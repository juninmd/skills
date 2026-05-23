# Function Micro-Analysis Guidelines

Standards for line-by-line and block-by-block code comprehension.

## 1. Per-Function Checklist
For every function analyzed:
1. **Purpose:** Why it exists and its role.
2. **Inputs & Assumptions:** Parameters, state, preconditions.
3. **Outputs & Effects:** Returns, state writes, events, external calls.
4. **Micro-Analysis:** Block-by-block First Principles, 5 Whys, and 5 Hows.

## 2. Cross-Function & External Flows
Treat call chains as one continuous flow:
- **Internal Calls:** Jump into the callee immediately; propagate invariants.
- **External Calls (Known Code):** Treat as internal; jump and trace.
- **External Calls (Black Box):** Analyze as adversarial; consider reverts, misbehavior, and reentrancy.

## 3. Output Requirements
Refer to `resources/OUTPUT_REQUIREMENTS.md` for the mandatory structure:
- Minimum 3 invariants per function.
- Minimum 5 assumptions documented.
- Minimum 3 risk considerations for external calls.
- At least 1 First Principles and 3 (5 Whys/5 Hows) applications.

## 4. Rationalizations (Do Not Skip)
- **"I get the gist"** → WRONG. Line-by-line analysis required.
- **"Function is simple"** → WRONG. Simple functions compose into complex bugs.
- **"Taking too long"** → WRONG. Slow is fast; rushed context leads to hallucinations.
