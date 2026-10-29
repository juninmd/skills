# Skill Evals Beyond Routing

## Contents
- What lexical evals cannot show
- Behavioral trial: with and without the skill
- Reading the trial
- Held-out trigger eval
- Stop
- Checklist

## What lexical evals cannot show
A lexical routing eval (`run-evals.mjs` where the repository ships it) scores description vocabulary against saved prompts. It is a cheap regression signal, but it says nothing about two questions: does a real model **select** the skill, and does the body **change what the model does** once loaded. The trial answers the second; the held-out trigger eval answers the first. Run them on a new skill, on a body rewrite, and before claiming one version beats another.

## Behavioral trial: with and without the skill
1. Pick three to five realistic tasks the skill claims to improve, including the one whose failing baseline justified the skill. Before any run, write two to four checkable assertions per task: a file exists, a command exits 0, the output names the hazard, a forbidden action did not happen.
2. Fix the baseline. A new skill is compared against no skill; a revised skill against a snapshot of the previous version, taken before editing.
3. Launch both arms in the same turn as independent subagents — same prompt, same model, separate worktrees or output directories, the skill path the only difference. Keep each arm's outputs, transcript, token count, and wall time.
4. Grade assertions with a script wherever they can be checked mechanically. For judgment, give a fresh comparator agent both outputs labeled A and B in random order plus the rubric; it picks a winner and quotes the evidence, without knowing which arm used the skill.
5. Read the transcripts, not only the outputs: did the skill arm open the body and take the step the rule names? If every run independently wrote the same helper, bundle it as a script.
6. Change the body, then rerun every task — baseline included — into a new iteration directory. Two or more runs per arm per task before calling a difference real; one run is an anecdote.

```bash
W=$(mktemp -d)                                         # outside the repository
cp -r path/to/skill "$W/skill-snapshot"                # baseline for a revision
mkdir -p "$W"/iteration-1/task-{1,2,3}/{with_skill,baseline}
```

## Reading the trial

| Result | Meaning | Action |
|---|---|---|
| Skill arm wins and cites the rule's reasoning | the rule carries its weight | keep; add the task to the trial set |
| Tie | the model already knew it | cut the rule; it costs tokens for nothing |
| Skill arm wins for an unrelated reason | the rule is unproven | keep the win, re-test the rule in isolation |
| Baseline wins | the skill misleads or is too restrictive | fix or delete the rule before shipping |
| Skill arm never opened the body | a selection or compliance problem, not a content one | run the trigger eval below, or [skill-compliance.md](skill-compliance.md) |

## Held-out trigger eval
1. Write about twenty queries: eight to ten that should select the skill (casual and formal, no skill name, uncommon cases, and cases where a sibling competes but this skill should win) and eight to ten that should not. Make the negatives **near misses** — shared keywords, a sibling's job — and name the owner that should win. An obviously unrelated negative tests nothing.
2. Keep queries substantive. A one-step ask the model can do unaided ("read this file") selects no skill however good the description is.
3. Split before any tuning: about 60% train, 40% test, stratified by expected outcome. Do not read test failures while editing.
4. Run each query at least three times, each in a fresh session of a real client with the full catalog installed. A query triggers when the transcript shows the skill loaded (a skill tool call or a read of its `SKILL.md`). Record the rate, not a single pass.
5. Edit the description from train failures only, and choose the final version by test score; report both. A train gain with a flat test score means the description learned the train wording, not the intent.
6. Fold fixed cases from the train set into the repository's lexical eval file as regression signals; keep the test set out of it so it stays held out.

```json
[
  { "query": "my skill loads for every prompt that mentions docs", "should_trigger": true },
  { "query": "write the AGENTS.md for this repo", "should_trigger": false, "owner": "starting-dev" }
]
```

```bash
jq '[group_by(.should_trigger)[] | to_entries[] | .value + {split: (if .key % 5 < 3 then "train" else "test" end)}]' queries.json > split.json
# Claude Code, one run of one query; repeat per run and per client you support
claude -p "write the AGENTS.md for this repo" --output-format stream-json --verbose \
  | jq -r 'select(.type == "assistant") | .message.content[]? | select(.type == "tool_use") | .name + " " + (.input.skill // .input.file_path // "")' \
  | rg -c "skill-authoring"
```

Set the pass bar before running — for example, positives selected in at least two of three runs, negatives in at most one — and hold it; moving the bar after seeing results erases the signal.

## Stop
- The trial has one run per arm, or the grader knew which arm had the skill. The result does not support a claim.
- The description was edited in response to test-set failures. The test set has leaked into training; write fresh test queries before claiming a score.

## Checklist
- [ ] Assertions written before the first run; baseline fixed (no skill, or a snapshot of the old version).
- [ ] Both arms run in parallel, same model and prompt, at least two runs each; blind comparison for judgment calls.
- [ ] About twenty queries with near-miss negatives that name their owner; 60/40 split made before tuning.
- [ ] Every query run at least three times in a fresh session; rates reported for train and test separately.
- [ ] Lexical evals updated from train cases only; results labeled as model behavior in the client tested, not a guarantee elsewhere.

Adapted in part from anthropics/skills/skills/skill-creator (Apache-2.0, Anthropic).
