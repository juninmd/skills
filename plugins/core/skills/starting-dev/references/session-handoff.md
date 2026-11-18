# Session Handoff

## Preflight
```bash
git status --porcelain && git stash list     # uncommitted work is the first thing lost
git log --oneline -5 && git diff --stat      # what actually landed versus what was tried
ls "${TMPDIR:-${TEMP:-/tmp}}/starting-dev" 2>/dev/null   # earlier workspaces and handoffs to supersede
```

Capture this snapshot **before** writing prose. A note about a tree you have not re-read describes what you meant to do, not what is there.

## Workflow
1. Write to a file, not to chat: `<tmpdir>/starting-dev/<session-id>/handoff.md`, inside the same [loop workspace](loop-state.md) as `plan.md` and `loop-state.json` (create it if absent). It outlives the window and is never committed. Write an in-repo note only if the user asks.
2. Record the branch, worktree, commits, and changed paths. Commit or stash only when asked or when needed to preserve the work.
3. Fill the sections below in order; that order is the reading order for someone with no history.
4. Link artifacts that already exist (`plan.md`, `research.md`, the issue, the PR, a commit, an ADR) by path or URL instead of restating them. The note holds only what lives nowhere else.
5. Record commands and `file:line`, not summaries of them. "Fixed the parser" cannot be acted on; `src/parse.ts:88, run pnpm test parse` can.
6. Write dead ends with their evidence. What was tried and failed is the costliest thing to lose and the first thing left out.
7. Finish with one runnable next command and the skills the next session should load. If you cannot name the command, the note is unfinished.
8. Give the user the note's absolute path, since a new session cannot guess the old session id. Then read the note as the successor would; any question you would still have to ask is a hole.

## The Sections

| Section | Contains | Cost of omitting it |
|---|---|---|
| Goal | The outcome that ends this work, in one sentence | Successor optimizes the wrong thing |
| State | Branch, commits, stash, what is verified and by which command; links to existing artifacts | Work is redone or lost |
| Decisions | Each choice **with its reason** | Successor reverses it and rediscovers the same problem |
| Dead ends | What was tried, what happened, why it was dropped | Successor burns the same hours |
| Next | One command, and what a good result looks like | Restart cost falls on the reader |
| Suggested skills | Installed skills for the next step, each with one line on why (`finishing-dev` to deliver, `test-engineering` for the missing regression gate) | Successor rediscovers the routing, or starts the next stage without its procedure |

## Keep or Compress

| Keep verbatim | Compress to a conclusion or a pointer |
|---|---|
| The exact failing command and its error line | Full test output |
| `file:line` for every claim | The story of how you found it |
| The version, flag, or config that changed behavior | The debugging path that surfaced it |
| Decisions and their reasons | Options dropped early |
| Reproduction steps | Tool chatter and retries |
| Anything said only in conversation | Content of a plan, spec, issue, or diff: link it |

```bash
H="${TMPDIR:-${TEMP:-/tmp}}/starting-dev/<session-id>/handoff.md"
git rev-parse --short HEAD >> "$H"
git diff --stat >> "$H"
```

## The Compaction Test
A successor resuming after compaction has the repository but none of the reasoning that existed only in this conversation. For each candidate fact, ask: can a command or an existing artifact reproduce it, or did it live only in the conversation?

| Bin | Example | Handling |
|---|---|---|
| Only in this conversation | why option B beat A when both pass the tests; a constraint the requester stated aloud; a dead end that left no trace in the tree | Write it out in full. It vanishes when context is dropped, and no file read recovers it |
| Re-derivable from the repository or an artifact | current branch, diff, passing tests, TODO markers, the plan, the PR body | Point to the command or path that reproduces it (`git diff --stat`, `pnpm test`, `plan.md`); do not paste it |

Use this when compaction is imminent and the note is written under pressure: the first bin becomes a paragraph, the second a pointer.

## Stop
- Uncommitted changes appear nowhere in the note. Commit, stash, or list them by path; an unrecorded dirty tree is the classic lost-work case.
- A decision has no reason beside it. Recover the reason or mark it explicitly unknown; an unexplained constraint gets reverted.
- The note refers to something visible only in this window. Put it in the note or drop the claim.
- Secrets, tokens, or customer data reached the draft. Strip them; a temp file is readable by the next session and anything it shares with. `security-ops` owns the sweep.

## Rules
- Treat the reader as a stranger, even if it is you next week. Use no pronoun whose referent sits in the scrollback.
- Facts beat narrative. Whoever resumes does not need the story of how it went.
- Supersede, do not append. Keep one current note per workspace; stale advice is worse than none.
- The note is not a status update. It exists to act from, not to reassure.
- It never lands in the repository unless the user asks; `finishing-dev` owns what carries into the pull request body.
- Suggested skills name installed skills only; name a reference file together with its owning skill.
- Reusable lessons do not belong here, because the note dies with the task. Send durable learnings to the [session-learnings procedure](session-learnings.md).
- Budgeting what stays loaded while work is still running is a different job: `agent-engineering`.

## Checklist
- [ ] Note written to the temp workspace (in-repo only on request), and its absolute path given to the user.
- [ ] Worktree, branch, commits, and changed paths named; any commit or stash is intentional.
- [ ] All sections present; every decision has its reason; existing artifacts linked, not restated.
- [ ] Dead ends recorded with the evidence that closed them.
- [ ] Exactly one runnable next command with its success condition, plus suggested skills with reasons.
- [ ] No secrets in the file; note superseded, not appended.
