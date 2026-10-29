# Session Handoff

## Preflight
```bash
git status --porcelain && git stash list     # uncommitted work is the first thing lost
git log --oneline -5 && git diff --stat      # what actually landed versus what was tried
ls "${TMPDIR:-${TEMP:-/tmp}}/starting-dev" 2>/dev/null   # earlier workspaces and handoffs to supersede
```

Take the snapshot **before** writing prose. A handoff note describing a tree you have not re-read is a note describing what you meant to do.

## Workflow
1. Write to a file, not to chat: `<tmpdir>/starting-dev/<session-id>/handoff.md`, the same [loop workspace](loop-state.md) that holds `plan.md` and `loop-state.json` (create it if none exists). It survives a closed window and is never committed. Write an in-repo note only when the user asks for one.
2. Record the branch, worktree, commits, and changed paths. Commit or stash only when requested or needed to preserve the work.
3. Fill the sections below in order. The order is the reading order for someone with no history.
4. Point at artifacts that already exist — `plan.md`, `research.md`, the issue, the PR, a commit, an ADR — by path or URL instead of restating them. The note carries only what lives nowhere else.
5. Record commands and `file:line`, never summaries of them. "Fixed the parser" is unactionable; `src/parse.ts:88, run pnpm test parse` is not.
6. Write the dead ends with their evidence. What was tried and failed is the most expensive thing to lose and the first thing omitted.
7. End on one runnable next command and the skills the next session should load. If you cannot name the command, the note is not finished.
8. Give the user the note's absolute path: a new session cannot guess the old session id. Test the note by reading it as the successor; anything you would still have to ask is a hole.

## The Sections

| Section | Contains | Failure if omitted |
|---|---|---|
| Goal | The outcome that ends this work, in one sentence | Successor optimizes the wrong thing |
| State | Branch, commits, stash, what is verified and by which command; links to existing artifacts | Work redone or lost |
| Decisions | Each choice **with its reason** | Successor reverses it and repeats the discovery |
| Dead ends | What was tried, what happened, why it was abandoned | Successor spends the same hours |
| Next | One command, and what a good result looks like | Restart cost lands on the reader |
| Suggested skills | Installed skills the next session should load for the next step, each with one line on why (`finishing-dev` to deliver, `test-engineering` for the missing regression gate) | Successor rediscovers the routing, or works the next stage without its procedure |

## Keep or Compress

| Keep verbatim | Compress to a conclusion or a pointer |
|---|---|
| Exact failing command and its error line | Full test output |
| `file:line` for every claim | Narration of how you found it |
| Version, flag, or config that changed behavior | The debugging path that surfaced it |
| Decisions and their reasons | Options considered and dropped early |
| Reproduction steps | Tool chatter and retries |
| Anything said only in conversation | Content of a plan, spec, issue, or diff — link it |

```bash
H="${TMPDIR:-${TEMP:-/tmp}}/starting-dev/<session-id>/handoff.md"
git rev-parse --short HEAD >> "$H"
git diff --stat >> "$H"
```

## The Compaction Test
A successor resuming after a compaction has the repository but none of the reasoning that only ever existed in this conversation. For each fact the note could include, ask one question: does a command or an existing artifact reproduce it, or did it only ever exist in the conversation?

| Bin | Example | Handling |
|---|---|---|
| Only in this conversation | why option B was chosen over A when both pass the tests; a constraint the requester stated verbally; a dead end that left no trace in the tree | Restate explicitly — it is gone the moment context is dropped, and no file read recovers it |
| Re-derivable from the repository or an artifact | current branch, diff, passing tests, TODO markers, the plan, the PR body | Point at the command or path that reproduces it (`git diff --stat`, `pnpm test`, `plan.md`); do not paste it |

Apply it when compaction is imminent and the note must be written under pressure — the former bin is a paragraph, the latter is a pointer.

## Stop
- Uncommitted changes are not described anywhere in the note. Commit, stash, or list them by path — a dirty tree nobody wrote down is the classic lost-work case.
- A decision has no reason next to it. Recover the reason or mark it explicitly unknown; an unexplained constraint gets reverted.
- The note points at something only visible in this window. Write it into the note or drop the claim.
- Secrets, tokens, or customer data made it into the draft. Strip them; a temp file is still readable by the next session and anything it shares with — `security-ops` owns the sweep.

## Rules
- The successor is a stranger, including when the successor is you next week. Write no pronoun whose referent lives in the scrollback.
- Facts over narrative. Nobody resuming work needs the story of how it went.
- Supersede, do not append. One current note per workspace; stale advice is worse than none.
- The note is not a status update. It exists to be acted from, not read for reassurance.
- The note never lands in the repository unless the user asks; `finishing-dev` owns what carries over into the pull request body.
- Suggested skills name installed skills only; a reference file is named with its owning skill.
- Reusable lessons do not belong here — a note dies with the task. Durable learnings go to [session-learnings procedure](session-learnings.md).
- Budgeting what stays loaded while the work is still running is a different job: `agent-engineering`.

## Checklist
- [ ] Note written to the temp workspace (or in-repo only on request), and its absolute path given to the user.
- [ ] Worktree, branch, commits, and changed paths are named; any commit or stash is intentional.
- [ ] All sections present; every decision carries its reason; existing artifacts linked, not restated.
- [ ] Dead ends recorded with the evidence that closed them.
- [ ] Exactly one runnable next command with its success condition, plus suggested skills with reasons.
- [ ] No secrets in the file; note superseded, not appended.

Adapted in part from mattpocock/skills (MIT, © 2026 Matt Pocock).
