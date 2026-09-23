---
name: ios-engineering
description: |
  Build and review native Apple-platform apps: Swift language conventions, SwiftUI and UIKit UI code, Metal shaders, WidgetKit widgets, and iOS system integration against Apple's Human Interface Guidelines. Use for Swift optionals/concurrency/memory, SwiftUI view design, UIKit screens and Auto Layout, Metal rendering, widgets, permissions, and App Store readiness.
---

# iOS Engineering

**Not this skill:** cross-platform (React Native, Expo, Flutter) or native Android work (`mobile-engineering`), web UI in a browser (`frontend-engineering`), and non-Apple GPU shaders (`threejs`).

## Preflight
```bash
xcodebuild -version 2>/dev/null; swift --version   # Xcode/toolchain present at all?
ls *.xcodeproj *.xcworkspace Package.swift 2>/dev/null   # project type
rg -n 'IPHONEOS_DEPLOYMENT_TARGET|platforms:' project.pbxproj Package.swift 2>/dev/null | head   # minimum OS decides which APIs exist
```

## Workflow
1. Identify deployment target, UI framework (SwiftUI vs UIKit vs mixed), and concurrency model (async/await vs GCD/Combine legacy) before writing.
2. Design permissions and system integration contextually — request access only when the feature needs it, never at launch.
3. Write Swift with optional-safety, value types by default, and explicit ownership in closures (`weak`/`unowned`) to avoid retain cycles.
4. Build the UI against Apple HIG: safe areas, Dynamic Type, Dark Mode, 44pt touch targets, and Liquid Glass on iOS 26+.
5. For GPU work, default to `half` precision and function-constant specialization before reaching for a custom Metal pipeline.
6. Run SwiftLint/format, unit tests, a **release** build, and a physical-device smoke — the simulator fakes camera, biometrics, GPS, push, and thermal behavior.

## SwiftUI vs UIKit vs Metal

| Need | Use | Why |
|---|---|---|
| New screen, standard iOS 15+ target | SwiftUI | Less code, HIG defaults built in, previews |
| Legacy codebase, complex UICollectionView layout, or fine-grained animation control | UIKit | Compositional Layout and precise control SwiftUI still lacks in places |
| Custom GPU rendering, real-time visualization, particle/PBR effects | Metal (often hosted in an `MTKView` inside SwiftUI/UIKit) | Neither UI framework does custom rendering |
| Home Screen / Lock Screen glanceable info | WidgetKit | Runs out-of-process on its own timeline, not the app's view hierarchy |

## Gotchas
- **Force unwrap `!` is a landing-page crash risk** — every optional is a `guard`/`if let`/nil-coalesce decision, not a `!`.
- **A missing `Info.plist` usage-description string is an instant, silent launch crash** on the first permission-gated API call — verify entitlements before debugging init order.
- **Retain cycles in closures**: any closure capturing `self` in a stored property (completion handler, delegate, Combine sink) needs `[weak self]` or it leaks the whole screen and its timers/observers.
- **`half` vs `float` in Metal**: TBDR GPUs are bandwidth-bound; defaulting to `float` everywhere silently doubles register pressure and kills tile occupancy. Reserve `float` for position/depth math.
- **WidgetKit runs on a timeline, not a live process** — state must be persisted (App Group container, `WidgetCenter.reloadTimelines`), not held in memory between refreshes.
- **Simulator lies about hardware behavior**: camera, biometrics, GPS, push delivery, thermal/battery throttling, and release-build (stripped/minified) behavior are only proven on a physical device.
- **SwiftUI previews and Simulator both mask release-only bugs** — minification, dead-code stripping, and Metal shader compilation differences only surface in a release build on hardware.

## Reference Routing
- The [topic map](references/TOPIC_MAP.md) is the entry point for this directory: pick the concern, read only the file it names.
- Cross-platform iOS concerns shared with Android/RN/Flutter (accessibility, state, navigation, offline/networking, testing, privacy) live in `mobile-engineering`'s references — this skill links out rather than duplicating them.

## Stop
- About to ship with a force-unwrap on data that can come back nil from the network, disk, or user input.
- Only a debug build or Simulator run was verified. Build release and run it on a device before shipping.
- A closure captures `self` without `weak`/`unowned` and outlives a short-lived screen.

## Rules
- Hand off React Native/Expo, Flutter, and native Android work to `mobile-engineering`; shared mobile concerns (navigation, state, offline, accessibility, localization, privacy, performance, testing) also live there — read the file, don't fork it here.
- Hand off web UI to `frontend-engineering` and non-Apple GPU/WebGL shaders to `threejs`.
- Nothing blocking the main thread: disk, JSON, image decode, and crypto move to a background task/actor.
- Code signing, provisioning, and entitlements live in CI with secrets out of the repository.
- Background execution is metered and killed by the OS — use `BGTaskScheduler`, assume the process dies mid-task, make work resumable.

## Checklist
- [ ] Deployment target, UI framework, and concurrency model identified before writing.
- [ ] No force-unwraps on values that can be nil from network/disk/user input.
- [ ] Every closure capturing `self` uses `weak`/`unowned` where lifetime isn't guaranteed.
- [ ] Permission usage-description strings declared for every requested capability.
- [ ] Touch targets ≥44pt, Dynamic Type and Dark Mode verified.
- [ ] Release build run on a physical device before shipping.
