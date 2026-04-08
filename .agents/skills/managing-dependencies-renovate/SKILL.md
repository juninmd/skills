---
name: managing-dependencies-renovate
description: Secure dependency update automation (npm, pip, docker) with auto-merge for non-breaking patches.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[repo/file] [options]"
---

# Operations with Renovate (Dependency Bot)

This skill orchestrates continuous code "cleanup", keeping dependencies always secure and up-to-date.

## Instructions
1.  **Configuration (Config as Code):** `renovate.json` MUST be at the root.
    *   **Extends:** `config:base`, `schedule:nonOfficeHours`, `:prHourlyLimit2`.
2.  **Auto-Merge (Safe Updates):** Automate `patch` and `minor` updates for dev dependencies and internal libs, as long as the CI passes.
    *   **Condition:** `packageRules: [{ "matchUpdateTypes": ["minor", "patch"], "automerge": true }]`
3.  **Vulnerability Fixes:** Maximum priority for security updates.
    *   **Condition:** `vulnerabilityAlerts: { "enabled": true, "automerge": true }`
4.  **Pin Versions:** Pin exact versions in `package.json` and `requirements.txt` (without `^` or `~`).
    *   **Rationale:** Prevents builds from "breaking out of nowhere" (determinism).

## Example: Standard `renovate.json`
```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:base",
    ":rebaseStalePrs",
    ":prHourlyLimitNone"
  ],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch", "pin", "digest"],
      "automerge": true,
      "matchPackagePatterns": ["*"]
    },
    {
      "matchDepTypes": ["devDependencies"],
      "automerge": true
    }
  ],
  "rangeStrategy": "pin"
}
```

## Troubleshooting
*   **Renovate Stuck:** Check the Renovate Dashboard (issue in the repo).
*   **Configure Ignore:** If an update breaks, add `"ignoreDeps": ["package-name"]`.
