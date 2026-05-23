# Native Integration and Performance

Patterns for OS-level integration and optimizing Electron performance.

## 1. Native Integration Layer
Wrap CLI tools and OS APIs in dedicated wrappers in the Main process. Use `spawn` with timeouts and buffer limits.

```typescript
async function executeNative(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { timeout: 30000 });
    // ... handle stdout, stderr, and exit codes
  });
}
```

## 2. Performance Optimization
- **Main Process:** Avoid synchronous `fs` or IPC calls. Stream large data instead of loading into memory.
- **Renderer Process:** Use virtual scrolling for large lists. Lazy load modules.
- **IPC:** Batch small messages into larger ones if frequency is high. Debounce renderer events.

## 3. Error Handling Strategy
Define custom error types (ValidationError, NativeError) and return structured error objects over IPC: `{ success: false, error: "MESSAGE", code: "CODE" }`.
