# Homologate: acceptance on the real target

Acceptance on the real target: the change runs where users or consumers are, through the real entry point, and the proof is observed at the destination. Green tests and a successful deploy are inputs, not the answer.

Run this before claiming a change is delivered when it ships to a running target. Unit and integration tests stay with `test-engineering`; an ongoing log-driven fix loop is the `log-watch-fix` reference of `observability`.

## Preflight
```bash
git rev-parse --short HEAD && git status --short   # the candidate under proof
gh run list --limit 3 2>/dev/null                  # was it built and published?
```
Then read the target's own version marker (image tag, build id, `/version`, file hash) so step 2 compares like with like. Pick the target recipe in [homologate-evidence-by-target.md](homologate-evidence-by-target.md).

## Workflow
1. **Claim and observable.** One sentence: "X is true on target T", plus the concrete thing that proves it at the destination (a row, a received message, a rendered screen, a log line, a status code). No observable, no homologation.
2. **Same candidate.** Show that the version running on T equals the candidate. A stale image, cached build, or old pod proves the previous version, so mismatch stops here.
3. **Real trigger, real entry point.** Force the actual flow (scheduler, webhook, UI action, user input), not a mock or a direct function call. Waiting for a schedule is not a trigger; invoke it.
4. **Observe at the consumer.** Read the proof where it lands: the message in the channel, the record in the store, the page in the browser. A producer log that says "sent" or "ok" is a claim about intent.
5. **One failure path and one rerun.** Exercise an empty input, a down dependency, or a malformed payload, then run the flow twice to confirm idempotency. A flow proven only on its happy path is half-proven.
6. **Classify and report.** Proven, Failed, or Unproven, with the evidence line for each. On Failed, hand the signature to the watch-and-fix loop (`observability`, `log-watch-fix` reference); do not patch and re-claim in the same breath.

## Decision Table

| Situation | Action |
|---|---|
| Running version differs from candidate | Stop; redeploy through the pipeline, then restart at step 2 |
| Trigger would post publicly, spend money, or write prod data | Ask first; prefer a private channel, dry-run, sandbox, or generate-without-publish |
| Live condition unavailable (no match today, no traffic) | Replay a recorded real input; mark the live path Unproven |
| Proof exists only in producer logs | Unproven until the consumer side is read |
| Environment limit (quota, VRAM, network) blocks the run | Unproven with the named limit, not Failed |
| Flaky: passes on one run, fails on another | Failed; report the rate, never the best run |

## Gotchas
- Health endpoints and `Running` pods prove the process started, not that the feature works.
- Time-dependent data (matches, schedules, market hours) hides defects that only the live event exposes; say which paths were never exercised live.
- Timezone and locale: compare timestamps in one zone, and check accents and encoding in what the consumer actually displays.
- Evidence is quoted from this run. Mask tokens, chat ids, and personal data before pasting; a screenshot of a channel needs the same care.
- Finding a bug in front of the user's live demo audience is the costliest option; homologate before they do.

## Stop
- The target is production or shared and the authorization to trigger a side effect is missing.
- The candidate on the target cannot be identified.
- Three failed attempts at the same step: report hypotheses and evidence.

## Rules
- Report only what this run observed, with the command and the real output line.
- A claim without a destination-side observable is Unproven, whatever the logs say.
- Write actions on shared targets (redeploy, job creation, restarts) follow existing authorization and the repo pipeline; no silent hotfix on the target.
- Keep a short evidence table, never raw logs.

## Checklist
- [ ] Claim and destination-side observable written before running anything.
- [ ] Running version proven equal to the candidate.
- [ ] Flow triggered through its real entry point.
- [ ] Proof read at the consumer, quoted from this run.
- [ ] One failure path and one rerun exercised, or listed as not run.
- [ ] Verdict is Proven, Failed, or Unproven, with the reason for each non-proven path.
