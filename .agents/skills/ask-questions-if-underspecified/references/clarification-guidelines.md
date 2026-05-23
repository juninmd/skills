# Clarification Workflow and Templates

Detailed guidelines for identifying ambiguity and asking effective clarifying questions.

## 1. Identifying Underspecification
Treat a request as underspecified if the following are unclear after initial discovery:
- **Objective:** What should change vs. stay the same.
- **Acceptance Criteria:** What "done" looks like.
- **Scope:** Which files/components are in/out.
- **Constraints:** Compatibility, performance, style, dependencies.
- **Environment:** Language/runtime versions, OS, build/test runner.
- **Safety:** Risk of data migration, rollout, or rollback.

## 2. Asking Must-Have Questions
- **Keep it Small:** 1-5 questions in the first pass.
- **Easy to Answer:** Use numbered lists, avoid paragraphs.
- **Multiple Choice:** Offer lettered options (a, b, c) when possible.
- **Suggest Defaults:** Mark recommended choices clearly (e.g., **(default)**).
- **Fast-Path:** Include a "defaults" option to accept all recommendations.
- **Low Friction:** Structure options for compact replies (e.g., `1b 2a`).

## 3. Pause and Confirm
- Do not run commands or produce detailed plans until must-have questions are answered.
- If proceeding with assumptions, state them clearly as a numbered list and ask for confirmation.
- Once answered, restate the requirement in 1-3 sentences before starting work.

## 4. Question Templates
Example format for clarifying questions:
```text
1) Scope?
a) Minimal change (default)
b) Refactor while touching the area
c) Not sure - use default

2) Compatibility target?
a) Current project defaults (default)
b) Also support older versions: <specify>

Reply with: defaults (or 1a 2a)
```

## Anti-patterns
- Asking questions that can be answered by reading project config/docs.
- Using open-ended questions when a multiple-choice or yes/no would suffice.
