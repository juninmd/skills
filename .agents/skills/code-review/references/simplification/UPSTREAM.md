# Upstream

- Source: https://github.com/addyosmani/agent-skills (`skills/code-simplification/SKILL.md`), MIT, see `LICENSE`.
- Pinned commit: `a120596f6d7ff9b967a3f5e0331ea911376ee5ef` (2026-09-17).
- Local changes: upstream `SKILL.md` renamed to `simplification.md` so clients do not load it as a separate skill; frontmatter `name` changed from the upstream skill name to `simplification`, because the upstream name is a retired skill name in `.agents/retired-skills.json` and trips the retired-handoff gate. No other edits.
- Precedence: behavior preservation before cleanup of uncharacterized code is owned by [legacy-refactoring.md](../legacy-refactoring.md); this file owns the simplification signals and the incremental loop. Where both apply, characterize first. The upstream "If tests pass → commit" step yields to the repository rule that a commit needs user confirmation.
- Updating: re-vet the upstream diff from the pinned commit before copying, per [plugin-vetting.md](../../../security-ops/references/plugin-vetting.md).
