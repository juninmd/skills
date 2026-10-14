# NestJS Best Practices and Patterns

Guidelines for building scalable and maintainable NestJS applications.

## 1. Modular Structure
Organize the project by feature to maintain clear boundaries:
```
src/
├── common/           # Cross-cutting concerns (guards, filters, pipes)
├── modules/
│   ├── auth/         # Auth logic, DTOs, services
│   ├── users/        # User management
│   └── ...
└── app.module.ts
```

## 2. Validation and DTOs
Use `class-validator` and `class-transformer` for robust request validation:
- **DTOs:** Define strict types for all incoming payloads.
- **Global Pipe:** Enable `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true`.

### DTO Validation Edge Cases

`whitelist`/`forbidNonWhitelisted` stops an unknown top-level field, but each of these still gets
through a DTO that only declares types without bounding them:

| Edge case | Failure if unhandled | Fix |
|---|---|---|
| Mass assignment via a **nested** object | `whitelist` strips unknown top-level keys but a nested DTO without its own `@ValidateNested()` + `@Type()` lets extra nested fields through untouched | decorate every nested object with `@ValidateNested()` and `@Type(() => NestedDto)`, and give the nested class its own whitelist |
| Integer overflow / non-finite | `@IsInt()` alone accepts `Number.MAX_SAFE_INTEGER + 1` and silently loses precision | add `@Max()`/`@Min()` bound to the actual domain range, not just "is an int" |
| Deeply nested payload (DoS) | a validation pass that recurses into attacker-controlled depth can exhaust the stack or CPU before rejecting anything | cap body size at the HTTP layer and reject a payload whose parsed depth exceeds a fixed bound before full validation runs |
| Unicode look-alikes in unique fields (username, email local-part) | two visually identical strings using different code points both pass `@IsString()` and collide only at the database, or worse, never collide and create a spoofable duplicate | normalize with `String.prototype.normalize('NFKC')` before validation and before the uniqueness check, applied consistently on read and write |

A validation pipe that only checks *shape* (right types, present fields) and never checks *scale*
(how big, how deep, how many code points) is validating the happy path only.

## 3. Authentication and Security
- **Guards:** Implement `JwtGuard` for route protection.
- **Interceptors:** Use interceptors for consistent response transformation.
- **Exception Filters:** Implement a global exception filter to standardize error responses.

## 4. Testing
- **Unit Testing:** Use Jest for testing services and controllers in isolation.
- **E2E Testing:** Use `Supertest` to verify full request/response cycles through the HTTP layer.

## 5. Dependency Injection Scopes

Nest providers default to a singleton — one instance shared by the whole application. Changing
that has a cost that only shows up under load:

| Scope | Instance lifetime | Trap |
|---|---|---|
| `DEFAULT` (singleton) | one, for the process lifetime | must not hold per-request state; a field set in one request leaks into every concurrent one |
| `REQUEST` | one per inbound request | re-instantiates the whole DI subtree above it for every request — expensive under load if applied broadly |
| `TRANSIENT` | one per injection point | easy to lose track of how many instances actually exist |

Two providers with a real circular dependency, resolved with `forwardRef()`, work — but a
`forwardRef()` that keeps appearing as modules grow is usually the same problem `software-architecture`
looks for in a plain dependency graph: two modules that should not know about each other directly.
Prefer extracting the shared contract into a third module both depend on over reaching for
`forwardRef()` again.

## References
- [NestJS Official Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
