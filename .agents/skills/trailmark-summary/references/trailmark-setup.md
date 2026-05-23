# Trailmark Setup and Language Detection

Detailed guidelines for preparing Trailmark analysis.

## 1. Installation Check
Verify Trailmark is available via standard or `uv` invocation:
```bash
trailmark analyze --help 2>/dev/null || uv run trailmark analyze --help 2>/dev/null
```
*Note: Do not attempt to install; report the gap if missing.*

## 2. Language Detection
Detect the primary language by counting extensions in the target directory.
Common mappings:
- `.rs` -> `rust` | `.py` -> `python` (default)
- `.go` -> `go` | `.js`/`.ts` -> `javascript`/`typescript`
- `.sol` -> `solidity` | `.c`/`.cpp` -> `c`/`cpp`
- `.rb` -> `ruby` | `.php` -> `php` | `.cs` -> `c_sharp`

## 3. Rationalizations to Reject
- "Manual reading is enough" (Misses dependency graph shape).
- "Language detection doesn't matter" (Produces incorrect analysis).
- "Partial output is fine" (Missing core metrics makes analysis incomplete).
