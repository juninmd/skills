# Signature ledger

A small JSON file in the session temp directory (never in the repository), keyed by the signature `scripts/signatures.mjs` prints. It lets `signatures.mjs --ledger` tell NEW from KNOWN and survives context compaction.

## Contents
- Row shape
- Statuses
- Closing a row

## Row shape
```json
{
  "ERROR worker <n> failed job <id>: timeout after <n>s": {
    "status": "fixed",
    "class": "own-defect",
    "firstSeen": "2026-10-21T10:00Z",
    "fix": "commit or PR reference",
    "evidence": "absent across 2 cron cycles after version abc1234"
  }
}
```

## Statuses

| Status | Meaning | Counts toward clean window |
|---|---|---|
| `new` | Seen, not yet looked at | Blocks |
| `diagnosing` | Classified, reproduction in progress | Blocks |
| `fixed` | Fix shipped and verified across its trigger | Does not block |
| `benign` | Known noise, reason recorded | Does not block |
| `external` | Dependency or environment limit, hypothesis recorded | Reported, does not block |
| `reopened` | Reappeared after `fixed` | Blocks; counts against the thrash guard |

## Closing a row
Set `fixed` only with an `evidence` line naming the version that was running and the trigger that was exercised. A row closed on "no errors lately" is `new` again the next time the trigger fires.
