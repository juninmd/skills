---
name: mobile-engineering
description: |
  Build and review native iOS, native Android, React Native or Expo, and Flutter applications. Use for mobile UI, lifecycle, navigation, permissions, offline behavior, accessibility, device integration, tests, and builds.
---

# Mobile Engineering

## Preflight
```bash
adb devices || xcrun simctl list devices booted     # is there real hardware attached?
rg -n 'minSdk|IPHONEOS_DEPLOYMENT_TARGET' android/ ios/ | head
```

Minimum OS decides which APIs exist at all. Read it before designing anything around one.

## Workflow
1. Identify platform, framework and version, minimum OS, architecture, state and navigation approach, and build variants. Minimum OS decides which APIs exist at all.
2. Define lifecycle, permissions, offline behavior, deep links, accessibility, and device constraints **before** the UI.
3. Keep heavy work off the UI thread and make cancellation and retry explicit.
4. Test the state matrix below, not just the happy path.
5. Run formatter and analyzer, focused tests, a **release** build, and a physical-device smoke.

## The State Matrix
Mobile has more states than web because the OS is an adversary: it kills, rotates, revokes, and disconnects.

| State | Trigger | Must do |
|---|---|---|
| Loading / empty / error | normal | show, and be recoverable |
| Permission denied **permanently** | user picked "Don't ask again" | the OS stops prompting — deep-link into system settings |
| Offline | airplane mode, dead zone | queue or degrade, never spin forever |
| Background → foreground | app switch, call | resume without losing input |
| Process death | OS reclaims memory | restore from saved state, not from memory |
| Rotation / resize | device turn, split screen, foldable | keep state, re-lay out |
| Cold-start deep link | notification, link | restore the **full** back stack, not just the destination |

Process death is the one that gets skipped, and it is the one that produces "the app lost my form".

```bash
adb shell am kill <package>              # simulate process death (Android)
adb shell settings put global always_finish_activities 1
xcrun simctl terminate booted <bundleid> # iOS
```

## Simulator Lies About

| Capability | Why the simulator cannot tell you |
|---|---|
| Camera, biometrics, GPS | faked or absent |
| Push notifications | different delivery path |
| Thermal and battery throttling | desktop CPU, wall power |
| Real network conditions | loopback latency |
| Release-build behavior | minification, stripped symbols, optimizations |

Anything touching those is proven on hardware or not proven at all.

## Crash on Launch — Triage Order
1. Read the crash report first. Guessing before reading the stack costs an hour every time.
2. Reproduce on a **physical device**, not a simulator.
3. Verify declared platform permissions and entitlements — a missing usage-description string is an instant, silent launch crash on iOS.
4. Then check initialization order and native module linking.

## Reference Routing
- The [topic map](references/TOPIC_MAP.md) is the single entry point for this directory: pick the platform and concern there, then read only the files it names. Skip platform material the task does not need.

## Stop
- A capability the simulator fakes — camera, biometrics, GPS, push, thermal — is untested on hardware. It is unproven.
- Only a debug build was verified. Build release and run it on a device before shipping.
- Process death loses user input. Fix restoration before shipping; it is the state everyone skips.

## Rules
- Nothing blocking on the main thread: disk, JSON, image decode, and crypto move off it, or the frame budget is gone and the UI stutters visibly.
- Break retain cycles in every closure and delegate that captures self. A leaked screen keeps its timers, observers, and network callbacks running forever.
- Background execution is metered and killed. Use the platform's scheduled-work API, assume the process dies mid-task, and make the work resumable.
- Watch binary size per dependency — assets and duplicated native libraries dominate it, and app-store size limits are hard.
- Code signing, provisioning, and entitlements live in CI with secrets out of the repository. A signing mismatch surfaces only at install time, usually the day of the release.
- Release builds differ from debug in ways that break working code. Build release and run it on hardware before shipping.
- Delegate profiling methodology to `performance-engineering`, accessibility auditing to `accessibility`, and screen-state design to `ui-state-design`.

## Checklist
- [ ] Platform, minimum OS, and build variants identified before writing.
- [ ] Every row of the state matrix handled, process death included.
- [ ] Main thread free of blocking work; no retained screens.
- [ ] Deep link restores the full navigation stack from cold start.
- [ ] Binary size and permission declarations checked.
- [ ] Tests, a **release** build, and a physical-device smoke all pass.
