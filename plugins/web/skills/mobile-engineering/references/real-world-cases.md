# Mobile Engineering Real-World Cases

Use this first for mobile UI, lifecycle, permissions, offline, and device work.

## Screen or Flow
- Identify platform, navigation owner, state source, async data, loading/error states, and minimum OS.
- Test first load, back navigation, rotation/resizing, background/foreground, and process restoration.
- Keep heavy work off the UI thread.

## Permissions or Native Capability
- Request permission only at the user-intent moment.
- Handle granted, denied, limited, revoked, and unavailable hardware states.
- Keep platform-specific code behind a narrow adapter.
- Test simulator/emulator behavior and one real-device path when capability risk is high.

## Offline or Sync
- Define source of truth, conflict policy, retry/backoff, and stale data display.
- Test airplane mode, partial sync, auth expiry, duplicate submission, and app restart.
- Avoid losing user edits on navigation or process death.

| Conflict pattern | Resolution |
|---|---|
| Same record edited on two devices while offline | Last-write-wins by server timestamp for low-stakes fields; field-level merge when the edits touch different fields; a manual-merge prompt when both changed the same field |
| A queued mutation targets a record deleted server-side | Reject the queued item explicitly and tell the user what did not apply — never drop it silently |
| Two queued mutations for the same record on the same device | Collapse to the latest before sync; replaying both can resurrect a value the user already changed again |

Never resolve a conflict by discarding the local queue on sync failure — the user has no way to tell their edit was lost.

## Release Build Issue
- Reproduce in release/profile mode when debug mode hides the failure.
- Check signing, permissions, min SDK/iOS target, shrinker/obfuscation, assets, and native modules.
- Smoke install/launch plus the affected flow.
