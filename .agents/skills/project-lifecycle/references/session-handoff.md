
# Session Handoff

## Preflight
```bash
git status --porcelain && git stash list     # uncommitted work is the first thing lost
git log --oneline -5 && git diff --stat      # what actually landed versus what was tried
ls docs/handoff/ 2>/dev/null                 # is there an earlier note to supersede?
```

Take the snapshot **before** writing prose. A handoff note describing a tree you have not re-read is a note describing what you meant to do.

## Workflow
1. Write to a file, not to chat. `docs/handoff/<branch>.md` survives a closed window; a message does not.
2. Record the branch, worktree, commits, and changed paths. Commit or stash only when requested or needed to preserve the handoff.
3. Fill the five sections below in order. The order is the reading order for someone with no history.
4. Record commands and `file:line`, never summaries of them. "Fixed the parser" is unactionable; `src/parse.ts:88, run pnpm test parse` is not.
5. Write the dead ends with their evidence. What was tried and failed is the most expensive thing to lose and the first thing omitted.
6. End on one runnable next command. If you cannot name it, the note is not finished.
7. Test the note by reading it as the successor: anything you would still have to ask is a hole.

## The Five Sections

| Section | Contains | Failure if omitted |
|---|---|---|
| Goal | The outcome that ends this work, in one sentence | Successor optimizes the wrong thing |
| State | Branch, commits, stash, what is verified and by which command | Work redone or lost |
| Decisions | Each choice **with its reason** | Successor reverses it and repeats the discovery |
| Dead ends | What was tried, what happened, why it was abandoned | Successor spends the same hours |
| Next | One command, and what a good result looks like | Restart cost lands on the reader |

## Keep or Compress

| Keep verbatim | Compress to a conclusion |
|---|---|
| Exact failing command and its error line | Full test output |
| `file:line` for every claim | Narration of how you found it |
| Version, flag, or config that changed behavior | The debugging path that surfaced it |
| Decisions and their reasons | Options considered and dropped early |
| Reproduction steps | Tool chatter and retries |

```bash
git rev-parse --short HEAD >> docs/handoff/$(git branch --show-current).md
git diff --stat >> docs/handoff/$(git branch --show-current).md
```

## Stop
- Uncommitted changes are not described anywhere in the note. Commit, stash, or list them by path — a dirty tree nobody wrote down is the classic lost-work case.
- A decision has no reason next to it. Recover the reason or mark it explicitly unknown; an unexplained constraint gets reverted.
- The note points at something only visible in this window. Move it into the repo or drop the claim.
- Secrets, tokens, or customer data made it into the draft. Strip them; the note is committed like any other file — `security-ops` owns the sweep.

## Rules
- The successor is a stranger, including when the successor is you next week. Write no pronoun whose referent lives in the scrollback.
- Facts over narrative. Nobody resuming work needs the story of how it went.
- Supersede, do not append. One current note per branch; stale advice is worse than none.
- The note is not a status update. It exists to be acted from, not read for reassurance.
- Delete the note when the branch merges. `finishing-dev` owns what carries over into the pull request body.
- Reusable lessons do not belong here — a note dies with the branch. Durable learnings go to `session-learnings`.
- Budgeting what stays loaded while the work is still running is a different job: `context-engineering`.

## Checklist
- [ ] Worktree, branch, commits, and changed paths are named; any commit or stash is intentional.
- [ ] All five sections present; every decision carries its reason.
- [ ] Dead ends recorded with the evidence that closed them.
- [ ] Claims anchored to commands and `file:line`, not summaries.
- [ ] Exactly one runnable next command, with its success condition.
- [ ] No secrets in the file; note superseded, not appended.
