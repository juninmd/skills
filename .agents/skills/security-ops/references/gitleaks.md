# Gitleaks: Setup, Triage, Action, Criteria

End-to-end handling of secret-scanning findings.

## 0. Blast radius first

Before touching the code, answer three questions — they decide whether this is a chore or an incident:

- Is the repository public, or public in any mirror?
- Has it been cloned or forked? Check forks, CI caches, artifact stores, and any read-only mirror.
- How long has the secret been in reachable history, and did it ever reach a default or released branch?

Public, mirrored, or long-lived → treat the credential as compromised: revoke first, ask questions after. Private, never pushed, short-lived → rotate on the normal path. History rewriting never un-leaks a secret that was cloned.

## 1. Setup and collection

- macOS: `brew install gitleaks`. Linux: download the release binary into `/usr/local/bin`.
- Docker: `docker run --rm -v "$PWD:/repo" zricethezav/gitleaks detect --source /repo`.
- Pre-commit: add the `gitleaks` hook to `.pre-commit-config.yaml`.
- Local scan: `gitleaks detect --source . -v --report-format json --report-path gitleaks.json`.
- From a CI log: download via the provider CLI or API — `glab ci trace <job-id>` on GitLab — and parse `Finding`, `Secret`, `Fingerprint`.
- Redacted logs: use `Fingerprint` and `File:Line` to locate the real value in the local checkout.

## 2. Triage

For every finding present: file and line, git metadata (commit, branch, author, date), fingerprint, and a recommendation shaped `[Action] + [Reason] + [Mitigation]`. Never print the value itself into shared output.

| RuleID | False positive? | Default action |
|---|---|---|
| `private-key` | Never | Remove + revoke |
| `aws-token` | Never | Remove + revoke |
| `google-api-key` | Rarely | Remove + revoke |
| `jwt` | Sometimes | Verify context |
| `*-key` in README | Usually | `.gitleaksignore` |

Revoke is mandatory for any real key that reached a shared or public branch. Ignore is for low-entropy placeholders, documentation snippets, and known test fixtures. More than five findings: group by `RuleID` for batch decisions.

## 3. Action

1. Replace the secret in the source with an environment variable or a secret-manager lookup.
2. Rotate the credential at the provider. This comes before history work, always.
3. Commit and push the fix on a branch.
4. Purge history with `git-filter-repo` (preferred) or BFG Repo-Cleaner, only with explicit approval — it rewrites shared history.
5. Skipped findings are recorded as open follow-ups, never marked resolved.

`.gitleaksignore` entries are `commit:file:ruleID:line`:

```
# False positive: README example
91f7ac1d:README.md:generic-api-key:27
```

## 4. Completion criteria

- Credential rotated and the old one confirmed dead at the provider.
- `gitleaks detect --source . -v --redact` reports zero findings.
- The replacement path reads from environment or secret manager, proven by a run.
- A scanner runs in CI so the same class of leak fails the build next time.
