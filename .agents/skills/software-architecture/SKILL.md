---
name: software-architecture
description: "Comprehensive guide for Software Architecture, Clean Code, Design Principles, and Distributed Systems."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Software Architecture & Design

Expert methodology for designing scalable systems and writing maintainable code. This skill unifies Clean Code practices, SOLID design principles, codebase architecture refactoring, and distributed systems design.

**USE FOR:**
- Applying Clean Code, SOLID, DRY, KISS, and YAGNI principles.
- Refactoring technical debt, reducing coupling, and untangling spaghetti code.
- Designing system boundaries, service interfaces, and modular architectures.
- Architecting distributed systems (Microservices, Event-Driven, Saga pattern).
- Improving testability and defining domain terminology.

**DO NOT USE FOR:**
- Specific framework implementations (use `backend-node`, `frontend-engineering`, etc.).
- DevOps pipeline creation (use `cloud-devops`).

**INVOKES:**
- Code reading and analysis tools.

## Core Principles
1. **Simplicity:** Favor the simplest solution that works. YAGNI (You Aren't Gonna Need It).
2. **High Cohesion, Low Coupling:** Modules should have a single responsibility and minimize dependencies.
3. **Understandability:** Code is read more often than written; optimize for the reader.
4. **Boundary Enforcement:** Protect domain logic from infrastructure and framework details (Clean Architecture).

## Implementation Guides
Refer to these specific domains for deep-dive instructions:
- [Clean Code & Refactoring](references/clean-code.md)
- [Design Principles (SOLID)](references/design-principles.md)
- [Codebase Architecture & Boundaries](references/architecture-refactoring.md)
- [Distributed Systems](references/distributed-systems.md)

## Checklist
- [ ] Ensure changes decrease overall system complexity.
- [ ] Validate that module boundaries are respected; no cross-domain leaking.
- [ ] Check if the code reads like well-written prose.
- [ ] For distributed systems, explicitly handle failure modes and eventual consistency.
