# Electron Security Best Practices

Critical security configurations and patterns for Electron applications.

## 1. Core Security Settings
- **contextIsolation: true** (Mandatory)
- **nodeIntegration: false** (Mandatory)
- **sandbox: true** (Recommended)
- **enableRemoteModule: false** (Deprecated, ensure it's not used)

## 2. Safe IPC with Preload Scripts
Never expose raw `ipcRenderer` to the renderer. Use `contextBridge` to expose a limited API.

```typescript
// preload.ts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  invokeTask: (data) => ipcRenderer.invoke("task:run", data),
  onUpdate: (callback) => ipcRenderer.on("task:update", (_, val) => callback(val)),
});
```

## 3. Input Validation
Validate ALL data received via IPC handlers. Treat the renderer as untrusted.

## 4. Command Injection Prevention
When executing shell commands or native tools, use `spawn` with an arguments array rather than a single command string to prevent shell injection.
