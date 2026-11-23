# .NET Code Examples

Common implementation patterns for services, tests, and configuration.

## 1. Async Service Pattern
```csharp
public class OrderService : IOrderService
{
    private readonly IOrderRepository _repo;
    public async Task<Order> CreateOrderAsync(OrderRequest req, CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(req);
        var order = await _repo.AddAsync(new Order(req), ct).ConfigureAwait(false);
        return order;
    }
}
```

## 2. Unit Test Example
```csharp
[Fact]
public async Task WhenPriceIsNegative_ThenThrowsException()
{
    var product = new Product();
    Assert.Throws<ArgumentException>(() => product.SetPrice(-10));
}
```

## 3. DI Configuration (.NET 6+)
```csharp
var builder = WebApplicationBuilder.CreateBuilder(args);
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddDbContext<OrderDbContext>(opt => 
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
var app = builder.Build();
await app.RunAsync();
```
