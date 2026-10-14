# Branching Strategy Tradeoffs

Open this when a team is choosing, or arguing about, a branching model —
not when executing an already-decided workflow.

## The Two Poles

**Git-flow** (Vincent Driessen's "A successful Git branching model") defines
long-lived `develop` and `main` branches, dedicated `release/*` and
`hotfix/*` branches, and feature branches that merge back through `develop`.
It was written for software shipped in discrete, versioned releases with a
real gap between them — think a desktop application or a library with a
support matrix of previous majors.

**Trunk-based development** (documented in Google's engineering practices,
google.github.io, and correlated with delivery performance in Forsgren,
Humble & Kim's *Accelerate* and in Humble & Farley's *Continuous Delivery*)
keeps one long-lived branch, short-lived feature branches merging back
within a day or two, and release branches cut only at ship time, if at all.
It assumes continuous deployment or something close to it.

## Choosing Between Them

| Signal | Favors git-flow | Favors trunk-based |
|---|---|---|
| Release cadence | Scheduled, infrequent (weeks to months) | Continuous or daily |
| Support matrix | Multiple versions in the field simultaneously | Only the latest deployed version matters |
| Team size and review latency | Larger team, reviews take longer than a feature branch's life | Small-to-mid team, fast review turnaround |
| Feature branch lifetime | Days to weeks tolerated | Hours to a day or two; longer-lived work hides behind a feature flag instead |
| CI investment | Moderate; gates run per PR | Heavy; trunk must stay green at every commit, since it is always shippable |
| Rollback mechanism | Revert to a previous release branch/tag | Revert the trunk commit, or flip the feature flag |

A codebase can also run a hybrid: trunk-based day-to-day development with a
release branch cut and stabilized only for artifacts that genuinely need a
support window (a mobile app pending store review, a library with LTS
majors). Do not adopt full git-flow's branch topology for a service that
deploys on every merge — the `develop`/`main` split adds a sync point with
no corresponding release event to justify it.

## What This Skill Defaults To

Absent a stated constraint, prefer trunk-based development with short-lived
feature branches and feature flags for anything not ready to ship: it matches
the stack-selection default of "flag decoupled from deploy" and keeps the
[pre-tag gate](release-management.md) meaningful, since trunk is close to always
releasable. Fall back to a release-branch model only when a real support
matrix or a slow release cadence make it the honest description of how the
software actually ships — see the [Excuses](../SKILL.md#excuses) table for
the difference between a real constraint and a habit.

## Worktrees as a Branching-Model-Neutral Tool

Worktrees do not replace a branching model; they let one clone hold several
branches checked out simultaneously, which is useful under either model for
running a hotfix build alongside in-progress feature work without stashing.
Register ownership and clean up per the [rebase and recovery](rebase-and-recovery.md#worktree-cleanup)
worktree section regardless of which branching strategy is in effect.
