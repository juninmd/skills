# Git & Workflow Skills

Skills for Git workflows, branch management, and development lifecycle.

## `git-cleanup`

**Invoke:** `/git-cleanup`

Safe cleanup of stale Git branches and worktrees.

**What it does:**
- Lists local branches with no remote counterpart
- Identifies merged branches safe to delete
- Prunes stale remote-tracking references
- Cleans up orphaned worktree directories

**Safety:** never deletes branches with uncommitted work or unmerged changes. Prompts for confirmation before any deletion.

---

## `executing-plans`

**Invoke:** `/executing-plans`

Execute written implementation plans or temporary specs task-by-task.

**Covers:** loading and reviewing a plan, one-active-task execution, test-first steps when planned, focused validations, plan drift handling, final broad checks, and deletion of completed temporary specs in `temp/specs/`.

---

## `finishing-a-development-branch`

**Invoke:** `/finishing-a-development-branch`

Complete the development lifecycle for a feature branch.

**Steps:**
1. Run tests and verify coverage gate (>80%)
2. Run linter and type checker
3. Rebase onto latest main/develop
4. Squash or organize commits (Conventional Commits format)
5. Push and create PR with structured description
6. Request review from appropriate reviewers
7. After merge: delete local and remote branch

---

## `using-git-worktrees`

**Invoke:** `/using-git-worktrees`

Isolated Git worktrees for parallel feature work.

**Use case:** work on two features simultaneously without stashing or switching branches.

**Covers:** `git worktree add`, worktree listing, removing worktrees, sharing `.git/hooks`, IDE configuration for multiple worktrees, Turborepo cache considerations.

---

## `fix-gitleaks`

**Invoke:** `/fix-gitleaks`

Fix gitleaks CI failures and triage secrets.

**Process:**
1. Identify the detected secret type and file
2. Determine if it's a real secret or a false positive
3. For real secrets: rotate immediately, then remove from history
4. For false positives: add `.gitleaks.toml` allowlist entry
5. Verify CI passes after fix

**History rewriting:** uses `git-filter-repo` (preferred over `BFG`) for removing committed secrets from history.

---

## `github-triage`

**Invoke:** `/github-triage`

Issue triage state machine with labels.

**States:**
```
needs-triage → ready-for-agent → in-progress → ready-for-human → done
                                                      ↓
                                                   wontfix
```

**Label taxonomy:** severity (critical/high/medium/low), type (bug/feature/docs/question), status (needs-triage/ready-for-agent/blocked/wontfix).

**Covers:** automated triage rules, label application, issue routing to agents vs. humans, stale issue detection and closure.
