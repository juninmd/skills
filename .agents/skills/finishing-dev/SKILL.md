---
name: finishing-dev
description: |
  Deliver finished work end to end: review the diff, gate on blocking findings and breaking API changes, branch, commit, run the project's own checks, push, and open a pull request with a description, evidence and an assignee. Use for finishing development work, drafting the pull request body and summarizing what changed, GitHub CLI, and delivery evidence.
---

# Finishing Dev

Precedence: if an active `dev-loop` state file exists, defer to the loop — `phase-implement` owns delivery there. This skill is for standalone work only.

The flow is **gated**. A real bug, a live secret, or a breaking API change stops delivery and reports it; it never ships around a finding.

## Preflight
Abort with the reason if any of these fails.

```bash
git rev-parse --is-inside-work-tree && git status --porcelain
git remote show origin | rg "HEAD branch"     # the base, never assumed
gh auth status
```

| Check | Command | Failing means |
|---|---|---|
| Inside a repository | `git rev-parse --is-inside-work-tree` | nothing to deliver |
| Something to ship | `git status --porcelain` non-empty, or branch ahead of base | already delivered |
| Base branch known | `git remote show origin \| grep 'HEAD branch'` | ask, never guess |
| `gh` usable | `gh auth status` | see the reference |

## Workflow
1. Read the state, then take the diff that matches it.

   | State | Diff to review |
   |---|---|
   | Uncommitted changes | `git diff` and `git diff --cached` |
   | Clean, branch ahead of base | `git diff <base>...HEAD` |
   | Both | all three |

2. Review it. On a large diff delegate to `expert-review`, in parallel passes when it spans domains — correctness, security, API contract. Findings stay advisory until you classify them.
3. Classify before acting. **Blocking**: bug, crash, data loss, live secret, a control this change removes — stops delivery. **Minor**: style, naming, local debt — reported, shipped anyway. Only blocking stops. Delegate secret scanning to `security-ops`.
4. Breaking-change gate, when the change touches an API other clients consume. Look for removed or renamed endpoints, request fields becoming required, response fields or status codes changing, auth header changes, and event schema changes. On a hit, stop and put the options to the user: version it additively, ship a compatibility shim, coordinate the client release, or take a major bump. Never decide alone — `api-design` and `migration-engineering` own the rollout.
5. Discover the project's real commands before running any: `package.json` scripts, `Makefile`/`justfile`, `pyproject.toml`, `.github/workflows/`. Run what CI runs; never invent a command.
6. Branch from an up-to-date base — `git fetch origin && git switch <base> && git pull` — then `git switch -c <type>/<scope>-<summary>`. Always a new branch: never the default branch, never one that already carries a pull request.
7. Stage explicitly with `git add <paths>`, never `git add .`. Confirm with `git diff --cached --name-only`, then commit as `type(scope): summary`.
8. Run the gates found in step 5 — lint, type check, tests, build. Any red stops delivery.
9. If the branch is behind, `git fetch origin && git rebase origin/<base>`, resolve toward the final intent, then re-run step 8. Never push a stale branch; conflict recovery belongs to `git-workflow`.
10. `git push -u origin <branch>`.
11. Evidence. User-visible change: delegate to `screenshot-capture`, then attach the images to the pull request — never commit an image file into the tree. Otherwise paste the decisive command output. Never screenshot code.
12. Draft the title and body — what changed, why, how to verify — show it to the user, and iterate until they approve. Only then `gh pr create --base <base> --assignee @me`. If a pull request already exists for the branch, update it instead of opening a second.
13. Verify and report: base branch, diff scope, CI status, and the URL. Do not merge.

## Reference Routing
- `gh` failures — not authenticated, pull request already exists, protected base, fork without push rights: [gh-failures.md](references/gh-failures.md)

## Stop
- A blocking finding is open — bug, crash, data loss, live secret. Report and stop; never deliver around it.
- The change breaks an API other clients consume and no decision has been made. Put the four options to the user.
- Any project gate is red, or was skipped. A gate you did not run is not a gate that passed.

## Rules
- No commit, push, or pull request without explicit confirmation; silence is not approval.
- Never deliver around a blocking finding. Report it and stop.
- The pull request targets the default branch and carries an assignee.
- The body states what changed, why, and how it was verified; group incidental churn (lint, bumps, formatting) into one line.
- Secrets never reach a commit, a log, or the pull request body.
- Name every check you skipped. A gate you did not run is not a gate that passed.

## Checklist
- [ ] No active `dev-loop` state file; preflight clean.
- [ ] Diff reviewed, findings classified, nothing blocking left open.
- [ ] Breaking-change gate cleared, or the user decided how to handle it.
- [ ] The project's own lint, type check, tests, and build pass.
- [ ] Conventional commit on a new branch that is not behind the base.
- [ ] Pull request open against the default branch, assigned, with description and evidence.
