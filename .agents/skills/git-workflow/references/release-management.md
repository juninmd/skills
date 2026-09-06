
# Release Management

## Preflight
```bash
git describe --tags --abbrev=0                       # last release
git log $(git describe --tags --abbrev=0)..HEAD --oneline
SHA=$(git rev-parse HEAD) && gh run list --commit "$SHA" --json conclusion
```

CI must be green **on the exact SHA** you are about to tag, not on the branch head.

## Workflow
1. Review merged changes since the last tag and classify them by conventional commit type.
2. Pick the next version from the highest-impact change present.
3. Update the changelog with **user-facing** changes grouped by type, linking issues and pull requests.
4. Pass the pre-tag gate before anything is tagged.
5. Commit the version bump, tag that exact SHA, push the tag.
6. Let CI build and publish the artifact from the tag. Never publish from a laptop.
7. Publish release notes generated from the changelog, then verify the whole chain.

## Version Choice

| Change | 1.x and above | Under 0.x |
|---|---|---|
| Breaking | major | **minor** |
| Feature | minor | **patch** |
| Fix | patch | patch |

Under `0.x` semver is off by one and consumers routinely get it wrong. Say so explicitly in the notes, or cut `1.0.0` and stop the ambiguity.

## Pre-Tag Gate
The most common release incident is tagging a SHA that CI never went green on — the branch moved between the check and the tag.

```bash
SHA=$(git rev-parse HEAD)
gh run list --commit "$SHA" --json conclusion,workflowName --jq '.[] | "\(.workflowName): \(.conclusion)"'
# every workflow must read success — on THAT SHA, not on the branch head

git tag -a "v$VERSION" "$SHA" -m "v$VERSION"
git push origin "v$VERSION"
```

## Tooling

| Tool | Fits |
|---|---|
| `changesets` | monorepo, independent versions, human-written notes |
| `release-please` | trunk-based, automated from conventional commits, PR-driven |
| `semantic-release` | fully automated, no human gate — only where that is acceptable |
| `git-cliff` / `conventional-changelog` | changelog only; versioning stays manual |

## When It Goes Wrong

| Situation | Do | Never |
|---|---|---|
| Wrong tag already pushed | ship the next patch, deprecate the bad release | force-move the tag — clones keep the old one |
| Version already on a registry | bump and republish; deprecate or yank the old | try to overwrite it; registry versions are immutable |
| Bad release already consumed | publish a fixed patch and announce | unpublish, breaking every lockfile pinning it |
| Changelog wrong after tagging | correct the release notes, note the fix | rewrite the tagged commit |

## Stop
- CI is not green on the exact SHA being tagged. Stop; the branch may have moved since the check.
- The version already exists on the registry. It is immutable — bump instead of trying to replace it.
- A wrong tag is already pushed. Never force-move it; ship the next patch and deprecate the bad release.

## Rules
- No tag or release publication without explicit confirmation. Local, reversible version and changelog preparation may proceed when authorized by the task.
- Never change history after tagging. Fix forward, always.
- Monorepo: fixed versioning ships every package together (simple, noisy); independent versioning ships only what changed (precise, needs per-package changelogs). Pick one and keep it — mixing produces version numbers nobody can reason about.
- The changelog is for users, not for the team. "Refactored internals" belongs in the commit log; "Fixed timestamps shifting by one hour in non-UTC zones" belongs in the changelog.
- Keep releases small and reviewable. A release bundling unreviewed work makes the rollback decision impossible when one piece breaks.
- Getting the change merged belongs to `finishing-dev`; the pipeline that builds and publishes to `cloud-devops`; prose beyond the changelog to `documentation`.

## Checklist
- [ ] Changes since the last tag reviewed and classified.
- [ ] Version follows semver, or the `0.x` rule stated explicitly in the notes.
- [ ] CI green on the **exact tagged SHA**, verified before tagging.
- [ ] Artifact built and published from the tag by CI, never locally.
- [ ] Changelog entries are user-facing and match the diff.
- [ ] Tag, notes, and published artifact all verified to come from the same build.
