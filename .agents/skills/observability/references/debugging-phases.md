# Debugging Phases

The one debugging method in this skill. Open it for any bug, failing test, or unexplained behavior whose cause is not yet proven. Network triage by layer is in [diagnostics.md](diagnostics.md); recurring failure shapes are in [diagnostics-real-world-cases.md](diagnostics-real-world-cases.md). If users in production are affected, start with [incident-response.md](incident-response.md) and return here with the evidence it saved.

## Contents
- [Phase 0 — Capture and redact](#phase-0--capture-and-redact)
- [Phase 1 — Build a loop that can go red](#phase-1--build-a-loop-that-can-go-red)
- [Phase 2 — Reproduce and minimize](#phase-2--reproduce-and-minimize)
- [Phase 3 — Hypothesise](#phase-3--hypothesise)
- [Phase 4 — Instrument](#phase-4--instrument)
- [Phase 5 — Fix and regression test](#phase-5--fix-and-regression-test)
- [Phase 6 — Cleanup](#phase-6--cleanup)
- [Stop](#stop)
- [Red flags](#red-flags)

## Phase 0 — Capture and redact

Poking changes the symptom. Record it first, then strip anything sensitive before it reaches chat, a ticket, or a commit message.

```bash
cmd 2>&1 | tail -40 > /tmp/symptom.log            # raw evidence stays on disk, out of context
git log --oneline -10 && git log --since='2 days ago' --oneline | wc -l
sed -E -e 's/((authorization|cookie|set-cookie): ).*/\1<REDACTED>/I' \
       -e 's/((api[_-]?key|token|secret|password)=)[^&" ]+/\1<REDACTED>/Ig' \
       -e 's/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/<EMAIL>/g' /tmp/symptom.log | rg -n 'error|warn|fail' | head -20
```

- Record the exact symptom, environment, first occurrence, expected behavior, and last known good state. A symptom you cannot state precisely cannot be tested.
- Redact before you quote: credentials, session cookies, auth headers, signed URLs, and personal data (names, emails, phone numbers, user-linked IPs and ids) become `<REDACTED>`. A pattern pass is only a first filter; read what you quote.
- Quote only lines that carry signal. Have loops read credentials from environment variables so no secret appears in a displayed command.
- If the redacted evidence cannot support a diagnosis, say so and ask for access or a sanitized artifact. Never paste a whole log into context.

## Phase 1 — Build a loop that can go red

Everything after this consumes the loop's signal. A fast pass/fail check that fails on *this* bug makes bisection and hypothesis testing mechanical; without one, reading code only breeds theories.

Pick the cheapest loop that reaches the failing path:

| Situation | Loop |
|---|---|
| A test seam reaches the bug | Failing unit, integration, or e2e test |
| Running service | Scripted `curl` or HTTP client call that asserts the bad response |
| CLI or batch job | Fixture input, stdout diffed against a known-good snapshot |
| Browser-only symptom | Playwright script asserting on DOM, console, or network |
| Captured production input | Replay the saved request, payload, or event log through the code path |
| Large system, small suspect | Throwaway harness: one function call, dependencies stubbed |
| Output wrong only sometimes | Property or fuzz loop over many generated inputs |
| Worked at A, fails at B | `git bisect run ./check.sh` between the two states |
| Two versions or configs disagree | Differential run comparing their outputs |
| Only a human can trigger it | Scripted prompt that walks them through each step and captures the result |

Then tighten it. Trim setup until it runs in seconds. Assert the specific symptom, not merely "did not crash". Pin time, seed randomness, isolate the filesystem, and stub the network until the verdict repeats.

**Non-deterministic bugs.** Raise the reproduction rate before you form any hypothesis; a cause guessed at 1% repro can be neither confirmed nor refuted. Loop the trigger many times. Run it alone, in suite order, then shuffled or reversed to expose ordering coupling. Add parallelism and load, and narrow timing windows. Pin what remains to one source: time and timezone, concurrency and async ordering, or shared state (rows, temp files, module singletons, ports). Record the rate before and after the fix using the same command.

**No loop possible.** Say so, list what you tried, and ask for one of: access to an environment that reproduces it, a redacted artifact (HAR, log dump, core dump, timestamped recording), or permission to add temporary instrumentation in production. Do not move on to hypotheses.

**Exit criterion.** Phase 1 is done only when you can name one command, already run, with its redacted invocation and output shown, that is:
- [ ] **Red-capable**: it drives the real failing path and asserts the user's exact symptom, so it fails now and passes once fixed.
- [ ] **Repeatable**: same verdict every run, or a pinned, high reproduction rate for flaky bugs.
- [ ] **Fast**: seconds, not minutes.
- [ ] **Unattended**: the agent can run it; a human only via a scripted prompt.

Theorizing from code before this command exists is the failure this method prevents.

## Phase 2 — Reproduce and minimize

Run the loop and watch it fail with the failure the user reported, not a neighboring one; the wrong bug gets the wrong fix. Keep the exact error text, wrong value, or timing.

**Minimize.** Drop one input, caller, config key, data row, or step at a time, rerunning the loop after each cut, and keep only what the failure needs. You are done when every remaining element is load-bearing: removing any one turns the loop green. The minimal case narrows the hypothesis space and becomes the regression test.

## Phase 3 — Hypothesise

One rule: **list several candidates, test one at a time.**

1. Diff against the last known good state: code, config, data, dependency, infrastructure. The deploy timeline and `git log --since` usually point to the window.
2. Write 3 to 5 candidate causes, ranked by likelihood and by how cheaply each can be falsified. A single candidate anchors you on the first plausible idea.
3. Make each one falsifiable: "If X is the cause, changing Y makes the bug vanish and changing Z makes it worse." A candidate that predicts nothing is a guess; sharpen it or drop it.
4. If the user is present, show the ranked list (their domain knowledge may re-rank it); do not wait for a reply.
5. Run exactly one experiment per candidate, best-ranked first, and note what each result ruled out.

After three refuted candidates, stop generating more: your model of the system is wrong. Rebuild it from observed behavior, or escalate with the list of what has been eliminated.

## Phase 4 — Instrument

Each probe must answer a prediction from Phase 3. Change one variable at a time.

- Divide the failing path at observable boundaries (API → service → store, CI → build → sign) so each split halves the suspect surface. Log what enters and leaves each boundary once, then dig into the boundary where the value first goes wrong.
- Prefer a debugger or REPL; one breakpoint beats ten log lines. Otherwise add targeted logs at the boundaries that separate candidates. Never log everything and grep.
- Give every temporary log a unique prefix such as `[DEBUG-a4f2]` so cleanup is a single search. Temporary logs follow the Phase 0 redaction rules.
- For slow-but-correct behavior, measure a baseline first (timer, profiler, query plan), then bisect. Optimizing belongs to `performance-engineering`.

## Phase 5 — Fix and regression test

Fix the cause, not the symptom. Make one change, with no refactor bundled in.

A regression test needs a seam that reproduces the real bug pattern as it occurs at the call site. If the only seam is too shallow (one caller when the bug needs two, a unit test that cannot recreate the triggering chain), say so: the architecture blocks a durable lock-down, and that is a finding.

With a proper seam:
1. Turn the minimized case into a failing test.
2. Watch it fail. If you forced the failure by mutating code or a fixture, diff against a clean copy to prove the mutation took effect.
3. Apply the fix and watch the test pass.
4. Rerun the Phase 1 command on the original scenario, plus one adjacent failure path.

A fix you cannot explain is a coincidence. If the symptom vanished and you do not know why, it will come back. Do not call correlation a cause until the loop changes predictably when you change the suspected cause.

## Phase 6 — Cleanup

- [ ] The Phase 1 command now passes; the original scenario no longer reproduces.
- [ ] The regression test passes, or the missing seam is documented.
- [ ] `rg -n 'DEBUG-a4f2'` finds nothing; throwaway harnesses are deleted.
- [ ] Any captured logs and artifacts shared elsewhere are redacted.
- [ ] The confirmed cause appears in the commit or PR message.

Then ask what would have prevented the bug. Architectural changes go to `software-architecture` after the fix lands.

## Stop

- Experiments no longer reduce uncertainty, or three candidates are refuted. Rebuild the model or escalate with what has been eliminated.
- Three fixes have failed, or each fix exposes a new symptom elsewhere. The design is the problem; discuss it before a fourth attempt.
- Production users are affected. Mitigate through [incident-response.md](incident-response.md) first.
- Diagnosis needs a secret or personal data that cannot be redacted. Ask instead of quoting it.

## Red flags

| Thought | Reality |
|---|---|
| "It's obviously X, let me just fix it" | With no red loop, a fix is indistinguishable from a coincidence |
| "Quick patch now, investigate later" | The first patch sets the pattern and buries the cause |
| "It only fails sometimes, so I'll guess" | Raise the repro rate first; a flaky signal confirms nothing |
| "I'll change these three things together" | One variable per experiment, or the result means nothing |
| "I'll add the test after it works" | A test that never failed proves nothing about this bug |
| "The full log is easier to paste" | Raw logs carry secrets and PII; redact and quote the signal |
| "One more fix attempt" after two failures | Go back to Phase 1; after three, question the design |
| "It stopped happening" | A symptom that vanishes unexplained is not a fix |
