# Python Quality Gates and Testing

Standardized commands and patterns for maintaining Python code quality.

## 1. Quality Gates (uv + ruff/pyright)
- **Linting:** `uv run ruff check .`
- **Formatting:** `uv run ruff format .`
- **Type Checking:** `uv run pyright .`
- **Test with Coverage:** `uv run pytest --cov=src` (Target: ≥90%).

## 2. Testing with pytest-asyncio
Use `httpx.AsyncClient` for API integration tests:
```python
@pytest.mark.asyncio
async def test_api(client):
    response = await client.get("/")
    assert response.status_code == 200
```

## References
- [uv Documentation](https://docs.astral.sh/uv/)
- [Ruff Documentation](https://docs.astral.sh/ruff/)
- [Pyright Documentation](https://microsoft.github.io/pyright/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
