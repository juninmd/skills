# React Native and Expo Best Practices

Guidelines for high-performance cross-platform development.

## 1. Component Preferences

| Purpose | Use | Instead of |
|---------|-----|------------|
| Lists | `FlashList` + `memo` items | `FlatList` |
| Images | `expo-image` | RN `<Image>` |
| Press | `Pressable` | `TouchableOpacity` |
| Animations | `Reanimated 3` | RN `Animated` |
| Gestures | `Gesture Handler` | `PanResponder` |

## 2. State Management Strategy
- **Local:** `useState` / `useReducer`.
- **Global:** **Zustand** or **Jotai**.
- **Server:** **React Query** (TanStack).
- **Forms:** **React Hook Form** + **Zod**.

## 3. Performance and Animation Rules
- **Animations:** Only animate `transform` and `opacity` to ensure GPU acceleration.
- **Lists:** Use `FlashList` for lists with > 20 items.
- **Imports:** Always import directly from source; avoid barrel files to prevent bundle bloat.
- **Rendering:** Use `{count > 0 && <Text />}` to avoid rendering "0" unexpectedly.
