---
name: session-learnings
description: |
  Capture durable learnings across sessions in a shared .learnings/ directory and compact them into `AGENTS.md`. Use for recalling context at session start, recording an error and its fix, promoting recurring lessons into project rules, or purging them.
---

# Session Learnings

## Preflight
```bash
ls .learnings/ 2>/dev/null && cat .learnings/README.md 2>/dev/null
git check-ignore -q .learnings/ && echo ignored || echo committed
ls .learnings/*.md 2>/dev/null | wc -l          # against the 20-entry cap
```

Committed or ignored changes what may be written. Decide it once, record it in the README, and never guess it again.

## Workflow
1. Bootstrap once, before writing anything: decide committed or ignored, and record it in `.learnings/README.md`.
2. At session start, recall by tag — never by reading every file.
3. Surface at most three relevant entries, compactly. Say nothing if none match.
4. Watch for capture signals. Offer; never capture unprompted.
5. After approval, write one file per entry, named by the convention below.
6. Past twenty active root entries, compact.
7. Promote a repeated pattern into `AGENTS.md`; purge only from the promoted folder, on explicit confirmation.

## Committed or Ignored — Decide First

| | Committed | Gitignored |
|---|---|---|
| Visible to | the team, reviewed in pull requests | this machine only |
| May contain | no secrets, no client names, no internal URLs | machine-specific paths and notes |
| Good for | conventions, gotchas, failed approaches | local environment quirks |

Record the choice in the README. Getting this wrong in the committed direction leaks; in the ignored direction it silently helps nobody but you.

## Recall Without Reading Everything

```bash
ls .learnings/*.md | rg -i 'auth|migration|deploy'    # tags live in the filename
# read only the matches; skip .learnings/promoted/ and README.md
```

Tags in the filename are what make recall cheap. Reading the directory to find out what is in it defeats the entire purpose.

## Entry Naming and Shape

```
.learnings/
  README.md                                  # the committed-or-ignored decision
  error-20260210-001-auth-jwt.md
  learning-20260214-002-pnpm-workspace.md
  missing-20260218-003-deploy-rollback.md
  promoted/                                  # moved here once in AGENTS.md
```

| Type | Records |
|---|---|
| `learning` | something true about this project that was not obvious |
| `error` | a failure and the fix that actually worked |
| `missing` | context that should have existed and did not |

Fifteen lines per entry, hard cap. An entry longer than that is a document, and belongs in `documentation`.

## Capture Signals
Offer to capture — with a one-line footer, never an interruption — when:

- the developer corrects you on something project-specific,
- an approach failed for a reason that was not obvious,
- an error took real debugging to resolve,
- you discovered a constraint that no file states.

**Not** for trivial questions, or tasks where nothing was discovered. A learnings directory full of noise is one nobody reads.

## Compaction and Promotion
Past twenty active root entries, group by theme and classify each: **promote**, **archive**, or **keep**.

Promote when the pattern repeats across two entries, or when it is critical and missing from `AGENTS.md`. Hand the rule to `agents-md` so it respects that file's budget and structure — then move the source entries into `promoted/`.

## Reference Routing
- Entry template, field rules, and the tag vocabulary: [entry-format.md](references/entry-format.md)

## Stop
- The committed-or-ignored decision is not recorded. Stop; it determines whether secrets or client names may appear.
- The developer has not approved this entry. Never create, move, or delete one unprompted.
- A purge is about to run outside `promoted/`, or without explicit confirmation. It is irreversible.

## Rules
- Never create, move, or delete an entry without developer approval.
- Hard caps: 15 lines per entry, 20 active root entries. Past either, this skill costs more context than it saves.
- Promote to `AGENTS.md`, which every agent reads — never to a single-tool file like `CLAUDE.md`.
- One file per entry. An append-only log produces a merge conflict on every parallel session.
- An entry states the fact and how to apply it. A session diary is not a learning.
- Purging is irreversible: confirm explicitly, and only inside `promoted/`.
- Managing the window inside one session belongs to `context-engineering`; this skill is what survives the session boundary.

## Checklist
- [ ] Committed-or-ignored decision made and recorded in the README.
- [ ] Recall filtered by tag; at most three entries surfaced; `promoted/` untouched.
- [ ] Capture offered on a real signal, never unprompted, never for trivia.
- [ ] Entries approved, tagged in the filename, within both caps.
- [ ] Promoted rules written through `agents-md`, and their entries moved to `promoted/`.
- [ ] Purge confirmed explicitly and limited to `promoted/`.
