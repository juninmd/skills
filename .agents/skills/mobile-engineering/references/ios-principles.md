# iOS Core Design Principles

Foundational rules for layout, typography, and accessibility on iOS.

## 1. Layout and Spacing
- **Safe Area:** Always keep content within safe area boundaries.
- **Touch Targets:** Minimum 44pt x 44pt for all interactive elements.
- **Grid:** Use 8pt spacing increments (8, 16, 24, 32).
- **Hierarchy:** Place primary actions in the "thumb zone" (bottom half).

## 2. Typography and Color
- **Dynamic Type:** Support scaling via `preferredFont` (UIKit) or semantic styles (SwiftUI).
- **Semantic Color:** Use system colors (`.label`, `.systemBackground`) to ensure Dark Mode support.
- **Contrast:** Maintain ≥ 4.5:1 ratio for normal text.

## 3. Navigation and Privacy
- **Gestures:** Never override standard system gestures (e.g., back swipe).
- **Permissions:** Request access only in context, never at launch.
- **Authentication:** Support "Sign in with Apple" if other providers are used.
