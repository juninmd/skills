# Upstream

- Source: https://github.com/Project-N-E-K-O/N.E.K.O (`.agent/skills/vrm-physics/SKILL.md`), Apache-2.0; see `LICENSE` and `NOTICE`.
- Pinned commit: `74a175c38ef217635bbf847edf48ef484a485115` (2026-09-14).
- Local changes: renamed `SKILL.md` to `springbone-physics.md` so clients do not load it as a separate skill. Content unchanged.
- Caution: the 50% collider radius reduction is the upstream authors' empirical fix, not a specification value. Measure on the target model before adopting it.
- Updating: re-vet the upstream diff from the pinned commit, per `plugin-vetting.md` in `security-ops`.
