# Electron Main Process Architecture

Guidelines for building a secure and scalable Main Process.

## 1. Three-Layer Architecture
- **Main Process (Node.js):** Browser & Window Management, Services, IPC Handlers.
- **Renderer Process (UI):** Components, Services, State Management.
- **Native Integration:** OS-specific integration (shell, AppleScript, system APIs).

## 2. Main Process Principles
- **Separation of Concerns:** Keep window management, business logic (services), and IPC routing separate.
- **Dependency Injection:** Use tools like InversifyJS or TypeDI for service management.
- **IPC Delegation:** IPC handlers should only delegate to services, never contain business logic.

## 3. Window Management
Example of secure `BrowserWindow` setup:
```typescript
const mainWindow = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,
    sandbox: true,
    preload: path.join(__dirname, "preload.js"),
    nodeIntegration: false,
  },
});
```

## 4. App Lifecycle
Handle `uncaughtException` and `unhandledRejection` at the process level for resilience.
