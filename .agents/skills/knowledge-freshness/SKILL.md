---
name: knowledge-freshness
description: |
  Keep stack knowledge and dependencies current: verify latest stable versions, release dates, and breaking changes. Use for dependency and framework version checks before adding, upgrade planning, changelog tracking, and end-of-life dates.
---

# Knowledge Freshness

## Workflow
1. List the packages or tools in scope with their pinned versions and sources of truth: npm, PyPI, Maven, or GitHub releases.
2. Query each registry or release feed for the latest stable version, publish date, and latest major.
3. Compare and classify: current, outdated, EOL, or vulnerable; check breaking-change notes for major jumps.
4. Decide the upgrade path: patch or minor direct; major only after a changelog review and compatibility test.
5. Record the checked date and verified versions in the report; pin them after any change.

## Rules
- Never assume a version is current; verify against the registry.
- Check EOL and security status before recommending upgrades.
- Do not upgrade without reviewing breaking changes.
- Use frozen installs (`npm ci`, `uv`) after any dependency change.
- Prefer stable over bleeding-edge unless explicitly requested.

## Checklist
- [ ] Versions verified against live registries.
- [ ] Breaking changes and EOL checked for major jumps.
- [ ] Report has checked date and verified versions.
