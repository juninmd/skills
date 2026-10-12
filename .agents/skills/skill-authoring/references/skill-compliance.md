# Skill Compliance Measurement

Method adapted from the `skill-comply` skill of Everything Claude Code (ECC, MIT, Copyright (c) 2026 Affaan Mustafa; https://github.com/affaan-m/ecc). This is a procedure, not an import of its scripts.

Routing evals (`run-evals.mjs`) are lexical: they show the right skill is picked, not that the agent then follows its rules. Use this procedure when a skill loads correctly but the agent still skips a step.

## Preflight
```bash
git status --short
node .agents/tools/run-evals.mjs .agents --check --min-rank1 95   # routing must be healthy first
claude --version
```

If routing fails, fix the description first; compliance cannot be measured on a skill that never loads.

## Procedure
1. List the skill's observable steps as tool-call expectations in order (for example: read the config, run the scanner, only then edit). Steps that leave no tool trace cannot be measured; turn them into a script or hook instead.
2. Write three prompts for the same task at falling strictness: **supportive** (names the skill or step), **neutral** (just the task), **competing** (task plus pressure to skip: "quick fix, no need to check"). Compliance that only holds at supportive is not compliance.
3. Run each prompt several times in a disposable checkout and capture the trace.
4. Label each tool call against the steps, then check ordering deterministically. Report per scenario: steps hit, order kept, rate over runs.
5. A step below your threshold on neutral or competing prompts is a candidate for a hook or script ([automation-candidates.md](automation-candidates.md)), or for a gotcha that closes the observed rationalization. Prose repetition is the weakest fix.

```bash
claude -p "$PROMPT" --output-format stream-json --verbose --max-turns 20 > trace.jsonl
jq -r 'select(.type=="assistant") | .message.content[]? | select(.type=="tool_use") | "\(.name)\t\(.input.command // .input.file_path // "")"' trace.jsonl
```

## Gotchas
- Run in a throwaway worktree with no ambient credentials; the agent really executes tools.
- Labeling by regex over commands is brittle; label by hand or with a model, and keep the ordering check in code.
- Few runs mean noisy rates. Report run counts and treat a single pass as an anecdote.
- A compliance gap is a finding about the skill text or its mechanism, not a reason to edit the prompt until it passes.

## Stop
- The step has no tool-call trace to observe.
- The run would touch shared resources, paid APIs or real credentials.
