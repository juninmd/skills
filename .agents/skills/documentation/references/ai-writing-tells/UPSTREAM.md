# Upstream

- Source: https://github.com/blader/humanizer (`SKILL.md`, v3.0.0), MIT, see `LICENSE`.
- Pinned commit: `9862685f575c65a8247f90369951df1b3416e3d6` (2026-09-06).
- Local changes: upstream `SKILL.md` renamed to `ai-writing-tells.md` so clients do not load it as a separate skill. No other edits.
- Not vendored: `README.md`, `AGENTS.md`, `agents/`, `scripts/validate-package.py` (packaging for the standalone skill; nothing the procedure reads).
- Updating: re-vet the upstream diff from the pinned commit before copying, per [plugin-vetting.md](../../../security-ops/references/plugin-vetting.md).
