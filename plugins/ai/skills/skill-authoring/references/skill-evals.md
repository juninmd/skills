# Skill Evals Beyond Routing

## Contents
- What lexical evals cannot show
- Behavioral trial: with and without the skill
- Reading the trial
- Held-out trigger eval
- Stop
- Checklist

## What lexical evals cannot show
A lexical routing eval (`run-evals.mjs`, where the repository ships it) scores description vocabulary against saved prompts. It is a cheap regression signal, but it cannot tell you two things: whether a real model **selects** the skill, and whether the body **changes what the model does** once loaded. The behavioral trial covers the second; the held-out trigger eval covers the first. Run both for a new skill, after a body rewrite, and before claiming one version beats another.

## Behavioral trial: with and without the skill
1. Choose three to five realistic tasks the skill says it improves, including the one whose failing baseline justified writing it. Before any run, write two to four checkable assertions per task: a file exists, a command exits 0, the output names the hazard, a forbidden action did not happen.
2. Fix the baseline. A new skill is measured against no skill; a revision against a snapshot of the prior version, taken before you edit.
3. Start both arms in the same turn as independent subagents: same prompt, same model, separate worktrees or output directories, the skill path as the only difference. Keep each arm's outputs, transcript, token count, and wall time.
4. Grade by script wherever the assertion is mechanical. For judgment calls, give a fresh comparator agent both outputs as A and B in random order with the rubric; it names a winner and quotes evidence, blind to which arm had the skill.
5. Read transcripts, not just outputs. Did the skill arm open the body and take the step the rule names? If every run wrote the same helper on its own, bundle it as a script.
6. Edit the body, then rerun every task, baseline included, into a new iteration directory. Require two or more runs per arm per task before calling a difference real; one run is an anecdote.

```bash
W=$(mktemp -d)                                         # outside the repository
cp -r path/to/skill "$W/skill-snapshot"                # baseline for a revision
mkdir -p "$W"/iteration-1/task-{1,2,3}/{with_skill,baseline}
```

## Reading the trial

| Result | Meaning | Action |
|---|---|---|
| Skill arm wins and cites the rule's reasoning | the rule earns its place | keep it; add the task to the trial set |
| Tie | the model already knew it | cut the rule; it spends tokens for nothing |
| Skill arm wins for an unrelated reason | the rule is unproven | keep the win, retest the rule alone |
| Baseline wins | the skill misleads or over-restricts | fix or delete the rule before shipping |
| Skill arm never opened the body | selection or compliance problem, not content | run the trigger eval below, or see [skill-compliance.md](skill-compliance.md) |

## Held-out trigger eval
1. Write about twenty queries. Eight to ten should select the skill: casual and formal phrasing, no skill name, uncommon cases, and cases where a sibling competes but this skill should win. Eight to ten should not. Make the negatives **near misses** (shared keywords, a sibling's job) and name the owner that should win; an obviously unrelated negative proves nothing.
2. Keep queries substantive. A one-step ask the model does unaided ("read this file") selects no skill, however good the description.
3. Split before tuning anything: roughly 60% train, 40% test, stratified by expected outcome. Do not look at test failures while editing.
4. Run each query at least three times, each in a fresh session of a real client with the full catalog installed. A query counts as triggered when the transcript shows the skill loaded (a skill tool call or a read of its `SKILL.md`). Record the rate, never a single pass.
5. Revise the description from train failures only and pick the final version by test score; report both. A train gain with a flat test score means the description memorized train wording instead of intent.
6. Move fixed train cases into the repository's lexical eval file as regression signals. Keep the test set out of it so it stays held out.

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

Fix the pass bar before running, for example positives selected in at least two of three runs and negatives in at most one, and hold it. Moving the bar after seeing results erases the signal.

## Stop
- One run per arm, or a grader who knew which arm had the skill: the result supports no claim.
- The description was edited in response to test-set failures: the test set leaked into training. Write fresh test queries before claiming a score.

## Checklist
- [ ] Assertions written before the first run; baseline fixed (no skill, or a snapshot of the old version).
- [ ] Both arms run in parallel, same model and prompt, two or more runs each; blind comparison for judgment calls.
- [ ] About twenty queries with near-miss negatives that name their owner; 60/40 split made before tuning.
- [ ] Every query run at least three times in a fresh session; train and test rates reported separately.
- [ ] Lexical evals updated from train cases only; results labeled as model behavior in the tested client, not a guarantee elsewhere.
