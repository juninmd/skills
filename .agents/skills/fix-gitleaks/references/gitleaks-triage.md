# Gitleaks Interactive Triage

Guidelines for evaluating and recommending actions for detected leaks.

## 1. Decision Block Format
For every finding, present:
- File, Line, and Real Value.
- Git metadata (Commit, Branch, Author, Date).
- Fingerprint.
- **AI Recommendation:** `[Action] + [Reason] + [Mitigation]`.

## 2. Recommendation Logic
- **Remove:** High entropy, real service keys (AWS, Google), private keys.
- **Ignore:** Low entropy, placeholders, README snippets, known test fixtures.
- **Revoke:** Mandatory if a real key reached a public branch.

## 3. Batching
If triaging > 5 findings, group them by `RuleID` to allow for batch decisions.
