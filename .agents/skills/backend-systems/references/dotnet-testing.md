# .NET Testing Standards

Strategies for building a comprehensive test suite with xUnit.

## 1. Test Pyramid
- **Unit Tests (Large):** Isolated tests for business logic (ViewModels, Services, Mappers).
- **Integration Tests (Medium):** Tests involving multiple components or a real database (EF Core).
- **E2E/API Tests (Small):** Full system tests calling HTTP endpoints.

## 2. Patterns and Tools
- **Framework:** xUnit.
- **Mocking:** Mock dependencies using libraries like `Moq` or `NSubstitute`.
- **AAA Pattern:** Structure tests into **Arrange**, **Act**, and **Assert**.
- **Coverage:** Aim for > 80% coverage on critical business logic.

## 3. Commands
```bash
# Run all tests
dotnet test

# Run tests with coverage
dotnet test /p:CollectCoverage=true

# Filter tests
dotnet test --filter Category=Unit
```
