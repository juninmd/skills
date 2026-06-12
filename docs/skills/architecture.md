# Architecture Skills

Skills for system design, distributed systems, and specialized application architectures.

## `architecting-distributed-systems`

**Invoke:** `/architecting-distributed-systems`

Microservices, message queues, and distributed system patterns.

**Patterns covered:**
- Service decomposition (DDD bounded contexts)
- Saga pattern for distributed transactions
- CQRS and Event Sourcing
- Circuit breaker and bulkhead
- API Gateway and BFF (Backend for Frontend)
- Service mesh (Istio, Linkerd)

**Message queues:** RabbitMQ, Kafka, AWS SQS/SNS — producer/consumer patterns, dead letter queues, retry policies, ordering guarantees.

---

## `architecting-electron`

**Invoke:** `/architecting-electron`

Electron desktop application architecture.

**Three-layer model:**
- **Main Process** — Node.js, OS APIs, file system, native menus
- **Renderer Process** — Chromium, React/Vue UI, isolated context
- **Native Layer** — C++ addons, OS integration via `node-gyp`

**Security:** context isolation, `contextBridge` for IPC, no `nodeIntegration` in renderer, CSP headers.

**Covers:** IPC communication patterns, auto-updater, code signing, notarization (macOS), installer creation (electron-builder).

---

## `developing-ai-agents`

**Invoke:** `/developing-ai-agents`

Autonomous AI agents with tool calling and context management.

**Topics:**
- Agent loop design (observe → think → act)
- Tool definition and schema design
- Context window management and summarization
- Multi-agent orchestration
- Memory patterns (short-term, long-term, episodic)
- Prompt engineering for reliable tool use
- Evaluation and testing strategies for agents
- Guardrails and safety constraints

---

## `mcp-builder`

**Invoke:** `/mcp-builder`

Full MCP server build workflow — 4 phases:

1. **Research** — understand the domain and existing APIs
2. **Implementation** — build tools, resources, and prompts
3. **Review & Test** — validate tool schemas, test with MCP Inspector
4. **Evaluation** — measure real-world utility and iterate

---

## `spec-first-design`

**Invoke:** `/spec-first-design`

Validated temporary design specs and implementation plans before code changes.

**Covers:** context inspection, blocker-only clarification, one chosen design, executable implementation tasks, temporary specs in `temp/specs/YYYY-MM-DD-<topic>-design.md`, required spec and plan checklists, self-review, and spec deletion after implementation.
