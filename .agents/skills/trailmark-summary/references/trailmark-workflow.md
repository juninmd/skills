# Trailmark Summary Workflow

Step-by-step execution for structural codebase overview.

## 1. Execution
Run the summary with the detected language flag:
```bash
trailmark analyze --summary {language_flag} {target_dir}
```
Or via uv:
```bash
uv run trailmark analyze --summary {language_flag} {target_dir}
```

## 2. Output Verification
The output is valid only if it includes:
1. **Language Detection:** Confirmed language(s).
2. **Entry Points:** Explicit count (even if 0).
3. **Dependency Graph:** Module count and interaction shape.

## 3. Escalation
If the summary is insufficient for deep analysis (e.g., missing taint data or hotspot scores), escalate to a full Trailmark pass.
