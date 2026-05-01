---
name: trailmark-summary
description: "trailmark analyze --summary. Triggers: trailmark."
argument-hint: "[context] [options]"
---

# Trailmark Summary

Runs `trailmark analyze --summary` on a target directory.

## When to Use

- You need a quick structural overview before deeper decomposition
- You need language detection and entry point count before a larger review
- Quick orientation on an unfamiliar codebase before deeper analysis

## When NOT to Use

- Full structural analysis with all passes needed (run a deeper Trailmark pass instead)
- Detailed code graph queries (run Trailmark directly instead of the summary mode)
- You need hotspot scores or taint data (run a deeper Trailmark pass instead)

## Rationalizations to Reject

| Rationalization | Why It's Wrong | Required Action |
|-----------------|----------------|-----------------|
| "I can read the code manually instead" | Manual reading misses dependency graph shape and entry point enumeration | Install and run trailmark |
| "Language detection doesn't matter" | Wrong language flag produces empty or incorrect analysis | Detect language from file extensions first |
| "Partial output is good enough" | Missing any of the three required outputs (language, entry points, dependencies) means incomplete analysis | Verify all three are present |
| "Tool isn't installed, I'll skip it" | This skill exists specifically to run trailmark | Report the installation gap instead of skipping |

## Usage

The target directory is passed via the `args` parameter.

## Execution

**Step 1: Check that trailmark is available.**

```bash
trailmark analyze --help 2>/dev/null || \
  uv run trailmark analyze --help 2>/dev/null
```

If neither command works, report "trailmark is not installed"
and return. Do NOT run `pip install`, `uv pip install`,
`git clone`, or any install command. The user must install
trailmark themselves.

**Step 2: Detect the primary language.**

```bash
find {args} -type f \( -name '*.rs' -o -name '*.py' \
  -o -name '*.go' -o -name '*.js' -o -name '*.jsx' \
  -o -name '*.ts' -o -name '*.tsx' -o -name '*.sol' \
  -o -name '*.c' -o -name '*.h' -o -name '*.cpp' \
  -o -name '*.hpp' -o -name '*.hh' -o -name '*.cc' \
  -o -name '*.cxx' -o -name '*.hxx' \
  -o -name '*.rb' -o -name '*.php' -o -name '*.cs' \
  -o -name '*.java' -o -name '*.hs' -o -name '*.erl' \
  -o -name '*.cairo' -o -name '*.circom' \) 2>/dev/null | \
  sed 's/.*\.//' | sort | uniq -c | sort -rn | head -5
```

Map the most common extension to a language flag:
- `.rs` -> `--language rust`
- `.py` -> (no flag, Python is default)
- `.go` -> `--language go`
- `.js`/`.jsx` -> `--language javascript`
- `.ts`/`.tsx` -> `--language typescript`
- `.sol` -> `--language solidity`
- `.c`/`.h` -> `--language c`
- `.cpp`/`.hpp`/`.hh`/`.cc`/`.cxx`/`.hxx` -> `--language cpp`
- `.rb` -> `--language ruby`
- `.php` -> `--language php`
- `.cs` -> `--language c_sharp`
- `.java` -> `--language java`
- `.hs` -> `--language haskell`
- `.erl` -> `--language erlang`
- `.cairo` -> `--language cairo`
- `.circom` -> `--language circom`

**Step 3: Run the summary.**

```bash
trailmark analyze --summary {language_flag} {args} 2>&1 || \
  uv run trailmark analyze --summary {language_flag} {args} 2>&1
```

**Step 4: Verify the output.**

The output must include ALL THREE of:
1. Language detection (at least one language name)
2. Entry point count (or "no entry points found")
3. Dependency graph shape (module count or "single module")

If any are missing, report the gap. Do not fabricate output.

Return the full trailmark output.

## Checklist

- [ ] Confirm the target directory and primary language before running the summary.
- [ ] Verify that language detection, entry points, and graph shape are all present in the output.
- [ ] Escalate to a deeper Trailmark analysis when the summary omits needed structural detail.

## References

- [Workspace Agent Conventions](../../../AGENTS.md)
- [Audit Context Building Skill](../audit-context-building/SKILL.md)
