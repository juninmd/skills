---
name: nestjs-standards
description: "Use when working in a NestJS project with modular architecture, feature-based modules, class-validator DTOs, Guards, and Interceptors. Triggers: NestJS, nest, class-validator, guards, interceptors."
applyTo: '**/*.ts'
paths:
  - "**/*.ts"
trigger: model_decision
globs: "**/*.ts"
---

# Rule: NestJS Standards

## 1. Architecture
- **Module Structure (Feature-Based):** Organize by business modules (feature-based), not by technical type.
- **Dependency Injection:** Verify cyclic dependencies are avoided and providers are scoped correctly.
- **Controllers:** Keep Controllers lean. Business logic must be isolated in Services/Providers.

## 2. Validation & Security
- **Validation:** Ensure DTOs use `class-validator` and `app.useGlobalPipes(new ValidationPipe())` is active.
- **Guards:** Confirm authentication endpoints use appropriate NestJS Guards.
- **Interceptors:** Follow the Pipes, Guards, and Interceptors pattern for cross-cutting concerns (logging, timeouts, caching).
