# ios-engineering Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `ios-guide.md` | Starting or auditing an iOS app end-to-end against Apple HIG — layout, typography, navigation, privacy checklist |
| `swift-coding-standards.md` | Writing or reviewing Swift for optional-safety, naming, protocol-oriented design, value vs reference types, concurrency, memory/retain cycles, or error-handling conventions |
| `swiftui-design-guidelines.md` | Designing a SwiftUI screen and need HIG layout, Dynamic Type, Dark Mode, Liquid Glass, navigation, forms, or loading-state guidance |
| `uikit-components.md` | Building a UIKit screen with stack views, buttons, alerts, search controllers, or context menus |
| `layout-system.md` | Laying out a UIKit screen with Auto Layout, safe areas, touch targets, or UICollectionView compositional layout |
| `system-integration.md` | Integrating iOS permissions (camera/photos/location), share sheet, app lifecycle, background tasks, or haptic feedback |
| `metal-shader.md` | Writing or optimizing Metal shaders / GPU rendering on Apple platforms (TBDR architecture, PBR, ray tracing, GPU profiling) |

## Shared with mobile-engineering

Accessibility, state management, navigation patterns shared across frameworks, offline/networking, localization, privacy/security process, and testing strategy are cross-platform concerns owned by `mobile-engineering`'s references — open those there instead of duplicating here.

## Reading Rule

Search headings first on large files: `rg -n "^##|^###|<term>" references/<file>.md`, then read only the relevant section. `swift-coding-standards.md` and `swiftui-design-guidelines.md` are the largest; search before reading in full.
