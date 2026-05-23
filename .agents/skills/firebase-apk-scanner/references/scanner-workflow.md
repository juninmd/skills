# Firebase Scanner Workflow and Manual Testing

Detailed procedures for automated and manual Firebase security assessments.

## 1. Automated Scan Workflow
1. **Validate Input:** Verify the target APK exists. `ls -la $ARGUMENTS`.
2. **Execute Scanner:** Run `{baseDir}/scanner.sh $ARGUMENTS`.
3. **Analyze Results:** Read `firebase_scan_*/scan_report.txt` and summarize metrics, extracted config, and vulnerabilities found.

## 2. Manual Testing Procedures
If the scanner fails, perform manual assessment:
- **Decompile:** `apktool d -f -o ./decompiled $APK`.
- **Extract Config:** Search for `google-services.json`, `firebaseio.com`, `appspot.com`, or `AIza` strings in resources and assets.
- **Test Auth:** Use `curl` to test open signup and anonymous auth endpoints with extracted API keys.
- **Test DB/Storage:** Use `curl` to check for unauthenticated read/write access to Firestore, RTDB, and Storage buckets.
- **Remote Config:** Check for exposed configurations via `firebaseremoteconfig.googleapis.com`.

## 3. Severity Classification
- **CRITICAL:** Unauthenticated DB/Storage write, open signup on private apps.
- **HIGH:** Anonymous auth enabled, bucket listing, collection enumeration.
- **MEDIUM:** Email enumeration, accessible cloud functions.
- **LOW:** Non-sensitive information disclosure.
