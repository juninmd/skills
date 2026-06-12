---
name: backend-node
description: "Comprehensive Node.js Backend Development covering NestJS, Advanced TypeScript, pnpm, and API Contracts."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Node.js, TypeScript"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Backend Node.js Engineering

Expert methodology for building enterprise-grade Node.js and TypeScript backends. This skill unifies Node.js application development, the NestJS framework, advanced TypeScript typing, package management with pnpm, and API contract testing.

**USE FOR:**
- Building and managing modern Node.js applications and monorepos using pnpm.
- Developing robust REST/GraphQL APIs and microservices with NestJS.
- Applying advanced TypeScript techniques (generics, utility types, branded types) for maximum type safety.
- Designing and validating API contracts (OpenAPI, Pact testing).
- Managing JS/TS build automation, lockfile reconciliation, and Biome linting.

**DO NOT USE FOR:**
- Frontend development tasks (use `frontend-engineering`).
- Database migrations or administration (use `data-engineering`).
- Developing Python APIs (use `backend-python`).

**INVOKES:**
- `node`, `pnpm`, `nest cli`, `tsc`, `prisma`, contract testing tools.

## Core Principles
1. **Type Safety Everywhere:** Push logic errors to compile time using strict TypeScript features.
2. **Dependency Hygiene:** Use pnpm workspaces, frozen lockfiles, and strict peer dependency management.
3. **Modular Architecture:** Leverage NestJS modules and Dependency Injection for scalable service boundaries.
4. **Contract-Driven Design:** Define API schemas before implementation; test consumers against the contract.

## Implementation Guides
Refer to these specific domains for deep-dive instructions:
- [Node.js & pnpm Management](references/node-pnpm.md)
- [NestJS Architecture](references/nestjs-arch.md)
- [Advanced TypeScript Patterns](references/ts-advanced.md)
- [Contract Testing & APIs](references/contract-testing.md)

## Checklist
- [ ] Ensure `pnpm-workspace.yaml` and `.npmrc` are correctly configured for monorepos.
- [ ] Apply strict TypeScript compiler options (`strict: true`, etc.).
- [ ] Validate NestJS DTOs and exception filters are properly configured.
- [ ] Verify API contracts align with the generated clients/consumers.
