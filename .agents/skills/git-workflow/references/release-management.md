
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
2. Pick the next version from the highest-impact change present. When the version or bump level the user asked for disagrees with that classification, stop and confirm; never adjust it silently in either direction.
3. Update the changelog with **user-facing** changes grouped by type, linking issues and pull requests.
4. Pass the pre-tag gate before anything is tagged. A release branch is rebased onto the default branch first; when several pull requests landed since the last tag, audit the combined tree per [untrusted-contribution.md](../../code-review/references/untrusted-contribution.md).
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

### `semantic-release` Automation Notes

Fully automated releases remove the human gate, so the gate has to live in
the pipeline instead: restrict the release job to the protected branch,
require the same CI checks as any other merge, and scope `NPM_TOKEN` /
`GH_TOKEN` to least privilege (publish-only, not admin). The plugin order
matters — `commit-analyzer` decides the bump, `release-notes-generator` and
`changelog` build the notes from the same commits, then `npm`/`github`
publish; reordering `changelog` after `npm` publishes a release before its
own notes exist. Because there is no human gate, malformed commit messages
(a `feat:` that was really a fix, a missing `BREAKING CHANGE:` footer) ship
as wrong version bumps with nobody to catch them — enforce the Conventional
Commits format at commit time (`commitlint`), not at release time.

### Monorepo Tagging

Tag per package, not once for the whole repository: `pkg-name@1.2.3`. This
keeps `git describe --tags --match 'pkg-name@*'` scoped to one package's own
history, and lets consumers pin a single package's version without pulling
in unrelated bumps. `changesets` automates exactly this: each changed
package gets its own changelog and tag from the changesets accumulated
since its last release. Pick fixed or independent versioning per the Rules
section below and apply it to every package — a monorepo with some packages
independently versioned and others fixed is unreadable to anyone consuming
the tags.

## When It Goes Wrong

| Situation | Do | Never |
|---|---|---|
| Wrong tag already pushed | ship the next patch, deprecate the bad release | force-move the tag — clones keep the old one |
| Version already on a registry | bump and republish; deprecate or yank the old | try to overwrite it; registry versions are immutable |
| Bad release already consumed | publish a fixed patch and announce | unpublish, breaking every lockfile pinning it |
| Changelog wrong after tagging | correct the release notes, note the fix | rewrite the tagged commit |

## Changelog Generation Edge Cases

- **Breaking-change footers.** Conventional Commits marks a breaking change
  with a `BREAKING CHANGE:` footer or a `!` after the type/scope
  (`feat(api)!: drop the v1 endpoint`) — either forces a major bump
  regardless of the commit's type. A tool that only reads the type and
  misses the footer silently ships a breaking change as a minor.
- **Merge commits polluting history.** `git log` on a branch with regular
  (non-fast-forward) merges interleaves both branches' commits, so a
  changelog generator walking it picks up internal commits that were
  already squashed or superseded. Generate from `git log --first-parent`
  when the repo merges via merge commits, or enforce squash-merge on the
  base branch so the log stays one entry per shipped change.
- **Revert commits.** A `revert: <sha>` commit should cancel its target's
  changelog entry, not add a new one saying "reverted X" next to the
  original "added X" — readers of the changelog do not know which shipped.
  Tools that support this (e.g. `git-cliff`'s revert handling) need the
  revert commit's subject to reference the original in a recognizable
  format; a hand-written revert message that does not match breaks the
  pairing.
- **Chore/refactor noise.** Filter internal-only commit types (`chore`,
  `refactor`, `test`, `ci`) out of the user-facing changelog even though
  they still count for the changelog's own commit range — the changelog is
  for users, not for the team, per the Rules section below.

## Stop
- CI is not green on the exact SHA being tagged. Stop; the branch may have moved since the check.
- The version already exists on the registry. It is immutable — bump instead of trying to replace it.
- A wrong tag is already pushed. Never force-move it; ship the next patch and deprecate the bad release.
- The requested version disagrees with the classified changes (for example a minor bump requested while the range holds a breaking change, or a major bump with none). Confirm before bumping.

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
