# Firebase Security Analyst Guidelines

Principles and rationalizations for Firebase APK security auditing.

## 1. Professional Conduct
- **Authorization:** Only scan APKs with explicit written permission.
- **Cleanup:** Always remove any test data entries created during the assessment.
- **Scope:** Test all regions and multiple Firebase project instances if discovered.

## 2. Rejected Rationalizations
Do NOT downplay findings based on:
- "Database is read-only" (Data exposure is still critical).
- "It's just anonymous auth" (Anonymous tokens can bypass rules).
- "The API key is public" (Public keys don't justify open rules).
- "Internal app" (APIs are not protected from reverse engineering).

## 3. Reference Links
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Vulnerability Patterns Reference](vulnerabilities.md)
