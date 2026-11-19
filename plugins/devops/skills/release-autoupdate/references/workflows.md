## Contents

- Trigger workflow
- Per-commit workflow
- Adapting

## Trigger workflow

`.github/workflows/release.yml`: plans on every push to `main`, retries on a schedule, chains the next pending commit.

```yaml
name: Release
on:
  push: { branches: [main] }
  schedule: [{ cron: "17 */6 * * *" }]
  workflow_dispatch:
permissions: { contents: read }
concurrency: { group: release-main, cancel-in-progress: false }
jobs:
  plan:
    runs-on: ubuntu-24.04
    outputs:
      candidate: ${{ steps.releases.outputs.candidate }}
      more: ${{ steps.releases.outputs.more }}
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0, persist-credentials: false }
      - run: git fetch origin main --tags
      - id: releases
        run: node scripts/release.mjs plan
        env: { GH_TOKEN: "${{ secrets.GITHUB_TOKEN }}" }
  publish:
    needs: plan
    if: needs.plan.outputs.candidate != '{}'
    permissions: { contents: write }
    uses: ./.github/workflows/release-commit.yml
    with:
      sha: ${{ fromJSON(needs.plan.outputs.candidate).sha }}
      tag: ${{ fromJSON(needs.plan.outputs.candidate).tag }}
      version: ${{ fromJSON(needs.plan.outputs.candidate).version }}
      previous-tag: ${{ fromJSON(needs.plan.outputs.candidate).previousTag }}
    secrets: inherit
  next:
    needs: [plan, publish]
    if: needs.plan.outputs.more == 'true'
    runs-on: ubuntu-24.04
    permissions: { actions: write }
    steps:
      - run: gh workflow run release.yml --ref main --repo "$GITHUB_REPOSITORY"
        env: { GH_TOKEN: "${{ secrets.GITHUB_TOKEN }}" }
```

## Per-commit workflow

`.github/workflows/release-commit.yml` (`on: workflow_call` with inputs `sha tag version previous-tag`). Jobs, in order:

1. `verify` (ubuntu): checkout `inputs.sha`, Tauri Linux deps, lint, tests, frontend build, `cargo clippy -- -D warnings`, `cargo test --locked`. Runs beside `prepare`; only `publish` waits for it, so installers never queue behind checks.
2. `prepare` (ubuntu, `contents: write`): `node scripts/release.mjs notes "$TAG" "$SHA" "$PREV" release-notes.md`, then create the release as `--draft --target "$SHA"`, or resume an existing draft with `gh release edit` (fail if the existing release is not a draft). Output `release-id` and the notes.
3. `installers` (matrix, needs `prepare`): `fail-fast: false`; `macos-latest` x `aarch64-apple-darwin` and `x86_64-apple-darwin`, `ubuntu-22.04`, `windows-latest`. Each runs checkout at the SHA, system deps, Rust + cache, package install, then writes the version without committing it:

```bash
printf '{"version":"%s"}\n' "$RELEASE_VERSION" > src-tauri/tauri.release-version.conf.json
```

   and runs `tauri-apps/tauri-action` with `releaseId`, `tagName`, `releaseDraft: true`, `uploadUpdaterJson: false`, `retryAttempts: 3`, `args: <matrix args> --config src-tauri/tauri.updater.conf.json --config src-tauri/tauri.release-version.conf.json`, and env `GITHUB_TOKEN`, `TAURI_SIGNING_PRIVATE_KEY`, `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`.
4. `publish` (needs `verify prepare installers`): rebuild notes, download `*.sig`, then:

```bash
gh release download "$TAG" --pattern '*.sig' --dir signatures
gh api "repos/$GITHUB_REPOSITORY/releases/$ID" > release.json
node scripts/release.mjs manifest release.json signatures release-notes.md latest.json "$TAG" "$VERSION"
gh release upload "$TAG" latest.json --clobber
gh api "repos/$GITHUB_REPOSITORY/releases/$ID" > release.json
node scripts/release.mjs verify latest.json release.json "$TAG" "$VERSION"
gh release edit "$TAG" --draft=false
```

Optional macOS Developer ID: export `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY` (plus `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID` to notarize) to `GITHUB_ENV` only when set; otherwise keep `"signingIdentity": "-"` (ad-hoc) in `tauri.conf.json`.

## Adapting

- Replace the package manager steps (bun, pnpm, npm) with the repo's lockfile install; keep `--frozen-lockfile`.
- Pin third-party actions to full SHAs. Reference `juninmd/base-actions` by `@main` as the repository contract requires.
- Windows-only apps: keep one matrix entry and trim `PLATFORMS` in `scripts/release.mjs` to match, or `verify` fails.
- Add a `workflows.test` that pins job order (`publish` needs `verify`), as canto-widget does.
