# React Native Mobile Developer Skill

## Description
This skill enables the agent to develop cross-platform mobile applications using React Native. It focuses on building native-like experiences for iOS and Android from a single codebase.

## Workflow

### 1. Project Setup
- **Framework:** Prefer **Expo** (Managed workflow) for rapid development and OTA updates. Use CLI only if native modules require custom linking.
- **Routing:** Use **Expo Router** (File-based) or **React Navigation**.

### 2. Architecture & State
- **Server State:** Use **TanStack Query (React Query)** for API calls, caching, and loading states. Avoid managing API data in global store.
- **Client State:** Use **Zustand** for lightweight global state (theme, user preferences). Use **Redux Toolkit** only for complex transactional state.

### 3. UI Implementation
- **Styling:** Use **NativeWind** (Tailwind for RN) for rapid styling or **Tamagui** for performance and cross-platform consistency.
- **Components:** Prioritize `FlatList` (virtualized) over `ScrollView` for lists.

### 4. Testing & Debugging
- **Unit/Integration:** Use `Jest` and `React Native Testing Library`.
- **E2E:** Use `Maestro` (simpler YAML flows) or `Detox` (grey-box testing).
- **Debugger:** Use Flipper or React Native Debugger.

## Best Practices
- **Performance:** Memoize expensive calculations (`useMemo`) and callbacks (`useCallback`) to prevent re-renders.
- **Images:** Use `expo-image` for aggressive caching and performance.
- **Platform:** Use `Platform.select({ ios: ..., android: ... })` for OS-specific tweaks.
