---
name: architecting-electron
description: "Main/Renderer IPC, native modules. Triggers: IPC, preload."
argument-hint: "[component/feature] [layer]"
---

# Architecting Electron Applications

## Objective
Build secure, performant, scalable Electron desktop applications with clean architecture separating Main Process, Renderer Process, and Native Integration layers.

## When to Use This Skill
- Designing new Electron applications
- Code reviewing Electron architecture for security and performance
- Implementing Main Process (Node.js) services and IPC
- Building Renderer Process UI (Angular, React, Vue)
- Integrating native tools (AppleScript, shell commands, system APIs)
- Optimizing Electron performance and resource management
- Implementing error handling and resilience patterns
- Setting up logging and observability in Electron apps

## Application Structure

### Three-Layer Architecture
```
┌─────────────────────────────────────────────────┐
│         Electron Application                     │
├─────────────────────────────────────────────────┤
│  Main Process (Node.js) - Browser & Window Mgmt │
│  ├─ Services (business logic)                   │
│  ├─ IPC Handlers (message routing)             │
│  ├─ Window Management                          │
│  └─ System Integration (files, permissions)    │
├─────────────────────────────────────────────────┤
│  Renderer Process (Angular/React/Vue) - UI      │
│  ├─ Components                                  │
│  ├─ Services (RxJS, hooks)                      │
│  ├─ IPC Senders (message to Main)              │
│  └─ State Management                           │
├─────────────────────────────────────────────────┤
│  Native Integration Layer - OS Integration     │
│  ├─ AppleScript / PowerShell                    │
│  ├─ System CLIs (exiftool, etc.)               │
│  ├─ OS APIs (file system, system info)         │
│  └─ Error handling & timeouts                  │
└─────────────────────────────────────────────────┘
```

## Flow

### 1. Main Process Architecture

**Principles:**
- Separate concerns: window management, services, IPC, system integration
- Use Dependency Injection (InversifyJS, TypeDI)
- No business logic in IPC handlers
- All async operations with proper error handling and cleanup
- Centralized logging

**Structure Example:**
```
src/
  main/
    index.ts                 # Entry point
    app/
      application.ts       # App lifecycle
      window-manager.ts    # Window management
    services/
      order-service.ts     # Business logic
      file-service.ts
      export-service.ts
    ipc/
      ipc-handlers.ts      # IPC routing
      order-ipc.ts
      file-ipc.ts
    native/
      exiftool-wrapper.ts  # Native integrations
      applescript-wrapper.ts
    config/
      di-container.ts      # DI setup
```

**Best Practices:**
```typescript
// ✅ GOOD: Separation of concerns
class OrderService {
  constructor(private repo: IRepository<Order>) {}
  async createOrder(data: CreateOrderDto): Promise<Order> {
    // Business logic here
  }
}

// ✅ GOOD: IPC handler delegates to service
ipcMain.handle("order:create", async (event, data) => {
  const orderService = container.get<OrderService>(OrderService);
  return await orderService.createOrder(data);
});

// ❌ WRONG: Business logic in IPC handler
ipcMain.handle("order:create", async (event, data) => {
  const order = new Order(data);
  // Validation and calculations here...
  return order;
});
```

### 2. Exception & Error Handling (Main Process)

**Critical Pattern:**
```typescript
// Listen for uncaught exceptions and unhandled rejections
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception", { error: error.message, stack: error.stack });
  // Optionally restart app or graceful shutdown
});

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  logger.error("Unhandled Promise Rejection", { reason, promise });
});

// Handle IPC errors gracefully
ipcMain.handle("risky-operation", async (event, data) => {
  try {
    const result = await riskyOperation(data);
    return { success: true, data: result };
  } catch (error) {
    logger.error("Operation failed", { error });
    return { success: false, error: error.message };
  }
});
```

### 3. Security Requirements

**Main Process:**
- ✅ Enable context isolation: `contextIsolation: true`
- ✅ Disable remote module: `enableRemoteModule: false`
- ✅ Sandbox renderer: `sandbox: true`
- ✅ Validate all IPC messages from renderer
- ✅ Never expose sensitive filesystem operations to renderer
- ✅ Never execute shell commands with unsanitized input
- ✅ Use `preload.ts` to safely expose Main→Renderer APIs

**Preload Script Example:**
```typescript
// preload.ts - SAFE window object for renderer
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: (options: any) => ipcRenderer.invoke("file:open", options),
  onOrderUpdate: (callback: (order: Order) => void) =>
    ipcRenderer.on("order:updated", (_, order) => callback(order)),
  removeListen: (channel: string) => ipcRenderer.removeAllListeners(channel),
});
```

**Main Window Setup:**
```typescript
const mainWindow = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,      // Critical for security
    enableRemoteModule: false,
    sandbox: true,
    preload: path.join(__dirname, "preload.js"),
    nodeIntegration: false,      // Never enable
  },
});
```

### 4. Async/Await & Promise Handling

**Patterns:**
```typescript
// ✅ GOOD: Proper async/await
async function loadData() {
  try {
    const data = await fetchData();
    mainWindow.webContents.send("data-loaded", data);
  } catch (error) {
    logger.error("Failed to load data", { error });
    mainWindow.webContents.send("data-error", error.message);
  }
}

// ✅ GOOD: Async IPC handler
ipcMain.handle("long-operation", async (event, input) => {
  return await performLongOperation(input);
});

// ❌ WRONG: Fire-and-forget async
ipcMain.on("dangerous", (event, data) => {
  performOperation(data); // Promise ignored!
});

// ❌ WRONG: Unhandled rejection
loadData(); // Not awaited, error will go to unhandledRejection listener
```

### 5. Renderer Process (Angular/React)

**Architecture:**
```
features/
  orders/
    components/
      order-list.component.ts
      order-detail.component.ts
    services/
      order.service.ts         # Handles IPC + business logic
    store/
      order.store.ts           # State management
    types/
      order.types.ts
```

**Service Pattern with IPC:**
```typescript
// ✅ GOOD: Service abstracts IPC
@Injectable({
  providedIn: "root"
})
export class OrderService {
  constructor(private http: HttpClient) {}

  async createOrder(order: Order): Promise<Order> {
    try {
      const result = await window.electronAPI.createOrder(order);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      this.logger.error("Create order failed", error);
      throw new ValidationError("Failed to create order");
    }
  }

  subscribeToUpdates(): Observable<Order> {
    return new Observable(observer => {
      window.electronAPI.onOrderUpdate((order: Order) => {
        observer.next(order);
      });

      return () => {
        window.electronAPI.removeListen("order:updated");
      };
    });
  }
}
```

### 6. RxJS & Subscription Management (Angular)

**Memory Leak Prevention:**
```typescript
// ✅ GOOD: Automatic unsubscribe with takeUntil
export class OrderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  orders$ = this.orderService.getOrders();

  ngOnInit() {
    this.orders$
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => this.displayOrders(orders));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ✅ GOOD: Using async pipe (automatic unsubscribe)
export class OrderListComponent {
  orders$ = this.orderService.getOrders();

  constructor(private orderService: OrderService) {}
}

// Template automatically unsubscribes when component destroys
```

### 7. Native Integration Layer

**Pattern for Wrapped Native Commands:**
```typescript
// native-integration.ts
interface NativeCommand {
  command: string;
  args: string[];
  timeout?: number;
}

async function executeNativeCommand(cmd: NativeCommand): Promise<string> {
  const { command, args, timeout = 30000 } = cmd;

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      timeout,
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Command failed: ${stderr}`));
      }
    });

    child.on("error", (error) => {
      reject(new Error(`Command execution failed: ${error.message}`));
    });
  });
}

// Wrapper for specific tools
export async function getImageMetadata(filePath: string): Promise<ImageMetadata> {
  try {
    const json = await executeNativeCommand({
      command: "exiftool",
      args: ["-json", filePath],
      timeout: 10000,
    });

    return JSON.parse(json)[0];
  } catch (error) {
    logger.error("Exiftool failed", { filePath, error });
    throw new NativeIntegrationError("Failed to extract metadata");
  }
}
```

### 8. Error Handling Strategy

**Error Types:**
```typescript
class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
  }
}

class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

class NativeIntegrationError extends ApplicationError {
  constructor(message: string) {
    super(message, "NATIVE_INTEGRATION_ERROR", 500);
  }
}

class ServiceUnavailableError extends ApplicationError {
  constructor(message: string) {
    super(message, "SERVICE_UNAVAILABLE", 503);
  }
}
```

**IPC Error Response:**
```typescript
ipcMain.handle("operation", async (event, data) => {
  try {
    const result = await performOperation(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      };
    }
    logger.error("Unexpected error", { error });
    return {
      success: false,
      code: "INTERNAL_ERROR",
      message: "An internal error occurred",
      statusCode: 500,
    };
  }
});
```

### 9. Performance Optimization

**Main Process:**
- ✅ No synchronous file operations: use `fs.promises`
- ✅ No synchronous IPC: always use `ipcMain.handle`
- ✅ Debounce high-frequency renderer → main events
- ✅ Stream large file operations
- ✅ Monitor memory usage; prevent leaks in long-running services
- ✅ Clean up event listeners on window close

**Renderer Process:**
- ✅ Virtual scrolling for large lists
- ✅ Use `trackBy` in ngFor loops
- ✅ OnPush change detection strategy
- ✅ Lazy load feature modules
- ✅ Optimize images; use WebP with fallback

## Code Review Checklist

**Security (🔴 BLOCKER if missing):**
- ✅ Context isolation enabled
- ✅ Remote module disabled
- ✅ All IPC messages validated
- ✅ No shell injection vulnerabilities
- ✅ Sensitive data not logged
- ✅ Preload script present and reviewed

**Architecture:**
- ✅ Clear separation: Main / Renderer / Native
- ✅ IPC handlers delegate to services
- ✅ Dependency injection configured
- ✅ Error handling comprehensive
- ✅ Logging includes context

**Async/Await:**
- ✅ All async operations have error handling
- ✅ No fire-and-forget promises
- ✅ Proper unsubscribe in Angular components
- ✅ Native commands have timeouts

**Performance:**
- ✅ No synchronous operations in main thread
- ✅ Large operations streamed
- ✅ Memory management verified
- ✅ Renderer optimized (virtual scroll, trackBy, etc.)

## Common Pitfalls

| Pitfall | Problem | Solution |
|---------|---------|----------|
| Missing `await` | Unhandled rejection | Always `await` async operations |
| Unhandled subscriptions | Memory leaks | Use `takeUntil` or `async` pipe |
| Mixing `.then()` with async/await | Confusing code | Use only async/await |
| Excessive IPC | Performance issues | Batch operations, debounce events |
| Angular change detection on IPC | Performance degradation | Use OnPush strategy |
| Unvalidated IPC messages | Security vulnerability | Validate all IPC data |
| Raw shell commands | Shell injection | Use `spawn` with array args |
| No error boundaries in renderer | Silent failures | Implement error boundaries |
| Stale UI state | Wrong data displayed | Refresh on focus/IPC update |
| Slow native commands | Frozen UI | Implement timeout + fallback |

## References & Further Learning

- [Electron Official Docs](https://www.electronjs.org/docs)
- [IPC Security](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model)
- [Native Node Modules](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules)
- [Angular Performance Guide](https://angular.io/guide/performance-best-practices)
- [RxJS Operators Docs](https://rxjs.dev/api)

