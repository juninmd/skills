---
name: developing-nestjs
description: "NestJS Development for Designing modular, Implementing type-safe, Configuring database via nest."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Node.js, TypeScript"
allowed-tools: [read_file, write_file, replace]
---

# NestJS Development

Expert methodology for building scalable, testable, and loosely coupled backend applications using NestJS and the modern TypeScript ecosystem.

**USE FOR:**
- Designing modular architectures using NestJS feature modules.
- Implementing type-safe request validation with DTOs and `class-validator`.
- Configuring database access using Prisma or TypeORM.
- Implementing secure authentication and authorization using JWT guards.
- Writing comprehensive unit and E2E tests with Jest and Supertest.

**DO NOT USE FOR:**
- Client-side application development.
- One-off scripts that do not benefit from a structured framework.

**INVOKES:**
- `nest`, `prisma`, `jest` CLI tools.

## Methodology and Guidelines
Implementation details for module structure, validation, and testing are documented in:
- [NestJS Best Practices and Patterns](references/nestjs-best-practices.md)

## Core Principles
1. **Separation of Concerns:** Keep business logic in services and routing in controllers.
2. **Global Consistency:** Use global pipes and filters for standardized error handling and validation.
3. **Dependency Inversion:** Rely on abstractions and constructor-based dependency injection.

## Development Standards
1. **Architecture:**
   - **Module Structure (Feature-Based):** Organize by business modules (feature-based), not by technical type.
   - **Dependency Injection:** Verify cyclic dependencies are avoided and providers are scoped correctly.
   - **Controllers:** Keep Controllers lean. Business logic must be isolated in Services/Providers.
2. **Validation & Security:**
   - **Validation:** Ensure DTOs use `class-validator` and `app.useGlobalPipes(new ValidationPipe())` is active.
   - **Guards:** Confirm authentication endpoints use appropriate NestJS Guards.
   - **Interceptors:** Follow the Pipes, Guards, and Interceptors pattern for cross-cutting concerns (logging, timeouts, caching).

## Checklist
- [ ] Use feature-based module structure for all new functionality.
- [ ] Enable `ValidationPipe` with `whitelist: true` in `main.ts`.
- [ ] Apply `JwtGuard` or appropriate security guards to protected routes.
- [ ] Verify test coverage (>80%) for all services and critical controllers.
- [ ] Ensure `app.enableShutdownHooks()` is called for clean termination.
