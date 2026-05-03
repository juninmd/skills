---
name: nodejs-standards
description: Node.js coding standards focusing on architecture, module boundaries, and security.
applyTo: '**/*.ts,**/*.js'
paths:
  - "**/*.ts"
  - "**/*.js"
trigger: glob
globs: "**/*.ts,**/*.js"
---

# Rule: Node.js Standards

## 1. Architecture & Delivery Principles
- **Module boundaries:** Prefer clear modular boundaries; avoid cyclic dependencies.
- **Transport isolation:** Keep business rules out of HTTP/CLI adapters. Controllers/handlers should delegate to services, never contain logic.
- **Minimal abstractions:** Use the smallest viable abstraction. Remove speculative complexity (YAGNI).

## 2. Asynchronous Programming
- **Async/Await**: Check that asynchronous operations use `async/await` and handle Promise rejections appropriately. Avoid using raw `.then().catch()` chains unless absolutely necessary.
