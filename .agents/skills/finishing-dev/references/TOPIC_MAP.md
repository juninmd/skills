# finishing-dev reference map

Open only the procedure matching the current subtask. These are files, not standalone skills.

| Reference | When to open |
|---|---|
| [git-best-practices.md](git-best-practices.md) | Check staging, hook changes, remote SHA, and safe publication boundaries; generated files/lockfiles in the diff; squash-vs-merge strategy; splitting a huge diff into reviewable commits |
| [pr-evidence.md](pr-evidence.md) | Select applicable UI/UX screenshots and GIFs/videos across web, desktop, mobile, TUI/CLI, upload them to permanent reviewer-accessible assets, and capture terminal text, contract payloads, and migration/rollback notes |
| [pr-title-and-branch-standard.md](pr-title-and-branch-standard.md) | Name a branch and PR title by convention, and check a drafted description against the required Summary/Evidence/How-to-test/Verification/Test-plan sections |
| [homologate.md](homologate.md) | Prove a change on its real running target (service, cron, bot, device): same version deployed, real trigger, evidence read at the consumer, verdict Proven / Failed / Unproven |
| [homologate-evidence-by-target.md](homologate-evidence-by-target.md) | Per-target recipe for homologation: version check, real trigger, and where the proof lives for HTTP services, scheduled jobs, chat bots, UIs, game servers, and data pipelines |
| [phase-done.md](phase-done.md) | Verify remote CI and report PR readiness without merging or deploying; distinguish a flaky rerun from a genuinely red check |
| [phase-finalize.md](phase-finalize.md) | Sustained loop only: record `evidence.md` (reviews, adjudication, fixes, checks, criteria) in the temp workspace before readiness |
| [review-protocol.md](review-protocol.md) | Delegate two blind independent review lenses, re-review corrected candidates, and scope review when a PR depends on another unmerged PR |
| [return-to-default.md](return-to-default.md) | Every PR handoff, with or without CI monitoring: safely activate and verify the actual default branch, preserve worktrees, and report blockers |
