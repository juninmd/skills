# Karpathy Coding Methodology

Detailed guidelines to reduce common LLM coding pitfalls through caution and simplicity.

## 1. Think Before Coding
- **No Assumptions:** State assumptions explicitly. If uncertain, ask.
- **Ambiguity:** Present multiple interpretations; do not choose silently.
- **Push Back:** Suggest simpler approaches; stop and clarify if confused.

## 2. Simplicity First
- **Minimum Viable:** Implement only what was requested.
- **No Speculation:** Avoid single-use abstractions or "just-in-case" flexibility.
- **Refinement:** If 50 lines can replace 200, rewrite for simplicity.

## 3. Surgical Changes
- **Targeted Edits:** Touch only the required lines; do not "improve" adjacent code.
- **Style Matching:** Match local conventions, even if non-standard.
- **Orphan Cleanup:** Remove only the dead code created by *your* changes.

## 4. Goal-Driven Execution
- **Success Criteria:** Transform tasks into verifiable checks (e.g., reproduction tests).
- **Phased Planning:** Use step-by-verify plans for complex tasks.
- **Validation Loops:** Iterate until the concrete criteria are met.
