# React Native Setup and Checklist

Procedures for initializing and verifying Expo projects.

## 1. Project Initialization
```bash
# 1. Create app
npx create-expo-app@latest my-app --template blank-typescript
cd my-app

# 2. Install core deps
npx expo install expo-router react-native-safe-area-context react-native-screens expo-image react-native-reanimated react-native-gesture-handler
```

## 2. Project Setup Checklist
- [ ] Configure `tsconfig.json` path aliases.
- [ ] Set `EXPO_PUBLIC_API_URL` environment variables.
- [ ] Ensure `GestureHandlerRootView` is in the root layout.
- [ ] Use `contentInsetAdjustmentBehavior="automatic"` for all scroll views.

## 3. Shipping Checklist
- [ ] Profile in `--profile` mode; fix frames > 16ms.
- [ ] Analyze bundle size; remove barrel imports.
- [ ] Enable R8 for Android release builds.
- [ ] Implement Unit and Maestro E2E tests for critical flows.
