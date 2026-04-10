---
name: fix-gitleaks
description: "Use when fixing gitleaks CI failures, triaging leaked secrets in GitLab CI jobs, deciding which findings are false positives, adding .gitleaksignore entries, removing real secrets from files, or resolving gitleaks check failures before merge."
metadata:
    works_on: [copilot, antigravity]
argument-hint: "GitLab job URL (optional) or 'local' to run locally"
---

# Fix Gitleaks

Interactive triage of gitleaks findings: for each detected leak, shows the real value and an AI-recommended action, then asks you to confirm what to do — just like Copilot's Plan mode.

## When to Use
- The `gitleaks` job failed in GitLab CI.
- You have mixed findings: some are real credentials, others are false positives (config examples, README snippets, test fixtures).
- You need to populate `.gitleaksignore` with precise fingerprints or clean secrets from the codebase.

---

## Phase 0 — Install gitleaks (if not available)

Before running locally, check if gitleaks is installed:

```bash
which gitleaks || echo "gitleaks not found"
```

If not found, install via one of the following methods:

### macOS
```bash
brew install gitleaks
```

### Linux (binary — recommended for CI parity)
```bash
# Replace VERSION with the latest from https://github.com/gitleaks/gitleaks/releases
VERSION="8.30.1"
curl -sSfL \
  "https://github.com/gitleaks/gitleaks/releases/download/v${VERSION}/gitleaks_${VERSION}_linux_x64.tar.gz" \
  | tar -xz -C /usr/local/bin gitleaks
chmod +x /usr/local/bin/gitleaks
gitleaks version
```

### Docker (no install needed)
```bash
docker run --rm -v "$PWD:/repo" zricethezav/gitleaks:v8.30.1 \
  detect --source /repo -v --report-format json \
  --report-path /repo/gitleaks_report.json
```

### Pre-commit hook (prevent leaks before push)
```bash
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.30.1
    hooks:
      - id: gitleaks
```

---

## Phase 1 — Collect findings

### Option A: from a GitLab job URL
```bash
# Extract the job ID from the URL (e.g. .../jobs/28507990)
JOB_ID=<id>

# Download job log via glab CLI
glab ci trace $JOB_ID > /tmp/gitleaks_log.txt 2>&1

# Alternative: via GitLab API
curl --silent --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.luizalabs.com/api/v4/jobs/$JOB_ID/trace" \
  -o /tmp/gitleaks_log.txt
```

Parse blocks containing `Finding:`, `Secret:`, `RuleID:`, `File:`, `Line:`, `Commit:`, `Fingerprint:` from the log.

### Option B: run locally (without --redact to see the real value)
```bash
# Full scan — shows real values and produces structured JSON
gitleaks detect --source . -v \
  --report-format json \
  --report-path /tmp/gitleaks_report.json

# Pretty-print findings in the terminal
cat /tmp/gitleaks_report.json | python3 -c "
import json, sys
findings = json.load(sys.stdin)
for i, f in enumerate(findings, 1):
    print(f'--- Finding {i}/{len(findings)} ---')
    print(f'RuleID:      {f[\"RuleID\"]}')
    print(f'File:        {f[\"File\"]}:{f[\"StartLine\"]}')
    print(f'Secret:      {f[\"Secret\"]}')
    print(f'Match:       {f[\"Match\"]}')
    print(f'Commit:      {f[\"Commit\"]}')
    print(f'Fingerprint: {f[\"Fingerprint\"]}')
    print()
"
```

### Option C: CI used --redact (value is hidden)
When the log shows `REDACTED`, change strategy:
1. Use `Fingerprint` and `File:Line` to locate the value in the current source code.
2. Read the file at the indicated line to retrieve the real value.
3. Present the value to the user for a decision.

---

## Phase 2 — Interactive triage (Plan mode)

For **each finding**, display a decision block that includes full git metadata and direct links. Example:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Finding 1/3 — generic-api-key                                           │
├──────────────────────────────────────────────────────────────────────────┤
│  File:         setup-oauth.sh:55                                         │
│  Line link:    https://gitlab.luizalabs.com/<group>/<project>/-/blob/91f7ac1d/setup-oauth.sh#L55 │
│  Value:        AIzaSy...BcD123 (google api key)                          │
│  Commit:       91f7ac1d — (link)                                          │
│  Branch:       feature/remove-secrets                                    │
│  Author:       John Doe <john@example.com>                               │
│  Date:         2024-12-15                                                 │
│  Commit msg:   Add oauth setup with placeholder                           │
│  Fingerprint:  91f7ac1d:setup-oauth.sh:generic-api-key:55                │
├──────────────────────────────────────────────────────────────────────────┤
│  💡 AI Recommendation: Remove from history — secret found in committed    │
│     history. Rotate credentials and purge from the git history (default  │
│     action if NOT a confirmed false positive).                            │
├──────────────────────────────────────────────────────────────────────────┤
│  What to do?                                                              │
│  [1] ✅ Apply AI recommendation                                             │
│  [2] Remove / replace the secret in the file (and purge history)          │
│  [3] Add to .gitleaksignore (false positive)                              │
│  [4] Skip — decide later                                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

Use `vscode_askQuestions` with the format below for each finding. Include fields for `author`, `commit_link`, `branch`, `date`, `value_link` and `commit_message` so the Copilot UI can render direct links.

Before displaying the block, derive the **AI recommendation** based on:
- `RuleID` (see the criteria table in Phase 4)
- File location (production vs. test vs. docs)
- Apparent entropy of the value (real key vs. placeholder)
- Whether the commit is already on a public branch or exposed in a fork

Recommendation format: `<action>` + `<one-line reason>` + `<mitigation step if Remove>`. Default recommendation: remove from history (purge) if the finding is not a confirmed false positive.

```yaml
header: "Finding {i}/{total} — {RuleID}"
question: |
  File:         {File}:{Line}
  Line link:    {value_link}
  Value:        {Secret}
  Context:      {Match}
  Fingerprint:  {Fingerprint}
  Commit:       {Commit} ({commit_link})
  Branch:       {Branch}
  Author:       {Author}
  Date:         {Date}
  Commit msg:   {CommitMessage}

  💡 AI Recommendation: {recommended_action}
  Reason: {reason}
  {mitigation_if_applicable}

  What to do?
options:
  - label: "✅ Apply AI recommendation"
    description: "{recommended_action}"
    recommended: true
  - label: "Remove — delete or replace the secret in the file (and purge history)"
  - label: "Ignore — add to .gitleaksignore (false positive)"
  - label: "Skip — decide later"
```

If there are multiple findings, present a table summary in addition to the per-finding decision blocks. The table columns should include: `Finding`, `RuleID`, `File:Line` (linked), `Value` (masked by default), `Commit` (linked), `Branch`, `Author`, `Date`, `Commit message`. In VS Code (Copilot) show the table and provide a quick "select all / batch action" control for findings that share the same `RuleID` or remediation.

**If triaging more than 5 findings**, group those with the same `RuleID` for batch decision.

---

## Phase 3 — Execute actions

### Action: Remove secret
1. Open the indicated file and inspect the surrounding context.
2. Replace the secret in the file with the appropriate safe pattern for the project:
  - Environment variable reference: `os.getenv("VAR_NAME")` / `process.env.VAR_NAME`
  - Example placeholder: `"<YOUR_API_KEY_HERE>"`
  - Test fixture: `"test-key-not-real"` (non-sensitive)
3. Commit the fix on a new branch and push the branch; open an MR describing the change, the credentials to rotate, and the plan to purge history.
4. Purge the secret from git history (MANDATORY default unless the finding is a confirmed false positive). Recommended approaches:

  - git-filter-repo (preferred)

    ```bash
    # create a local replacements file (do NOT commit this file)
    printf '%s==>REDACTED-SECRET\n' '<ACTUAL_SECRET_TO_REMOVE>' > replacements.txt

    # mirror clone the repository
    git clone --mirror git@<git-host>:<group>/<project>.git repo.git
    cd repo.git

    # apply replacements and rewrite history
    git filter-repo --replace-text ../replacements.txt

    # push rewritten history (force) and tags
    git push --force --all
    git push --force --tags
    ```

  - BFG Repo-Cleaner (alternative)

    ```bash
    git clone --mirror git@<git-host>:<group>/<project>.git repo.git
    java -jar bfg.jar --replace-text replacements.txt repo.git
    cd repo.git
    git reflog expire --expire=now --all && git gc --prune=now --aggressive
    git push --force --all
    git push --force --tags
    ```

  Notes:
  - Create `replacements.txt` locally and NEVER commit it to the repo; remove it after use.
  - Coordinate the force-push/rewrite with the team: everyone must re-clone or rebase after the rewrite.
  - After purge, immediately rotate the credential at the provider and update any CI/CD secrets.

5. If purging history is impossible due to policy or legal constraints, revoke the credential, document the reason, and add the fingerprint to `.gitleaksignore` with a clear justification and high-risk flag.

6. Confirm the replacement and history purge steps with the user before finalizing.

### Action: Add to .gitleaksignore (false positive)
The format of each entry is the exact `Fingerprint` of the finding:
```
commit:file:ruleID:line
```

Example:
```
# False positive: example value in README
91f7ac1db32cfa278ac61653e3de36ef3f5731a7:src/agents/luizalabs_code_quality_agent/README.md:generic-api-key:27
```

Append to the end of `.gitleaksignore` with a comment explaining the reason:
```bash
echo "# Reason: <short justification>" >> .gitleaksignore
echo "<fingerprint>" >> .gitleaksignore
```

### Action: Skip
Record the list of skipped findings in the final response for later follow-up.

---

## Phase 4 — Validate that CI will pass

After applying actions, re-run locally to confirm zero remaining findings:

```bash
# Simulate MR mode (only new commits)
gitleaks detect --source . -v --redact \
  --log-opts=<BASE_SHA>..<HEAD_SHA>

# Or full mode if history was modified (rare)
gitleaks detect --source . -v --redact
```

If findings remain, return to Phase 2.

---

## Quality criteria by finding type

| Common RuleID                        | False positive?         | Default action        |
|--------------------------------------|-------------------------|-----------------------|
| `generic-api-key`                    | Check if it's an example | Depends on context   |
| `google-api-key`                     | Rarely FP               | Remove or revoke      |
| `private-key`                        | Never FP                | Remove + revoke       |
| `aws-access-token`                   | Never FP                | Remove + revoke       |
| `jwt`                                | Can be FP in tests      | Verify value          |
| `generic-api-key` in README/docs     | Usually FP              | .gitleaksignore       |
| `generic-api-key` in `test*.py`      | Usually FP              | .gitleaksignore       |

## Golden rule: revoke before ignoring

If the leak reached a public branch, even as a test value, revoke the credential at the provider before marking as false positive. Secrets leaked in `git log` survive the `.gitleaksignore`.

---

## Flow summary

```
Job URL / run locally
        ↓
Collect findings (JSON or log)
        ↓
For each finding:
  Show: file, line, real value, fingerprint
  AI recommends: Remove / Ignore / False Positive
  Ask: Apply recommendation / Remove / .gitleaksignore / Skip
        ↓
Execute chosen actions
        ↓
Re-validate with gitleaks detect
        ↓
Zero findings → CI will pass ✓
```
