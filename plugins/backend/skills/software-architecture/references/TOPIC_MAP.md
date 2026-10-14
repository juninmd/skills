# software-architecture Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| [deep-modules.md](deep-modules.md) | Deep-module architecture, interface depth vs. implementation, seam discipline, dependency categorization, and the deletion test |
| [interface-exploration.md](interface-exploration.md) | Exploring and comparing competing public interface candidates across depth, locality, and testing ergonomics |
| [architecture-reports.md](architecture-reports.md) | Generating standalone HTML architecture review reports with Mermaid diagrams and before/after comparisons |
| [architecture-refactor.md](architecture-refactor.md) | Scanning codebases for shallow modules, identifying architectural friction, and executing deepening workflows |
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
