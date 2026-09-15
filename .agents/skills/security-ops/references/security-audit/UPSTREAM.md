# Upstream

- Source: https://github.com/cloudflare/security-audit-skill (`skills/security-audit/`), MIT, see `LICENSE`.
- Pinned commit: `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8` (2026-09-14).
- Local changes: upstream `SKILL.md` renamed to `audit-workflow.md` so clients do not load it as a separate skill; every `` `SKILL.md` `` mention updated to match; one heading in `DATA-ISOLATION-AND-LIFECYCLE.md` now says "diagnostic dumps" to clear the retired-name gate. No other edits.
- Vetting: validators import only `fs`, `path`, `util`; no network, subprocess, or agent-directed concealment prose.
- Windows: the CLI entry points fail closed (`OS no-follow and nonblocking input protection is unavailable`); run `validate-findings.cjs` and `validate-coverage-ledger.cjs` under Linux, macOS, or WSL.
- Updating: re-vet the upstream diff from the pinned commit before copying, per [plugin-vetting.md](../plugin-vetting.md).
