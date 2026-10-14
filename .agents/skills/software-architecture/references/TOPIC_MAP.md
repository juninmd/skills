# software-architecture Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `deep-modules/codebase-design.md` | Deep-module vocabulary (module, interface, seam, adapter, depth), the deletion test, deepening by dependency category: [codebase-design](deep-modules/codebase-design.md); find candidates with [improve-codebase-architecture](deep-modules/improve-codebase-architecture.md) (Matt Pocock, MIT; see [UPSTREAM.md](deep-modules/UPSTREAM.md)) |
| `deep-modules/DEEPENING.md` | Deepening one cluster given its dependencies: dependency categories, seams, adapters: [DEEPENING](deep-modules/DEEPENING.md) |
| `deep-modules/DESIGN-IT-TWICE.md` | Exploring alternative interfaces for a deepened module with parallel sub-agents: [DESIGN-IT-TWICE](deep-modules/DESIGN-IT-TWICE.md) |
| `deep-modules/HTML-REPORT.md` | Writing the architecture review as an HTML report with Mermaid diagrams: [HTML-REPORT](deep-modules/HTML-REPORT.md) |
| `design-principles.md` | Clean Code/SOLID/DRY/KISS/YAGNI, plus the Clean Architecture dependency rule, accidental-vs-essential coupling, and bounded contexts: [design-principles](design-principles.md) |
| `distributed-architecture.md` | Designing a new distributed system: bounded-context decomposition, messaging pattern/broker choice, resilience patterns (circuit breaker, retry, DLQ), and the recommended stack: [distributed-architecture](distributed-architecture.md) |
| `distributed-toolkit.md` | Looking up what a specific distributed-systems tool or pattern does (Kafka, RabbitMQ, Resilience4j, Istio, Saga, Outbox) before picking one for a design: [distributed-toolkit](distributed-toolkit.md) |
| `domain-modeling.md` | A naming collision, a term the business uses that the code doesn't, or drift between two types that already mean the same thing, before writing a glossary entry: [domain-modeling](domain-modeling.md) |
| `electron-architecture.md` | Splitting a new or growing Electron app into main/renderer/preload layers and deciding which layer owns a capability, before any nodeIntegration/contextIsolation/sandbox flag is set: [electron-architecture](electron-architecture.md) |
| `intake-templates.md` | Filling out an architecture design request or a distributed-system health report for a new service proposal or a status readout: [intake-templates](intake-templates.md) |
| `main-process.md` | Structuring the Electron main process itself — window management, service DI, IPC handlers that only delegate, uncaughtException/unhandledRejection handling: [main-process](main-process.md) |
| `native-performance.md` | Wrapping a native CLI/OS call safely from the main process, or fixing Electron main/renderer/IPC performance (sync fs calls, unbatched IPC, unbounded lists): [native-performance](native-performance.md) |
| `project-structure.md` | Deciding or fixing a repo's directory layout — moving files, picking a stack's conventional structure, or escalating a flat folder into feature folders: [project-structure](project-structure.md) |
| `real-world-cases.md` | Bounded-context violations, anti-corruption layers, premature monolith splits, and the ADR lifecycle: [real-world-cases](real-world-cases.md) |
| `renderer-patterns.md` | Writing renderer-side UI code that talks to Electron IPC — abstracting it behind a service, avoiding listener leaks, or optimizing change detection under high-frequency IPC: [renderer-patterns](renderer-patterns.md) |
| `security.md` | Checking or hardening Electron security settings (contextIsolation, nodeIntegration, sandbox), exposing a safe preload API, or preventing IPC input/command injection: [security](security.md) |
