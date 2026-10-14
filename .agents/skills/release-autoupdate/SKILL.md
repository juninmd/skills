---
name: release-autoupdate
description: |
  Automate releases and in-app updates for desktop and CLI tools. Use for multi-platform release jobs, minisign artifact signing, conventional commit version bumps, updater manifests, and in-app update checks. Trigger on 'set up auto-update', 'create release pipeline', 'automate desktop releases', 'in-app updater configuration'.
---

# Release and Auto-Update Pipelines

**Not this skill:** general branch merges and Git rebase recovery (`git-workflow`), generic cloud/Kubernetes deployments (`cloud-devops`), or pull request review and merge preparation (`finishing-dev`).

## Preflight

```bash
git tag --list "v[0-9]*" | sort -V | tail -5
git log --oneline -5
gh release list --limit 5
test -f src-tauri/tauri.conf.json && grep -A 10 "updater" src-tauri/tauri.conf.json || true
ls -la .github/workflows/release* 2>/dev/null || true
```

Audit release triggers, signing key availability, and current distribution endpoints. Do not execute a release job without verifying existing tags and target artifacts.

## Workflow

1. **Establish Release Trigger and Target Strategy**: Determine whether releases trigger on push to the trunk branch, manual dispatch, or schedule. Distinguish full installers (NSIS, DMG, AppImage/DEB) from differential update packages.
2. **Autonomous Release Planning**: Inspect linear git commit history since the latest SemVer tag. Compute version bump via conventional commit prefixes (`feat` -> minor, `fix` -> patch, breaking change indicator `!` or footer -> major). Skip non-functional commits (`chore`, `docs`, `ci`) unless bundled with functional changes.
3. **Multi-Platform Matrix Build**: Build artifacts across required operating systems (Windows, macOS, Linux). Compile in release mode with locked dependencies. Keep verification checks running in parallel to prevent installer queues from blocking validation gates.
4. **Cryptographic Signing and Manifest Generation**: Sign installer bundles with minisign or OS-native certificates. Generate the `latest.json` updater manifest linking release download URLs, platform targets, and corresponding base64 signature digests. Upload draft artifacts, verify manifest consistency against published assets, and undraft atomically.
5. **In-App Updater and Safety Barrier**: Implement updater clients that verify signatures before disk execution. Ensure updates terminate pending worker processes gracefully before invoking system installers, and provide transparent download progress.

## Operation Decisions

| Scenario | Recommended Strategy | Verification |
|---|---|---|
| Tauri 2 desktop app releases | GitHub Actions matrix (`windows-latest`, `macos-latest`, `ubuntu-latest`) using `tauri-action` with updater artifacts enabled | `latest.json` contains valid platform keys and signatures matching `.sig` files |
| Conventional commit planning | Dedicated planner script (`scripts/release.mjs`) inspecting `git rev-list --first-parent` | Correct SemVer bump calculated; tags point to exact commit SHAs |
| Installer signing | Minisign key pair (`TAURI_SIGNING_PRIVATE_KEY` stored in repository secrets; public key in config) | Updater verifies signature and rejects tampered installer binaries |
| In-app update flow | Background check with user opt-in or passive install on exit | Download chunk progress reports cleanly without UI thread freeze |
| Staged / draft release | Create release in draft mode, upload installers and `.sig` assets, verify manifest, publish draft | No broken intermediary download state exposed to existing clients |

## Manifest Structure

```json
{
  "version": "1.2.0",
  "notes": "Feature additions and fixes",
  "pub_date": "2026-10-13T20:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "base64-signature",
      "url": "https://github.com/example/repo/releases/download/v1.2.0/app-setup.nsis.zip"
    }
  }
}
```

Verify signatures against the embedded minisign public key before invoking OS installers.

## Stop

- Private signing keys (`TAURI_SIGNING_PRIVATE_KEY` or certificates) are exposed in repository files, command line arguments, or workflow logs.
- The updater manifest references missing release assets or invalid SHA/signature digests.
- The release script attempts to overwrite a published, non-draft SemVer tag with a different commit SHA.

## Rules

- Private keys belong exclusively in GitHub Secrets or secure hardware modules; public keys reside in client configurations.
- Update manifests must be verified end-to-end (`verify` step checking download URLs, signatures, and version numbers) before undrafting a release.
- In-app updaters must never execute unsigned binaries or fall back to plain HTTP endpoints.
- Release workflows must be idempotent: rerun against an interrupted commit must resume draft uploads rather than corrupting existing releases.
- Windows NSIS installers running in passive or silent mode must ensure the application terminates cleanly and flushes persistent stores before updater execution.

## Excuses

| Excuse | Why it is false |
|---|---|
| Signature verification is optional for testing | Unsigned update paths expose users to MITM binary substitution; always sign artifacts. |
| Hardcoding latest version in git is sufficient | Manual version bumps produce merge conflicts and drift; derive version from tag history and conventional commits. |
| We can publish the release before uploading installers | Clients checking updates immediately will download 404s or corrupt partial files; draft first, publish last. |
| Auto-update can just restart immediately without warning | Abrupt restart loses unsaved user state; notify or defer install until application exit. |

## Checklist

- [ ] Repository secrets configured for artifact signing (`TAURI_SIGNING_PRIVATE_KEY`).
- [ ] Conventional commit parsing maps `fix:` to patch, `feat:` to minor, and breaking changes to major.
- [ ] Build matrix compiles release binaries across target operating systems.
- [ ] `latest.json` manifest verified against uploaded assets prior to public release.
- [ ] In-app updater validates signature and handles network failures gracefully.
