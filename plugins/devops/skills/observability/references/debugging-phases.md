# Debugging Phases

The single debugging method for this skill: open it for any bug, failing test, or unexplained behavior whose cause is not already proven. Layer-by-layer network triage lives in [diagnostics.md](diagnostics.md); known failure shapes in [diagnostics-real-world-cases.md](diagnostics-real-world-cases.md). Production with users affected goes through [incident-response.md](incident-response.md) first; resume here against the evidence it preserved.

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

The symptom changes once you start poking. Record it first, then strip anything sensitive before it reaches chat, a ticket, or a commit message.

```bash
cmd 2>&1 | tail -40 > /tmp/symptom.log            # raw evidence stays on disk, not in context
git log --oneline -10 && git log --since='2 days ago' --oneline | wc -l
sed -E -e 's/((authorization|cookie|set-cookie): ).*/\1<REDACTED>/I' \
       -e 's/((api[_-]?key|token|secret|password)=)[^&" ]+/\1<REDACTED>/Ig' \
       -e 's/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/<EMAIL>/g' /tmp/symptom.log | rg -n 'error|warn|fail' | head -20
```

- Write down the exact symptom, environment, first occurrence, expected behavior, and the last known good state. A symptom you cannot restate precisely is one you cannot test.
- Redact before quoting: credentials, session cookies, auth headers, signed URLs, and personal data (names, emails, phone numbers, user-linked IPs and ids) become `<REDACTED>`. A pattern pass is a first filter, not proof; read what you quote.
- Quote only the lines that carry the signal. Build loops that read credentials from environment variables so the secret never appears in a command you show.
- If the redacted evidence is not enough to diagnose, say so and ask for access or a sanitized artifact. Never paste a full log into context.

## Phase 1 — Build a loop that can go red

Everything later consumes this signal. With a fast pass/fail check that fails on *this* bug, bisection and hypothesis tests become mechanical; without one, reading code only produces theories. Invest here first.

Pick the cheapest loop that reaches the failing path:

| Situation | Loop |
|---|---|
| A test seam reaches the bug | Failing unit, integration, or e2e test |
| Running service | Scripted `curl` or HTTP client call asserting the bad response |
| CLI or batch job | Fixture input with stdout diffed against a known-good snapshot |
| Browser-only symptom | Playwright script asserting on DOM, console, or network |
| Captured production input | Replay the saved request, payload, or event log through the code path |
| Large system, small suspect | Throwaway harness: one function call, dependencies stubbed |
| Wrong output sometimes | Property or fuzz loop over many generated inputs |
| Worked at A, fails at B | `git bisect run ./check.sh` between the two states |
| Two versions or configs disagree | Differential run, diffing their outputs |
| Only a human can trigger it | Scripted prompt that tells them each step and captures the result |

Then tighten it: cut setup and unrelated initialization until it runs in seconds; assert on the specific symptom rather than "did not crash"; pin time, seed randomness, isolate the filesystem, and stub the network until the verdict repeats.

**Non-deterministic bugs.** Raise the reproduction rate before forming any hypothesis; a cause guessed at 1% repro cannot be confirmed or refuted. Loop the trigger many times, run it alone, in suite order, then shuffled or reversed to expose ordering coupling, parallelise, add load, and narrow timing windows. Attribute what remains to one source: time and timezone, concurrency and async ordering, or shared state (rows, temp files, module singletons, ports). Record the rate before and after the fix from the same command.

**No loop possible.** Say so, list what was tried, and ask for one of: access to the environment that reproduces it, a redacted artifact (HAR, log dump, core dump, timestamped recording), or permission for temporary production instrumentation. Do not move to hypotheses.

**Exit criterion.** Phase 1 is complete only when you can name one command that you have already run, with its redacted invocation and output shown, and that is:
- [ ] **Red-capable**: it drives the real failing path and asserts the user's exact symptom, so it fails now and will pass once fixed.
- [ ] **Repeatable**: the same verdict every run, or a pinned, high reproduction rate for flaky bugs.
- [ ] **Fast**: seconds, not minutes.
- [ ] **Unattended**: runnable by the agent; a human only through a scripted prompt.

Reading code to build a theory before this command exists is the failure this method prevents.

## Phase 2 — Reproduce and minimize

Run the loop and watch it fail. Confirm it fails with the failure the user reported, not a neighboring one; a wrong bug yields a wrong fix. Keep the exact error text, wrong value, or timing for later comparison.

**Minimize.** Remove one input, caller, config key, data row, or step at a time, re-running the loop after each cut, and keep only what the failure needs. Done when every remaining element is load-bearing: removing any one turns the loop green. The minimal case shrinks the hypothesis space and becomes the regression test.

## Phase 3 — Hypothesise

One rule: **list several candidates, test one at a time.**

1. Diff against the last known good state — code, config, data, dependency, infrastructure. The deploy timeline and `git log --since` usually name the window.
2. Write 3–5 candidate causes, ranked by likelihood and cost to falsify. A single candidate anchors on the first plausible idea.
3. Make each falsifiable: "If X is the cause, changing Y makes the bug disappear and changing Z makes it worse." A candidate with no prediction is a guess; sharpen or drop it.
4. Show the ranked list to the user when present, since domain knowledge often re-ranks it instantly; do not block on a reply.
5. Test exactly one candidate per experiment, top of the list first, and write down what each result eliminated.

After three refuted candidates, stop generating more: the system model is wrong. Rebuild it from observed behavior, or escalate with the list of what has been eliminated.

## Phase 4 — Instrument

Every probe answers a prediction from Phase 3. Change one variable at a time.

- Split the failing path at observable boundaries (API → service → store, CI → build → sign); each split should halve the suspect surface. Log what enters and leaves each boundary once, then investigate the boundary where the value first goes wrong.
- Prefer a debugger or REPL; one breakpoint beats ten log lines. Otherwise add targeted logs at the boundaries that separate candidates. Never log everything and grep.
- Tag every temporary log with a unique prefix such as `[DEBUG-a4f2]` so cleanup is one search. Temporary logs obey Phase 0 redaction.
- Slow but correct: take a baseline measurement first (timer, profiler, query plan), then bisect. Optimization itself belongs to `performance-engineering`.

## Phase 5 — Fix and regression test

Fix the cause, not the symptom. One change; no bundled refactor.

A regression test needs a seam that exercises the real bug pattern as it occurs at the call site. If the only available seam is too shallow — one caller when the bug needs two, a unit test that cannot recreate the triggering chain — say so: the architecture is blocking a durable lock-down, and that is a finding.

With a correct seam:
1. Turn the minimized case into a failing test.
2. Watch it fail. If you forced the failure by mutating code or a fixture, diff against a clean copy to prove the mutation landed.
3. Apply the fix and watch the test pass.
4. Re-run the Phase 1 command against the original full scenario, plus one adjacent failure path.

A fix you cannot explain is a coincidence. If the symptom vanished and you do not know why, it will return. Do not call correlation a cause until the loop changes predictably when you change the suspected cause.

## Phase 6 — Cleanup

- [ ] Phase 1 command now passes; the original scenario no longer reproduces.
- [ ] Regression test passes, or the missing seam is documented.
- [ ] `rg -n 'DEBUG-a4f2'` returns nothing; throwaway harnesses deleted.
- [ ] Captured logs and artifacts shared anywhere are redacted.
- [ ] The confirmed cause is stated in the commit or PR message.

Then ask what would have prevented the bug. Architectural changes go to `software-architecture` after the fix lands.

## Stop

- Experiments stop reducing uncertainty, or three candidates are refuted. Rebuild the model or escalate with what has been eliminated.
- Three fixes have failed, or each fix surfaces a new symptom elsewhere. The design is the problem; discuss it before a fourth attempt.
- Production users are affected. Mitigate through [incident-response.md](incident-response.md) first.
- Diagnosis needs a secret or personal data that cannot be redacted. Ask instead of quoting it.

## Red flags

| Thought | Reality |
|---|---|
| "It's obviously X, let me just fix it" | Without a red loop there is no way to tell a fix from a coincidence |
| "Quick patch now, investigate later" | The first patch sets the pattern and hides the cause |
| "It only fails sometimes, so I'll guess" | Raise the repro rate first; a flaky signal confirms nothing |
| "I'll change these three things together" | One variable per experiment, or the result means nothing |
| "I'll add the test after it works" | A test that never failed proves nothing about this bug |
| "The full log is easier to paste" | Raw logs carry secrets and PII; redact and quote the signal |
| "One more fix attempt" after two failures | Return to Phase 1; after three, question the design |
| "It stopped happening" | Unexplained disappearance is not a fix |

Adapted in part from mattpocock/skills (MIT, © 2026 Matt Pocock) and obra/superpowers (MIT, © 2025 Jesse Vincent).
