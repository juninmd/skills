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

## 3. Authentication and Security
- **Guards:** Implement `JwtGuard` for route protection.
- **Interceptors:** Use interceptors for consistent response transformation.
- **Exception Filters:** Implement a global exception filter to standardize error responses.

## 4. Testing
- **Unit Testing:** Use Jest for testing services and controllers in isolation.
- **E2E Testing:** Use `Supertest` to verify full request/response cycles through the HTTP layer.

## References
- [NestJS Official Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
