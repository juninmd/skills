# Steering Long Runs

Open this when an agent will work for a long stretch with little supervision: a goal run, a loop, a large migration, or an overnight task. Source: [getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/).

## Preflight
```bash
ls CLAUDE.md AGENTS.md .claude/settings.json 2>/dev/null   # where stop/continue rules and permissions live
ls TASKS.md 2>/dev/null                                     # a run already tracking its units
```

## Hand Over the Whole Task
Give the complete task in one message with an explicit finish line, not a trickle of partial requests:

```text
Migrate the payment endpoints from the old client to the new one.
Done means: every endpoint uses the new client, the old client is deleted, and the test suite passes.
Stop and ask me only if a test fails for a reason you can't explain.
```

Follow-ups can be typed while the run is going; that is cheaper than stopping and restarting a long task.

## Stop/Continue Rules
Write these once into the instruction file the run loads, not into every prompt:

```text
When a step doesn't need my input, keep going. Put status notes in the same message as your next action.
Stop and ask only when you can't continue without me, or before anything destructive:
deleting data, force-pushing, or changing anything outside this repository.
```

Keep permission prompts on for destructive commands. The rule tells the model when to ask; the permission prompt is what enforces it.

## Keep State in a File

| File | Holds | Why |
|---|---|---|
| `TASKS.md` | checklist of units, updated as each lands | survives compaction; progress visible at a glance |
| `.workflow/<slug>/state.md` | goal, decisions and reasons, ruled-out paths, next step | reloads reasoning a compaction would lose |

## End-of-Run Report
Ask for a fixed shape so the reader finds the blocking items first:

```text
End every run with three headings: Blocked on me, Changed, Found.
```

Read "Blocked on me" before anything else. Then request an independent review pass: "Review the diff on this branch against main. List only problems you'd block the merge for: file and line, why it's wrong, and how to show it fails."

## Prompt Hygiene
- Remove "think hard" and "think carefully" from prompts and saved instructions; the model already scales its reasoning to the task.
- Ask for an explanation ("explain why you chose this approach in three sentences"), not a transcript of internal reasoning.
- For research, require "mark anything you couldn't confirm, and say where you looked."
- For design, list what to avoid instead of naming a vague style.

## When a Request Is Flagged
Safety classifiers can reroute a flagged message to another model. In Claude Code, switch back with `/model`, edit and resend the message (Esc twice), set auto-switch behavior in `/config`, and report false positives with `/feedback`. Rephrasing to ask for explanations instead of reproduced internal reasoning avoids a common false trigger.

## Speed
Fast mode (`/fast`) returns replies sooner at higher cost. Use it for back-and-forth sessions where each reply is read before the next message, not for unattended runs.

## Stop
- No finish line is stated. Write the "done means" sentence before launching.
- The next step is destructive or leaves the repository. Stop and ask, whatever the continue rule says.

## Checklist
- [ ] Task handed over whole, with "done means" and the one condition that should stop the run.
- [ ] Stop/continue rules live in the instruction file; destructive permission prompts still on.
- [ ] Task list kept in a file and current.
- [ ] Final report leads with "Blocked on me"; an independent block-only review ran before human review.
