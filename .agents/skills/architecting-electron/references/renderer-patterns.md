# Electron Renderer Patterns (Angular/React)

Best practices for building UIs that interact with Electron.

## 1. Service Abstraction
Abstract IPC calls behind frontend services. The UI components should not know they are talking to Electron.

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  async fetchData() {
    const result = await window.electronAPI.invokeTask('fetch');
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
}
```

## 2. Subscription Management
In Angular, use the `async` pipe or `takeUntil(destroy$)` patterns to prevent memory leaks from Electron event listeners.

## 3. State Management
Keep UI state in the renderer. Sync with Main only when necessary. Use OnPush change detection (Angular) to optimize performance during high-frequency IPC events.
