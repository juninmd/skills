# React Native Best Practices and Stack

Guidelines for building modern cross-platform mobile apps with React Native.

## 1. Recommended 2026 Stack
- **Framework:** **Expo SDK** + EAS Build/Update.
- **Routing:** **Expo Router** (file-based).
- **Server State:** **TanStack Query** (fetching, caching, synchronization).
- **Client State:** **Zustand** (lightweight global state).
- **UI/Styling:** **NativeWind** (Tailwind for RN) or **Tamagui**.
- **Testing:** Jest + React Native Testing Library + Maestro (E2E).

## 2. Core Implementation Patterns
- **Navigation:** Use `(tabs)`, `(stack)`, and `[id].tsx` patterns in Expo Router.
- **Data Fetching:** Isolate hooks for server state (e.g., `useUserQuery`).
- **Performance:** Memoize expensive callbacks with `useCallback` and values with `useMemo`.
- **Platform Specifics:** Use `Platform.select` or `.ios.tsx` / `.android.tsx` file extensions for specific logic.

## 3. Testing and Debugging
- **Unit:** Test logic and hooks in isolation.
- **Integration:** Test component interactions with `fireEvent` and `waitFor`.
- **E2E:** Use Maestro for high-level automated user flows.

## References
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
