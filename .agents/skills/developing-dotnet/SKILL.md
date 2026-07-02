---
name: developing-dotnet
description: Design, implement, and maintain production-ready .NET applications with modern async/await, SOLID principles, dependency injection, Entity Framework Core, comprehensive testing with xUnit/NUnit, and cloud-native architecture.
metadata:
    works_on: [copilot]
argument-hint: "[feature/component] [options: testing, async, di, orm, api]"
---

# Developing with .NET

## Objective
Build enterprise-grade .NET applications with clean architecture, proper async patterns, comprehensive testing, and production-ready quality.

## When to Use This Skill
- Building .NET API servers, microservices, or background services
- Implementing async/await patterns correctly end-to-end
- Setting up dependency injection and service configuration
- Designing and optimizing Entity Framework Core data access
- Creating comprehensive unit, integration, and end-to-end tests
- Implementing error handling, logging, and observability
- Building cloud-native .NET applications with 12-factor compliance
- Code reviewing .NET solutions for SOLID principles and best practices

## Flow

### 1. Understand Requirements & Context
- Verify target .NET version and C# language version
- Check `global.json` for SDK specifications
- Identify application type: Web API, Console, Background Service, Desktop
- Review existing project structure and conventions
- Confirm nullable reference types are enabled

### 2. Architecture & Design
- Design with SOLID principles: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- Separate concerns: Controllers/Handlers → Services → Domain → Data Access
- Use Dependency Injection for all external dependencies
- Design APIs with REST/gRPC best practices
- Plan for testability from the start
- Consider security: authentication, authorization, input validation
- Design for async operations end-to-end

### 3. Implementation Priority
**Do First:**
- Create proper project structure with clear separation
- Set up Dependency Injection container configuration
- Implement base service interfaces and contracts
- Create domain models and validation logic

**Code Implementation Pattern:**
```
1. Domain/Models         → Business logic, validation
2. Services             → Business operations
3. Data/Repository      → Data access with EF Core
4. API/Handlers        → HTTP endpoints or message handlers
5. Configuration       → DI, logging, middleware
6. Tests               → Unit, integration, end-to-end
```

### 4. Async/Await Best Practices
- All async methods end with `Async` suffix
- Accept `CancellationToken` parameters throughout
- Use `await` every time; no fire-and-forget
- Implement proper timeout and cancellation handling
- Use `ConfigureAwait(false)` in library code
- No sync-over-async antipatterns
- Stream large payloads instead of loading into memory

### 5. Testing Strategy
**Test Pyramid:**
```
    E2E Tests (API/Integration)      [small]
    Integration Tests (with DB)       [medium]
    Unit Tests (isolated)             [large]
```

**Example xUnit Structure:**
```csharp
public class CartServiceTests
{
    private readonly CartService _service;
    private readonly Mock<IRepository<Product>> _productRepo;

    public CartServiceTests()
    {
        _productRepo = new Mock<IRepository<Product>>();
        _service = new CartService(_productRepo.Object);
    }

    [Fact]
    public async Task WhenAddingProductThenCartTotalIncreases()
    {
        // Arrange
        var product = new Product { Id = 1, Price = 100 };
        _productRepo.Setup(r => r.GetByIdAsync(1, default))
            .ReturnsAsync(product);
        var cart = new Cart();

        // Act
        await cart.AddProductAsync(_service, 1, 2, default);

        // Assert
        Assert.Equal(200, cart.Total);
    }
}
```

### 6. Entity Framework Core
- Use migrations for schema management; version control them
- Implement repository pattern for data access
- Use LINQ queries efficiently; avoid N+1 queries
- Lazy loading can hide performance problems; use explicit loading or eager loading
- Use `AsNoTracking()` for read-only queries
- Batch operations when handling many records
- Index strategy: identify hot queries and add appropriate indexes

### 7. Error Handling & Logging
**Error Handling Pattern:**
```csharp
try
{
    // Operation
}
catch (ArgumentException ex)
{
    _logger.LogWarning("Invalid argument: {Message}", ex.Message);
    throw new ValidationFailedException("User input was invalid", ex);
}
catch (TimeoutException ex)
{
    _logger.LogError("Operation timeout: {Message}", ex.Message);
    throw new ServiceUnavailableException("Service is temporarily unavailable", ex);
}
```

**Logging:** Structure logs with context, use appropriate levels (Info, Warning, Error, Critical)

### 8. Security Considerations
- Validate all user input; never trust client data
- Use parameterized queries (EF Core handles this)
- Implement proper authentication (OAuth, JWT, Windows Auth)
- Use role-based or claims-based authorization
- Hash passwords with strong algorithms (bcrypt, Argon2)
- Encrypt sensitive data at rest and in transit
- Never log sensitive information (passwords, tokens, PII)
- Implement rate limiting for public endpoints

### 9. Validation & Quality
**Pre-Commit Checklist:**
```
✓ Nullable reference types enabled
✓ All public APIs documented
✓ Unit tests with >80% coverage
✓ No hardcoded configuration
✓ Async/await used consistently
✓ Cancellation tokens propagated
✓ Error handling comprehensive
✓ Logging includes context
✓ Security model reviewed
✓ Performance implications considered
```

### 10. Build & Deploy
```bash
# Local development
dotnet build
dotnet test
dotnet run

# Production
dotnet publish -c Release
# Run health checks, verify configuration
```

## Code Examples

### Async Service Pattern
```csharp
public interface IOrderService
{
    Task<OrderDetail> GetOrderAsync(int orderId, CancellationToken ct = default);
    Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct = default);
}

public class OrderService : IOrderService
{
    private readonly IOrderRepository _repo;
    private readonly ILogger<OrderService> _logger;

    public OrderService(IOrderRepository repo, ILogger<OrderService> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    public async Task<OrderDetail> GetOrderAsync(int orderId, CancellationToken ct = default)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(orderId);

        try
        {
            _logger.LogInformation("Fetching order {OrderId}", orderId);
            var order = await _repo.GetOrderByIdAsync(orderId, ct).ConfigureAwait(false);

            if (order is null)
            {
                _logger.LogWarning("Order {OrderId} not found", orderId);
                throw new OrderNotFoundException($"Order {orderId} not found");
            }

            return new OrderDetail(order);
        }
        catch (TimeoutException ex)
        {
            _logger.LogError(ex, "Timeout fetching order {OrderId}", orderId);
            throw new ServiceUnavailableException("Database service unavailable", ex);
        }
    }

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var order = new Order
        {
            CustomerId = request.CustomerId,
            Items = request.Items,
            CreatedAt = DateTime.UtcNow
        };

        try
        {
            var created = await _repo.AddOrderAsync(order, ct).ConfigureAwait(false);
            _logger.LogInformation("Order {OrderId} created successfully", created.Id);
            return created;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Failed to create order for customer {CustomerId}", request.CustomerId);
            throw new OrderCreationFailedException("Failed to create order", ex);
        }
    }
}
```

### Unit Test with AAA Pattern
```csharp
public class ProductValidationTests
{
    [Fact]
    public void WhenPriceIsNegativeThenThrowsArgumentException()
    {
        // Arrange
        var product = new Product { Name = "Widget", Category = "Hardware" };

        // Act & Assert
        Assert.Throws<ArgumentException>(() => product.SetPrice(-10));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public void WhenPriceIsNotPositiveThenThrows(decimal price)
    {
        // Arrange
        var product = new Product { Name = "Widget" };

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() => product.SetPrice(price));
        Assert.Contains("Price must be positive", ex.Message);
    }
}
```

### Dependency Injection Configuration
```csharp
// Program.cs (.NET 6+)
var builder = WebApplicationBuilder.CreateBuilder(args);

// Add services
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddDbContext<OrderDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddLogging(config =>
    config.AddConsole().SetMinimumLevel(LogLevel.Information));

var app = builder.Build();

// Add middleware
app.UseRouting();
app.UseEndpoints(endpoints => endpoints.MapControllers());

await app.RunAsync();
```

### Entity Framework Core with Repository
```csharp
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<List<T>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
    Task UpdateAsync(T entity, CancellationToken ct = default);
    Task DeleteAsync(T entity, CancellationToken ct = default);
}

public class OrderRepository : IRepository<Order>
{
    private readonly OrderDbContext _context;
    private readonly ILogger<OrderRepository> _logger;

    public OrderRepository(OrderDbContext context, ILogger<OrderRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Order?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        try
        {
            return await _context.Orders
                .AsNoTracking()
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id, ct)
                .ConfigureAwait(false);
        }
        catch (TimeoutException ex)
        {
            _logger.LogError(ex, "Timeout fetching order {OrderId}", id);
            throw;
        }
    }

    public async Task AddAsync(Order entity, CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(entity);

        try
        {
            _context.Orders.Add(entity);
            await _context.SaveChangesAsync(ct).ConfigureAwait(false);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Failed to save order");
            throw;
        }
    }
}
```

## Validation

### Build Verification
```bash
# Compile check
dotnet build

# Run all tests
dotnet test --verbosity normal

# Code coverage
dotnet test /p:CollectCoverage=true
```

### Quick Validation Checklist
- ✅ Compiles without warnings
- ✅ All tests pass
- ✅ No null reference exceptions possible (nullable checks in place)
- ✅ No fire-and-forget async calls
- ✅ Cancellation tokens propagated appropriately
- ✅ Error messages are actionable
- ✅ Logging provides sufficient context
- ✅ No secrets in configuration
- ✅ Performance is acceptable (measure before optimizing)

## References & Further Learning

- [C# Official Documentation](https://learn.microsoft.com/en-us/dotnet/csharp/)
- [.NET Best Practices](https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/)
- [Entity Framework Core Documentation](https://learn.microsoft.com/en-us/ef/core/)
- [xUnit Documentation](https://xunit.net/)
- [Microsoft Design Patterns](https://learn.microsoft.com/en-us/dotnet/core/whats-new)

