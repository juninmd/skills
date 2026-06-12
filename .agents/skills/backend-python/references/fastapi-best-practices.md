# FastAPI Best Practices and Structure

Guidelines for building modern APIs with FastAPI 0.115+.

## 1. Project Structure
Organize by feature (modular) rather than by type:
```
src/
├── auth/           # router.py, schemas.py, models.py, service.py
├── posts/          # router.py, schemas.py, models.py, service.py
├── config.py       # Pydantic BaseSettings
├── database.py     # async engine + session
└── main.py         # app factory
```

## 2. Pydantic v2
Always use Pydantic v2 features for validation:
```python
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str = Field(min_length=1, max_length=128)
```

## 3. Async vs. Sync Routes
- **async def:** Use for I/O-bound tasks with `await` libraries (DB, API calls).
- **def:** Use for CPU-bound tasks or when using synchronous SDKs.

## 4. Database (SQLAlchemy 2 Async)
Configure the async engine and session maker:
```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
engine = create_async_engine(DATABASE_URL)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
```

## 5. Testing with pytest-asyncio
Use `httpx.AsyncClient` for integration tests. Ensure `pytest-asyncio` is configured correctly in `conftest.py`.
