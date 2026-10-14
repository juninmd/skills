# Dependency update policy

Use this procedure for every dependency update, including a locked transitive selection. A lockfile records what was selected; it does not prove when that release was published, whether an advisory is resolved, or whether the selected version is compatible.

## Required gates

1. Keep the repository's existing cooldown when it is stricter. Otherwise require at least 24 hours between publication and application. The existing Dependabot template's 7-day cooldown remains the default. A bot cooldown is not a security exemption; an urgent security update needs explicit review by `security-ops` and recorded authorization.
2. Record exact versions for direct and transitive dependencies. For pnpm use the manifest/catalog plus lockfile; for uv use pinned requirements in `uv.lock`; for npm, pip, and cargo use the existing Dependabot/Renovate configuration or deterministic registry metadata. Do not invent a native flag that the selected ecosystem does not support.
3. Verify the selected release and its publication timestamp before applying it. For npm use registry package metadata and the exact dist-tag/version; for PyPI verify the exact artifact upload time; for crates.io verify the exact crate version creation time. Missing or untrustworthy timestamps are `unknown` and block an ordinary update.
4. Read the official changelog and migration guide, tracing every intermediate breaking release from the current version to the target. Check Rust MSRV, peer dependencies, and Node/Python compatibility in the target release and CI matrix.
5. Route advisory severity and exploitability to `security-ops`; keep package-manager configuration, pins, cooldowns, and lockfile regeneration in this skill; route API and compatibility findings to `code-review`.

## Ecosystem settings

| Ecosystem | Minimum policy |
|---|---|
| pnpm | pnpm `>=10.16`; workspace `minimumReleaseAge: 1440` minutes. Pin the manager used by local development and CI. pnpm 10 needs an additional locked-version timestamp gate; do not claim frozen installs verify age. pnpm 11 adds `minimumReleaseAgeStrict` and missing-time controls; verify availability before configuring them. |
| uv | `[tool.uv] exclude-newer = "1 day"`; this freezes resolution against the lock timestamp and does not audit already-locked packages. |
| npm, pip, cargo | Use existing Dependabot/Renovate controls or deterministic registry metadata. Do not claim a nonexistent native cooldown flag. |

## Evidence block

```text
current -> target: exact versions
published: registry URL, timestamp, and age
cooldown: configured value and effective wait
compatibility: changelog/migration path, MSRV, peers, Node/Python, CI
security: advisory owner and decision
```

Before changing configuration, check the installed manager's version and supported settings. Apply available project-local controls within existing authorization; preserve stricter policies and never create unrelated ecosystems. Confirm effective configuration, regenerate affected locks through the manager, and run a frozen/locked install plus the advisory and timestamp gates. Existing bot settings only govern bot-generated version updates: they do not enforce manual installs or security-update cooldowns.

For example, in a detected pnpm project:

```yaml
# pnpm-workspace.yaml, pnpm >=10.16
minimumReleaseAge: 1440
```

```toml
# pyproject.toml, uv supporting duration cutoffs
[tool.uv]
exclude-newer = "1 day"
```

Verify current semantics in [pnpm resolution settings](https://pnpm.io/settings/dependency-resolution), [uv cooldowns](https://docs.astral.sh/uv/concepts/resolution/#dependency-cooldowns), and [Dependabot cooldown](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#cooldown). Native resolution controls do not establish CVE or consumer compatibility evidence.

Do not migrate package managers or install paid tooling as part of this policy without separate user authorization.
