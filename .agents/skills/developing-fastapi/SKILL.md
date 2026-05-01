---
name: developing-fastapi
description: "FastAPI with Pydantic v2, async, testing. Triggers: FastAPI, Python."
argument-hint: "[module/router] [options]"
---

# FastAPI Development

**Stack:** FastAPI 0.115+, Pydantic v2, SQLAlchemy 2 async, Alembic, pytest-asyncio.

## Project Structure

```
src/
├── auth/           # router.py, schemas.py, models.py, service.py
├── posts/          # router.py, schemas.py, models.py, service.py
├── config.py       # Pydantic BaseSettings
├── database.py     # async engine + session
├── main.py         # app factory
tests/
├── conftest.py
├── auth/
└── posts/
```

## Pydantic v2 — Always Use

```python
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=1, max_length=128)

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
```

## Async Routes

```python
# ✅ Good — async for I/O
@router.get("/async-ping")
async def async_ping():
    await asyncio.sleep(10)
    return {"pong": True}

# ✅ Good — sync for CPU-bound or sync SDKs
@router.get("/sync-ping")
def sync_ping():
    time.sleep(10)
    return {"pong": True}
```

**Rule:** Use `async def` only with `await` libs. Use `def` for sync operations.

## Config

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
```

## Database (SQLAlchemy 2 Async)

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

engine = create_async_engine(str(settings.DATABASE_URL), pool_size=10)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
    async with SessionLocal() as session:
        yield session
```

## Testing

```python
# conftest.py
@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

# test
@pytest.mark.asyncio
async def test_create_post(client):
    response = await client.post("/posts", json={"title": "Test"})
    assert response.status_code == 201
```

## Checklist

- [ ] Pydantic v2 for all request/response models
- [ ] `async def` only when using `await`
- [ ] Typed errors over string exceptions
- [ ] Tests with pytest-asyncio + httpx AsyncClient
- [ ] Coverage ≥80%

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
