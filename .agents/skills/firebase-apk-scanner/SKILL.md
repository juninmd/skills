---
name: firebase-apk-scanner
description: |
  **SECURITY SKILL** - Scan Android APKs for Firebase security misconfigurations.
  USE FOR: Firebase security auditing, APK decompilation (apktool), extracting Firebase URLs/keys, testing Firestore/RTDB/Storage rules.
  DO NOT USE FOR: unauthorized penetration testing, non-Android targets (iOS/Web), general Firebase backend development.
  INVOKES: scanner.sh, apktool, curl, grep.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Android, Linux (for scanner)"
allowed-tools: [run_shell_command, read_file]
---

# Firebase APK Security Scanner

Expert methodology for identifying and reporting Firebase security vulnerabilities in Android applications through automated scanning and manual analysis.

**USE FOR:**
- Extracting Firebase project IDs, API keys, and database URLs from APKs.
- Auditing authentication security (open signup, anonymous auth, email enumeration).
- Testing for unauthenticated read/write access to Firestore, Realtime Database, and Storage.
- Enumerating Cloud Functions and checking for unprotected access.
- Validating Firebase security posture during mobile app assessments.

**DO NOT USE FOR:**
- Scanning applications without explicit authorization.
- Testing production environments without prior written consent.
- Extraction tasks where no security evaluation is required.

**INVOKES:**
- `apktool`, `scanner.sh`, `curl` for endpoint validation.

## Methodology and Guidelines
Implementation details for the scanning workflow and analyst standards are documented in:
1. [Scanner Workflow & Manual Testing](references/scanner-workflow.md)
2. [Security Analyst Guidelines](references/scanner-guidelines.md)
3. [Vulnerability Patterns Reference](references/vulnerabilities.md)

## Core Principles
1. **Safety:** Preserve extracted evidence; avoid destructive operations unless approved.
2. **Thoroughness:** Test all discovered regions and project instances.
3. **Hygiene:** Clean up all test entries created during the validation process.

## Checklist
- [ ] Confirm written authorization and APK scope before starting the scan.
- [ ] Verify that the scanner script correctly identifies the Firebase configuration.
- [ ] Validate every finding with a repeatable proof-of-concept (curl command).
- [ ] Ensure all test data is removed before finalizing the report.
