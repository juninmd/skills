# GitHub Triage Logic and Labels

Standardized classification system for GitHub issues.

## 1. Label Definitions

| Label | Type | Description |
| :--- | :--- | :--- |
| `bug` | Category | Something is broken. |
| `enhancement` | Category | New feature or improvement. |
| `needs-triage` | State | Maintainer evaluation required. |
| `needs-info` | State | Waiting for reporter details. |
| `ready-for-agent` | State | Fully specified for automation. |
| `ready-for-human` | State | Requires human implementation. |
| `wontfix` | State | Will not be actioned. |

## 2. State Machine Transitions
- **Unlabeled** -> `needs-triage`, `ready-for-agent`, or `wontfix`.
- **needs-triage** -> `needs-info`, `ready-for-agent`, or `ready-for-human`.
- **needs-info** -> `needs-triage` (upon reply).

**Rule:** Every issue must have exactly one state label and one category label.
