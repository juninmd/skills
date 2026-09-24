# Upstream

- Source: https://github.com/emilkowalski/skills (`skills/`), MIT, see `LICENSE`.
- Pinned commit: `d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128` (2026-09-24).
- Files: `write-swift/SKILL.md` → `write-swift.md`. Each upstream `SKILL.md` is renamed so clients do not load it as a separate skill.
- Local changes: companion-file and `SKILL.md` links point at the renamed copies; mentions of sibling upstream skills link to the vendored copy or name the owning skill here. One macro heading says "compiler errors and warnings" instead of the upstream plural of "diagnostic", which matches a retired skill name. No other edits.
- Vetting: prose and example code only; no scripts, network calls, or agent-directed concealment.
- Updating: re-vet the upstream diff from the pinned commit before copying.
