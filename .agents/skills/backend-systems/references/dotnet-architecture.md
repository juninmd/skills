# .NET Architecture and Design Guidelines

Standards for building enterprise-grade .NET applications with Clean Architecture and SOLID principles.

## 1. Project Structure
Separate concerns using a layered approach:
1. **Domain/Models:** Core business logic, validation, and entities.
2. **Services:** Business operations and service interfaces.
3. **Data/Repository:** EF Core data access and repository implementations.
4. **API/Handlers:** Web API controllers or gRPC handlers.
5. **Configuration:** DI registration, logging setup, and middleware.
6. **Tests:** Layered testing suites.

## 2. Core Principles
- **SOLID:** Apply Single Responsibility, Open/Closed, Liskov, Interface Segregation, and Dependency Inversion.
- **Dependency Injection (DI):** Register all external dependencies in the DI container (Scoped, Singleton, or Transient).
- **REST/gRPC:** Follow established standards for API design.
- **Nullable Types:** Always enable nullable reference types (`<Nullable>enable</Nullable>`).

## 3. Security Considerations
- Validate all user inputs.
- Use parameterized queries (EF Core defaults).
- Implement OAuth/JWT authentication.
- Role/Claims-based authorization.
- Encrypt sensitive data; never log secrets or PII.
