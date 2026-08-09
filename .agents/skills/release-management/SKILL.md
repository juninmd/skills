---
name: release-management
description: |
  Plan and ship releases: semantic versioning, changelogs, tags, and release notes. Use for version bumps, conventional commits, changelog generation, release branches, and GitHub Releases.
---

# Release Management

## Workflow
1. Review merged changes since the last tag; classify by conventional commit types.
2. Decide the next version by semver rules: breaking change → major, feature → minor, fix → patch.
3. Update the changelog with user-facing changes grouped by type; link issues and PRs.
4. Commit the version bump, tag it, and push the tag.
5. Generate release notes from the changelog and publish the release.
6. Verify: tag matches the version, release notes match the diff, and the artifact is built from the tag.

## Rules
- No tag, release, or version bump without explicit confirmation.
- Never change history after tagging; fix forward.
- Keep releases small and reviewable; do not bundle unreviewed work.
- Prefer automation (conventional commits → changelog) over hand-written notes.

## Checklist
- [ ] Version chosen by semver from actual changes.
- [ ] Changelog and release notes match the diff.
- [ ] Tag verified and artifact built from it.
