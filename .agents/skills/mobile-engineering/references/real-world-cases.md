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

## Release Build Issue
- Reproduce in release/profile mode when debug mode hides the failure.
- Check signing, permissions, min SDK/iOS target, shrinker/obfuscation, assets, and native modules.
- Smoke install/launch plus the affected flow.
