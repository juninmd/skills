# iOS Guide

Design principles, implementation checklist, and component reference for Apple platforms.

## Design Principles

Foundational rules for layout, typography, and accessibility on iOS.

### Layout and Spacing
- **Safe Area:** Always keep content within safe area boundaries.
- **Touch Targets:** Minimum 44pt x 44pt for all interactive elements.
- **Grid:** Use 8pt spacing increments (8, 16, 24, 32).
- **Hierarchy:** Place primary actions in the "thumb zone" (bottom half).

### Typography and Color
- **Dynamic Type:** Support scaling via `preferredFont` (UIKit) or semantic styles (SwiftUI).
- **Semantic Color:** Use system colors (`.label`, `.systemBackground`) to ensure Dark Mode support.
- **Contrast:** Maintain ≥ 4.5:1 ratio for normal text.

### Navigation and Privacy
- **Gestures:** Never override standard system gestures (e.g., back swipe).
- **Permissions:** Request access only in context, never at launch.
- **Authentication:** Support "Sign in with Apple" if other providers are used.

## Implementation Checklist

Standards for verifying iOS app quality and system integration.

### Layout & Typography
- [ ] Touch targets ≥ 44pt.
- [ ] Content respects safe areas and 8pt grid.
- [ ] Dynamic Type supported up to accessibility sizes without truncation.

### Colors & Accessibility
- [ ] Dark Mode is intentional and uses semantic colors.
- [ ] VoiceOver labels present on all interactive elements.
- [ ] Reading order is logical; Bold Text preference respected.

### Navigation & Privacy
- [ ] Tab bar for top-level navigation; no hamburger menus.
- [ ] Back swipe works throughout the application.
- [ ] Permissions requested in-context with custom explanation.
- [ ] ATT prompt shown if tracking; Sign in with Apple available.

### System Integration
- [ ] App handles background/interruption state gracefully.
- [ ] Share Sheet available for shareable content.
- [ ] Content indexed for Spotlight where applicable.

## Component Reference (UIKit and SwiftUI)

Standard UI components and their use cases on Apple platforms.

### UIKit Components
- **Navigation:** `UITabBarController` (sections), `UINavigationController` (drill-down).
- **Lists:** `UICollectionView` + `DiffableDataSource`.
- **Layout:** `UICollectionViewCompositionalLayout`, `UIStackView`.
- **Feedback:** `UIImpactFeedbackGenerator`, `UIAlertController`.
- **Buttons:** `UIButton.Configuration`.

### SwiftUI Components
- **Navigation:** `TabView`, `NavigationStack` + `NavigationPath`.
- **Lists:** `List` + `.insetGrouped`.
- **Interaction:** `.sheet` + `presentationDetents`, `.contextMenu`, `.alert`.
- **Search:** `.searchable`.
- **Feedback:** `ShareLink`, `LocationButton`, `ProgressView`.
- **Environment:** `@Environment(\.scenePhase)`, `@Environment(\.dynamicTypeSize)`.
