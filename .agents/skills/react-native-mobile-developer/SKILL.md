# React Native Mobile Developer Skill

## Description
This skill enables the agent to develop cross-platform mobile applications using React Native. It focuses on building native-like experiences for iOS and Android from a single codebase.

## Workflow

### 1. Project Setup & Configuration
- Initialize project using Expo or React Native CLI.
- Configure native modules and permissions (AndroidManifest.xml, Info.plist).
- Set up navigation (React Navigation).

### 2. UI Implementation
- Use core components (View, Text, Image, ScrollView, FlatList).
- Apply styling with StyleSheet or libraries like NativeWind/Tamagui.
- Handle different screen sizes and safe areas.

### 3. Logic & State Management
- Implement business logic and state management (Context API, Redux, Zustand).
- Handle side effects and API calls.
- Manage device features (Camera, Geolocation, Sensors).

### 4. Testing & Optimization
- Test on iOS Simulator and Android Emulator.
- Optimize performance (Memoization, InteractionManager).
- Debug using Flipper or React Native Debugger.

## Best Practices
- **Platform Specifics:** Use `Platform.select` or `.ios.js`/`.android.js` extensions for platform-specific code.
- **Performance:** Avoid anonymous functions in render, use `FlatList` for long lists, optimize images.
- **Navigation:** Structure navigation hierarchy logically (Stack, Tab, Drawer).
