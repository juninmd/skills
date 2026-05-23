---
name: ios-application-dev
description: |
  **DEVELOPMENT SKILL** - Build native iOS apps with Swift, SwiftUI, and UIKit.
  USE FOR: iOS dev, Swift, SwiftUI, UIKit, Auto Layout, iOS a11y, system integration.
  DO NOT USE FOR: hybrid/web mobile (Flutter/RN), Android, macOS-only features.
  INVOKES: xcodebuild, swift.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "iOS, iPadOS"
allowed-tools: [run_shell_command, read_file, write_file]
---

# iOS Application Development Guide

Expert guide for building high-performance iOS apps using Swift, SwiftUI, and UIKit.

**USE FOR:**
- Implementing interfaces with SwiftUI and Combine.
- Managing layouts using UIKit and SnapKit.
- Integrating system features like Haptics and Share Sheets.
- Hardening accessibility for VoiceOver and Dynamic Type.
- Configuring privacy manifests and permissions.

**DO NOT USE FOR:**
- Low-level kernel or driver development.

**INVOKES:**
- `swift`, `xcodebuild` CLI tools.

## Methodology
Implementation details are in:
1. [Components](references/ios-components.md) | [Principles](references/ios-principles.md) | [Checklist](references/ios-checklist.md)
2. [Swift](references/swift-coding-standards.md) | [SwiftUI HIG](references/swiftui-design-guidelines.md) | [Layout](references/layout-system.md)
3. [A11y](references/accessibility.md) | [Integration](references/system-integration.md) | [Metal](references/metal-shader.md)
4. [Graphics](references/graphics-animation.md) | [Navigation](references/navigation-patterns.md) | [UIKit Ref](references/uikit-components.md)

## Core Principles
1. **HIG:** Follow platform conventions and system gestures.
2. **Safety:** Request permissions in-context; handle Privacy.
3. **A11y:** Support VoiceOver and Dynamic Type by default.

## Checklist
- [ ] Verify touch targets meet 44pt minimum.
- [ ] Ensure semantic colors for Dark Mode.
- [ ] Validate accessibility labels on elements.
- [ ] Run test suite and linting before submitting.
