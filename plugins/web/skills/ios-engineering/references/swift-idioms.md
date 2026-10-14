# Modern Swift Idioms and Swift 6 Concurrency

Open when writing, reviewing, or modernizing Swift code for Swift 6 data-race safety, structured concurrency (`actors`, `TaskGroup`, `@MainActor`), generics (`some` vs `any`), Swift Testing, and ARC lifetime.

## Contents

- Value-Type Modeling Hierarchy
- Explicit Failure Paths and Optional Safety
- Swift 6 Data-Race Safety and Concurrency
- Structured Concurrency and Tasks
- Protocol Generics: `some` vs. `any`
- ARC Memory Management and Lifetime
- Modern Swift Testing Framework
- Migration Rules for Swift 6

## Value-Type Modeling Hierarchy

Swift favors progressive disclosure and immutable value semantics. Default to the simplest, most static construct:

| Modeling Need | Primary Choice | Escalate Only When |
|---|---|---|
| Domain Models & State | `struct` / `enum` | Identity, reference sharing, or inheritance is required (`class`) |
| Abstraction | Concrete Type | Duplication across multiple types demands polymorphism |
| Generics | `some Protocol` | Heterogeneous collections require runtime box (`any Protocol`) |
| Threading | Synchronous `@MainActor` | Profiling proves a blocking computation (`async` / background `actor`) |

```swift
// Prefer immutable value models with explicit domain enums
struct UserProfile: Sendable, Equatable {
    let id: UUID
    let username: String
    var role: UserRole
}

enum UserRole: Sendable, Codable {
    case member
    case administrator(permissions: Set<String>)
}
```

## Explicit Failure Paths and Optional Safety

1. **Forbid Force-Unwrapping:** Never use `!` on optionals outside `XCTest`/Swift Testing assertions.
2. **Early Binding with Guard:** Bind optionals at function entry to flatten nested scopes.
3. **Domain Error Types:** Define strongly-typed `Error` enums instead of throwing generic errors.

```swift
enum DataSyncError: Error, CustomStringConvertible {
    case networkUnavailable
    case parsingFailed(underlying: Error)
    case unauthorized

    var description: String {
        switch self {
        case .networkUnavailable: "Network connection is offline."
        case .parsingFailed(let err): "Failed to parse payload: \(err)"
        case .unauthorized: "Authentication token expired."
        }
    }
}
```

## Swift 6 Data-Race Safety and Concurrency

Under Swift 6 complete concurrency checking, compiler checks enforce isolation boundaries at compile time:

### Actors and Global Actors

- **UI Isolation:** Mark SwiftUI views, view models, and UI coordinators with `@MainActor`.
- **Actor Boundaries:** Use custom `actor` types to protect isolated mutable state.

```swift
actor CacheManager<Key: Hashable & Sendable, Value: Sendable> {
    private var storage: [Key: Value] = [:]

    func value(for key: Key) -> Value? {
        storage[key]
    }

    func insert(_ value: Value, for key: Key) {
        storage[key] = value
    }
}
```

### The `Sendable` Contract

Types crossing concurrency domains must conform to `Sendable`:
- Value types (`struct`, `enum`) whose stored properties are all `Sendable` conform automatically.
- Classes can only be `Sendable` if they are `final`, contain only `let` immutable stored properties, or manage internal thread-safe synchronization via `@unchecked Sendable`.

## Structured Concurrency and Tasks

1. **Avoid Unstructured Tasks:** Disfavor `Task { ... }` inside loops or lifecycle callbacks; unstructured tasks decouple cancellation and error propagation.
2. **Task Cancellation Propagation:** Check `Task.isCancelled` or call `try Task.checkCancellation()` within loops during long-running async routines.
3. **Parallel Decomposition:** Use `withThrowingTaskGroup` for concurrent batch workloads.

```swift
func fetchAllUserAssets(ids: [UUID]) async throws -> [Asset] {
    try await withThrowingTaskGroup(of: Asset.self) { group in
        for id in ids {
            group.addTask {
                try Task.checkCancellation()
                return try await fetchAsset(id: id)
            }
        }

        var assets: [Asset] = []
        for try await asset in group {
            assets.append(asset)
        }
        return assets
    }
}
```

## Protocol Generics: `some` vs. `any`

- **Opaque Return Types (`some Protocol`):** Preserves concrete type identity at compile time with zero heap allocation overhead. Use for return types and generic parameters.
- **Existential Boxes (`any Protocol`):** Incurs dynamic dispatch and heap box allocations. Reserve strictly for heterogeneous collections where different concrete implementations must share a container.

```swift
// Fast, static dispatch:
func renderComponent(view: some View) -> some View {
    view.padding()
}

// Dynamic heterogeneous container:
let heterogeneousWidgets: [any WidgetPlugin] = [TextWidget(), ChartWidget()]
```

## ARC Memory Management and Lifetime

1. **Closure Capture Lists:** Capture `[weak self]` in long-lived escaping closures, async streams, or NotificationCenter observers to avoid retain cycles.
2. **Avoid `[unowned self]`:** If the captured instance can deallocate before the closure fires (e.g. network callbacks), `unowned` crashes at runtime. Always prefer `[weak self]` with `guard let self else { return }`.

```swift
final class OrderViewModel: ObservableObject {
    @MainActor
    func observeOrders(from service: OrderService) {
        service.onOrderReceived = { [weak self] order in
            guard let self else { return }
            self.process(order)
        }
    }
}
```

## Modern Swift Testing Framework

Use `import Testing` instead of legacy `XCTest`:

```swift
import Testing

@Suite("Order Processing Tests")
struct OrderProcessingTests {

    @Test("Valid order calculates total tax correctly")
    func testTaxCalculation() throws {
        let order = Order(amount: 100.0, state: "CA")
        #expect(order.calculateTax() == 7.25)
    }

    @Test("Negative amount throws invalid argument error")
    func testInvalidAmount() {
        #expect(throws: OrderError.negativeAmount) {
            try Order(amount: -10.0, state: "NY").validate()
        }
    }
}
```

## Migration Rules for Swift 6

- Enable `StrictConcurrency=complete` in target build settings incrementally.
- Eliminate mutable globals; encapsulate global constants in `enum` namespaces as `static let`.
- Annotate callbacks that execute on the main run loop with `@MainActor (@Sendable () -> Void)`.
- Replace legacy completion handlers with `async`/`await` wrappers via `withCheckedThrowingContinuation`.
