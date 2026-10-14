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

## 2b. Pydantic Validation Edge Cases

`BaseModel` field types alone bound *shape*, not *scale* — these pass a plain type check and still
cause real damage downstream:

| Edge case | Failure if unhandled | Fix |
|---|---|---|
| Mass assignment | Pydantic v2 ignores extra fields by default (`extra='ignore'`), so a client-supplied `is_admin` on a signup payload is silently dropped **only** if nothing downstream re-reads the raw dict | set `model_config = ConfigDict(extra='forbid')` on any DTO fed by an untrusted client, so an unexpected field is a 422, not a silent drop |
| Integer overflow | `int` in Python is unbounded, but if that value is later written to a database `int32`/`int64` column or serialized to another system's fixed-width integer, it truncates or errors far from where it entered | bound with `Field(le=..., ge=...)` matching the actual downstream storage type, not just "is an int" |
| Deeply nested payload (DoS) | Pydantic recursively validates nested models; an attacker-controlled JSON with thousands of nesting levels can exhaust the stack before validation ever rejects it | cap request body size ahead of parsing (ASGI middleware or reverse proxy) and keep DTOs shallow — deep nesting is usually a modeling smell besides being a DoS surface |
| Unicode normalization | two strings that render identically but use different code points (`"café"` vs `"café"`) both pass `str` validation and can defeat a uniqueness check or comparison downstream | normalize with `unicodedata.normalize('NFKC', value)` in a `field_validator`, applied identically on write and on lookup |

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
