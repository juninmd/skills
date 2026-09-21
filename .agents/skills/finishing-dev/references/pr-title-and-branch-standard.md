# Branch, PR Title, and Description Standard

A reviewer decides whether to open a PR from its branch name and title alone, and decides whether to trust it from whether every claim in the body traces to something real. This is the shared format; [pr-evidence.md](pr-evidence.md) covers how to capture the evidence section itself.

## Branch naming

`<type>/<short-kebab-slug>` — same `<type>` vocabulary as commits: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`. The slug names the change, not the whole task or ticket.

| Change | Branch |
|---|---|
| New retry policy for the payment client | `feat/payment-client-retry` |
| Off-by-one in pagination cursor | `fix/pagination-cursor-offset` |
| Reference-map placeholder cleanup | `docs/topic-map-placeholder-fixes` |
| Extract shared file-walking helper | `refactor/shared-file-walker` |

A slug scoped to the ticket number or the whole epic ("feat/JIRA-4821", "fix/bugs") forces reviewers to open the diff to learn what changed; keep the ticket reference in the PR body instead.

## PR/MR title

Same shape as a commit subject: `<type>(<scope>): <imperative summary>`, under ~70 characters, describing the change, not the process.

| Bad | Why | Good |
|---|---|---|
| `PR for auth bug` | Names the process, not the change | `fix(auth): reject expired refresh tokens` |
| `Updates` | No type, no scope, no verb | `docs(readme): correct install command` |
| `Fix stuff in the benchmark script` | Vague verb, no scope | `fix(tools): count reference files on Windows` |

## Description template

Every section below is required and traceable — a diff line, a real command's real output, or an explicit "not applicable, because …". A section filled with prose describing what a check would show, with nothing behind it, is a named blocker, not a passing section.

| Section | Content | Not sufficient |
|---|---|---|
| Summary | 1-3 bullets: what changed and why; the why outranks the what | A restatement of the title |
| Evidence | Real screenshot per visible UI/web change, real payload per CLI/contract change — see [pr-evidence.md](pr-evidence.md) for capture rules | A description of what the screenshot would show |
| How to test | The exact command(s) a reviewer runs, and the expected outcome | "Should work" with no command |
| Verification / proof | The commands actually run in this session and their literal output lines, per the Iron Law in [SKILL.md](../SKILL.md) | "Tests pass" with no pasted output |
| Test plan | A checklist mapping each Summary claim to what was verified | An empty or generic checklist copied between PRs |

## Worked example

Branch: `fix/order-total-rounding`

PR title: `fix(orders): round order totals to the nearest cent`

~~~markdown
## Summary
- Order totals could sum to fractional cents when a line had a percentage
  discount, causing a mismatch with the payment provider's charge amount.
- Round each line total before summing, not only the final total.

## Evidence
```console
$ curl -s localhost:3000/v1/orders/ord_42 | jq .total
4990
```
(previously `4989.6`; see [pr-evidence.md](pr-evidence.md) for payload rules)

## How to test
1. `pnpm test order-totals` — expects `0 failing`.
2. `curl -s localhost:3000/v1/orders/ord_42` — expect integer `total`, no
   fractional cents.

## Verification / proof
```console
$ pnpm test order-totals
✔ 6 passed, 0 failed
```

## Test plan
- [x] Existing discount tests still pass (`pnpm test order-totals`).
- [x] New regression test covers the fractional-cent case.
- [x] Manual curl against a seeded order confirms an integer total.
~~~

Illustrative only — the order id, amounts, and endpoint are invented, not from a real system.

## Rules
- A branch or title naming the ticket instead of the change still needs review to understand; fix the name, don't compensate with a longer description.
- Every "Verification / proof" line must be reproducible from this session's actual command output, per the skill's Iron Law — never a claim carried over from an earlier run.
- When a section does not apply (e.g., no visible UI change), state that explicitly with the reason; silence reads as an omission, not an exemption.
