---
name: react-native-dev
description: "React Native & Expo Guide for Designing mobile, Optimizing lists, Implementing GPU-accelerated via npx expo."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "iOS, Android, Expo"
allowed-tools: [read_file, write_file, replace]
---

# React Native & Expo Guide

Expert guide for building production mobile apps with React Native and Expo.

**USE FOR:**
- Designing mobile UIs with Expo Router.
- Optimizing lists with FlashList.
- Implementing GPU-accelerated animations with Reanimated 3.
- Managing server state with React Query.
- Configuring build pipelines with EAS.

**INVOKES:**
- `npx expo`, `eas build`, `maestro`.

## Methodology
Implementation details are in:
1. [Best Practices](references/react-native-best-practices.md) | [Setup](references/react-native-setup.md)
2. [Navigation](references/navigation.md) | [Components](references/components.md) | [Styling](references/styling.md)
3. [Animations](references/animations.md) | [State](references/state-management.md) | [Forms](references/forms.md)
4. [Networking](references/networking.md) | [Performance](references/performance.md) | [Testing](references/testing.md)
5. [Native Caps](references/native-capabilities.md) | [Engineering](references/engineering.md)

## Core Principles
1. **Performance:** Prioritize GPU animations and recycled lists.
2. **Efficiency:** Use direct imports to minimize bundle size.
3. **Platform:** Ensure responsive behavior on iOS/Android.

## Checklist
- [ ] Confirm Expo managed workflow vs. custom build.
- [ ] Use `FlashList` for lists with > 20 items.
- [ ] Ensure touch targets meet native requirements (44pt+).
- [ ] Handle all async states (loading/error) in UI.
