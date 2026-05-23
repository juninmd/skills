---
name: managing-serverless
description: |
  **ARCHITECTURE SKILL** - Design and optimize serverless and edge workloads.
  USE FOR: AWS Lambda, Cloudflare Workers, Vercel deployments, cold start optimization, event-driven architecture, serverless state management, idempotency patterns.
  DO NOT USE FOR: long-running background processes (non-FaaS), heavy JVM/CLR runtimes (unless unavoidable), managing VPC infrastructure (use managing-cloud-infrastructure).
  INVOKES: serverless client initialization, conditional data writes.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "AWS, Cloudflare, Vercel"
allowed-tools: [read_file, write_file]
---

# Managing Serverless Architecture

Expert methodology for designing, deploying, and optimizing serverless workloads with a focus on minimizing latency, ensuring idempotency, and leveraging edge computing.

**USE FOR:**
- Selecting the appropriate serverless platform (Lambda vs. Workers vs. Vercel).
- Implementing cold start reduction strategies through bundle optimization.
- Designing event-driven flows using queues and pub/sub triggers.
- Implementing robust idempotency patterns for "at-least-once" delivery.
- Configuring external state management for stateless function environments.

**DO NOT USE FOR:**
- Designing monolithic architectures or long-lived server processes.
- Low-level networking or cluster orchestration (use `managing-cloud-infrastructure`).

**INVOKES:**
- Function handler patterns and cloud-provider specific optimization checklists.

## Methodology and Guidelines
Implementation details for optimization, design patterns, and platform selection are documented in:
- [Serverless Architecture Patterns and Optimization](references/serverless-patterns.md)

## Core Principles
1. **Warm Initialization:** Always initialize expensive resources outside the handler.
2. **Idempotency by Default:** Every function must be safe to re-run with the same event.
3. **Dependency Discipline:** Minimize the function's deployment package to reduce spin-up time.

## Checklist
- [ ] Is global state (clients, configs) initialized outside the function handler?
- [ ] Does the function handle duplicate event processing safely (idempotent)?
- [ ] Have heavy dependencies been audited and minimized?
- [ ] Is database connection pooling optimized for ephemeral FaaS environments?
