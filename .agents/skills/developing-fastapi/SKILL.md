---
name: developing-fastapi
description: Design, implement, and maintain production-ready FastAPI applications with modular (domain-driven) architecture, Pydantic v2, proper async/await, dependency injection, testing with httpx/pytest-asyncio, and security standards. Use when creating or reviewing Python APIs with FastAPI.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[module/router] [options]"
---

# Development with FastAPI

This skill standardizes the development of robust production FastAPI APIs, covering architecture, async, Pydantic v2, DI, testing, and security.

## 🧱 Recommended Stack 2026
- **API:** FastAPI + Pydantic v2
- **Persistence:** SQLAlchemy 2 async + PostgreSQL
- **Migration:** Alembic
- **Queue/Jobs:** Celery (or RQ for simple scenarios)
- **Observability:** OpenTelemetry + Prometheus + Sentry

## Recommended Baseline

- **Python 3.13+**, **FastAPI 0.115+**, **Pydantic v2**, **SQLAlchemy 2.0+** (async), **Alembic**.
- Management via `uv` + `pyproject.toml`. See the `developing-python` skill.
- Linting/formatting exclusively with **`ruff`** (replaces black + isort + flake8).
- Mandatory type hints in all functions. `pyright` in strict mode.
- Tests with **`pytest-asyncio`** + **`httpx`** (AsyncClient). Minimum coverage: **90%**.
- **Feature-based** (domain-driven) structure, not by technical type.

## Instructions

### 1. Project Structure (Feature-Based / Domain-Driven)

Inspired by the [Netflix Dispatch](https://github.com/Netflix/dispatch) project and widely validated in production.

```text
fastapi-project/
├── alembic/
│   └── versions/
├── src/
│   ├── auth/
│   │   ├── router.py       # Module endpoints
│   │   ├── schemas.py      # Pydantic models (request/response)
│   │   ├── models.py       # SQLAlchemy ORM models
│   │   ├── service.py      # Business logic
│   │   ├── dependencies.py # FastAPI Module Dependencies
│   │   ├── constants.py    # Constants and ErrorCodes
│   │   ├── exceptions.py   # Domain exceptions (e.g., InvalidCredentials)
│   │   └── utils.py        # Helpers without business logic
│   ├── posts/
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   ├── service.py
│   │   ├── dependencies.py
│   │   ├── constants.py
│   │   ├── exceptions.py
│   │   └── utils.py
│   ├── config.py           # Global Pydantic BaseSettings
│   ├── database.py         # Engine, SessionLocal, Base
│   ├── exceptions.py       # Global Exception handlers
│   ├── models.py           # Global Base models
│   └── main.py             # FastAPI app factory
├── tests/
│   ├── conftest.py
│   ├── auth/
│   └── posts/
├── pyproject.toml
├── uv.lock
├── Makefile
└── alembic.ini
```

*   **Rule:** Each module is standalone. Import between modules with explicit names:
    ```python
    from src.auth import constants as auth_constants
    from src.notifications import service as notification_service
    ```
*   **Rationale:** Feature-based structure reduces cognitive load, facilitates encapsulation, and allows modules to evolve independently.

### 2. Async Routes — Use Correctly

```python
import asyncio
import time
from fastapi import APIRouter

router = APIRouter()

# ❌ TERRIBLE: blocks the entire event loop
@router.get("/bad-ping")
async def bad_ping():
    time.sleep(10)  # NEVER do this in an async route
    return {"pong": True}

# ✅ GOOD: sync route runs in a threadpool automatically
@router.get("/sync-ping")
def sync_ping():
    time.sleep(10)  # OK, runs in a separate thread
    return {"pong": True}

# ✅ IDEAL: truly asynchronous I/O operations
@router.get("/async-ping")
async def async_ping():
    await asyncio.sleep(10)  # non-blocking
    return {"pong": True}
```

**Golden Rules:**
- Use `async def` **only** with libs that support `await` (httpx, asyncpg, asyncio).
- Use `def` (sync) for: CPU-bound, synchronous SDKs, operations without external I/O.
- For sync SDKs in an async route, use `run_in_threadpool`:
    ```python
    from fastapi.concurrency import run_in_threadpool
    result = await run_in_threadpool(sync_sdk_client.fetch, data=payload)
    ```
- CPU-intensive tasks (ML, video processing): offload to **Celery** or **multiprocessing**.

### 3. Pydantic v2 — Use Extensively

```python
from __future__ import annotations

from datetime import date
from enum import StrEnum

from pydantic import AnyUrl, BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


class Species(StrEnum):
    LION = "lion"
    TIGER = "tiger"
    ELEPHANT = "elephant"


class CustomModel(BaseModel):
    """Custom base model for the entire application."""
    model_config = ConfigDict(
        populate_by_name=True,
        str_strip_whitespace=True,
    )


class UserCreate(CustomModel):
    first_name: str = Field(min_length=1, max_length=128)
    username: str = Field(min_length=1, max_length=64, pattern=r"^[A-Za-z0-9_-]+$")
    email: EmailStr
    password: str = Field(min_length=8)
    age: int | None = Field(default=None, ge=18)
    website: AnyUrl | None = None

    @field_validator("password", mode="after")
    @classmethod
    def validate_strong_password(cls, v: str) -> str:
        import re
        if not re.search(r"[A-Z]", v) or not re.search(r"\d", v):
            raise ValueError("Password must contain at least one uppercase letter and one digit")
        return v


class UserResponse(CustomModel):
    id: int
    username: str
    email: EmailStr
```

**Pydantic Best Practices:**
- Create a global `CustomModel` with shared configs (`ConfigDict`).
- Use `StrEnum` (Python 3.11+) for enum fields.
- `@field_validator` for complex validations on specific fields.
- `@model_validator(mode="after")` for cross-field validations.
- `ValueError` raised inside validators automatically becomes `422 Unprocessable Entity`.

### 4. Config with Pydantic BaseSettings — Decoupled by Module

```python
# src/config.py — Global config
from pydantic import PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings
from src.constants import Environment

class Config(BaseSettings):
    DATABASE_URL: PostgresDsn
    REDIS_URL: RedisDsn
    ENVIRONMENT: Environment = Environment.PRODUCTION
    CORS_ORIGINS: list[str] = []
    APP_VERSION: str = "1.0"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Config()
```

```python
# src/auth/config.py — Auth module config
from datetime import timedelta
from pydantic_settings import BaseSettings

class AuthConfig(BaseSettings):
    JWT_SECRET: str
    JWT_ALG: str = "HS256"
    JWT_EXP: int = 15  # minutes
    REFRESH_TOKEN_EXP: timedelta = timedelta(days=30)
    SECURE_COOKIES: bool = True

    class Config:
        env_file = ".env"

auth_settings = AuthConfig()
```

*   **Rationale:** Decentralized config avoids a God object and allows each module to be tested with isolated configs.

### 5. Dependency Injection — Beyond the Basics

```python
# src/posts/dependencies.py
from typing import Annotated, Any
from fastapi import Depends
from pydantic import UUID4
from src.posts.exceptions import PostNotFound
from src.posts import service

async def valid_post_id(post_id: UUID4) -> dict[str, Any]:
    """Validates post existence and injects the object."""
    post = await service.get_by_id(post_id)
    if not post:
        raise PostNotFound()
    return post

async def parse_jwt_data(
    token: str = Depends(oauth2_scheme),
) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, auth_settings.JWT_SECRET, algorithms=[auth_settings.JWT_ALG])
    except JWTError:
        raise InvalidCredentials()
    return {"user_id": payload["id"]}

async def valid_owned_post(
    post: Annotated[dict[str, Any], Depends(valid_post_id)],
    token_data: Annotated[dict[str, Any], Depends(parse_jwt_data)],
) -> dict[str, Any]:
    if post["creator_id"] != token_data["user_id"]:
        raise UserNotOwner()
    return post
```

```python
# src/posts/router.py
from typing import Annotated, Any
from fastapi import APIRouter, Depends
from src.posts.schemas import PostResponse, PostUpdate
from src.posts.dependencies import valid_post_id, valid_owned_post

router = APIRouter(prefix="/posts", tags=["posts"])

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post: Annotated[dict[str, Any], Depends(valid_post_id)]):
    return post

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    update_data: PostUpdate,
    post: Annotated[dict[str, Any], Depends(valid_owned_post)],
):
    return await service.update(id=post["id"], data=update_data)
```

**Dependency Injection Rules:**
- Dependencies are **cached** per request — `valid_post_id` called N times runs only 1x.
- Prefer `async` dependencies for I/O operations.
- Chain dependencies for complex validations and maximum reuse.
- Use `Annotated[..., Depends(...)]` (modern PEP 593 syntax) instead of `= Depends(...)`.

### 6. Error Handling — Domain Exceptions

```python
# src/posts/exceptions.py
class PostNotFound(Exception):
    pass

class PostAlreadyExists(Exception):
    pass

class UserNotOwner(Exception):
    pass
```

```python
# src/exceptions.py — Global handlers
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from src.posts.exceptions import PostNotFound, PostAlreadyExists

def setup_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(PostNotFound)
    async def post_not_found_handler(request: Request, exc: PostNotFound) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": "Post not found"})

    @app.exception_handler(PostAlreadyExists)
    async def post_already_exists_handler(request: Request, exc: PostAlreadyExists) -> JSONResponse:
        return JSONResponse(status_code=409, content={"detail": "Post already exists"})
```

```python
# src/main.py
from fastapi import FastAPI
from src.exceptions import setup_exception_handlers

def create_app() -> FastAPI:
    app = FastAPI(title="My API", version="1.0")
    setup_exception_handlers(app)
    return app

app = create_app()
```

*   **Rationale:** Separating domain exceptions from `HTTPException` keeps business layers decoupled from the HTTP protocol. Services don't need to know about HTTP codes.

### 7. Router MyProject (main.py)

```python
# src/main.py
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from src.auth.router import router as auth_router
from src.posts.router import router as posts_router
from src.config import settings
from src.exceptions import setup_exception_handlers

def create_app() -> FastAPI:
    is_dev = settings.ENVIRONMENT.is_debug

    app = FastAPI(
        title="My API",
        version=settings.APP_VERSION,
        openapi_url="/openapi.json" if is_dev else None,  # hides docs in production
        docs_url="/docs" if is_dev else None,
        redoc_url="/redoc" if is_dev else None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router, prefix="/v1/auth")
    app.include_router(posts_router, prefix="/v1/posts")
    setup_exception_handlers(app)

    return app

app = create_app()
```

### 8. REST Conventions

| Action | Method | URL |
|---|---|---|
| List resources | `GET` | `/posts` |
| Create resource | `POST` | `/posts` |
| Get by ID | `GET` | `/posts/{post_id}` |
| Full update | `PUT` | `/posts/{post_id}` |
| Partial update | `PATCH` | `/posts/{post_id}` |
| Remove | `DELETE` | `/posts/{post_id}` |
| Sub-resources | `GET` | `/posts/{post_id}/comments` |

**Naming Rules:**
- Use **plural** for collections: `/animals`, `/users`, `/orders`.
- Use **lowercase** and **kebab-case** in paths: `/post-likes`, not `/postLikes`.
- Version APIs in the path: `/v1/posts`, `/v2/posts`.
- Use `status_code` and `response_model` explicitly in all endpoints.

### 9. Testing — Async Client from Day 0

```python
# tests/conftest.py
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from src.main import app
from src.database import Base, get_db

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture(scope="session")
async def engine():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()

@pytest.fixture
async def db(engine) -> AsyncSession:
    async with AsyncSession(engine) as session:
        yield session

@pytest.fixture
async def client(db: AsyncSession) -> AsyncClient:
    app.dependency_overrides[get_db] = lambda: db
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac
    app.dependency_overrides.clear()
```

```python
# tests/posts/test_posts_router.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_post_returns_201(client: AsyncClient) -> None:
    # Arrange
    payload = {"title": "My Post", "content": "Hello World"}

    # Act
    response = await client.post("/v1/posts", json=payload)

    # Assert
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "My Post"

@pytest.mark.asyncio
async def test_get_nonexistent_post_returns_404(client: AsyncClient) -> None:
    response = await client.get("/v1/posts/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
```

### 10. Database — SQLAlchemy 2.0 Async

```python
# src/database.py
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from src.config import settings

engine = create_async_engine(
    str(settings.DATABASE_URL),
    echo=settings.ENVIRONMENT.is_debug,
    pool_size=10,
    max_overflow=20,
)

SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```

```python
# src/posts/models.py
from datetime import datetime
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base

class Post(Base):
    __tablename__ = "post"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    creator_id: Mapped[int] = mapped_column(ForeignKey("profile.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime | None] = mapped_column(default=None, onupdate=datetime.utcnow)
```

**DB Naming Conventions:**
- `snake_case` in all names.
- Singular form for tables: `post`, `post_like`, `user_playlist`.
- Group of tables per module: `payment_account`, `payment_bill`.
- Suffix `_at` for datetime, `_date` for date.
- Alembic Migrations: `alembic.ini` with `file_template = %%(year)d-%%(month).2d-%%(day).2d_%%(slug)s`.

### 11. OpenAPI Docs — Production vs Development

```python
# Hide docs in production (security)
app = FastAPI(
    title="My API",
    openapi_url="/openapi.json" if is_dev else None,
    docs_url="/docs" if is_dev else None,
)

# Document all endpoints with response_model + status_code + responses
@router.post(
    "/posts",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new post",
    description="Creates a post associated to the authenticated user.",
    responses={
        status.HTTP_409_CONFLICT: {"description": "Post with this title already exists"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"description": "Invalid payload"},
    },
)
async def create_post(payload: PostCreate, ...) -> PostResponse:
    ...
```

### 12. Security Checklist

- [ ] CORS configured with explicit list of origins (`CORS_ORIGINS` via env).
- [ ] Docs (`/docs`, `/openapi.json`) disabled in production.
- [ ] Secrets via environment variables (never hardcoded). Use Google Secret Manager in production.
- [ ] JWT with short expiration (15 min) + separate refresh token (30 days).
- [ ] Rate limiting on public endpoints (e.g., `slowapi`).
- [ ] SQL via ORM (SQLAlchemy) — never string interpolation in queries.
- [ ] Sanitize inputs via Pydantic validators.
- [ ] `ValidationPipe` equivalent: Pydantic in the body + `Query()`/`Path()` in parameters.

## Common Tasks

*   **Create new module:** Create the directory `src/<module>/` with `router.py`, `schemas.py`, `service.py`, `dependencies.py`, `exceptions.py`, `models.py`, `constants.py`.
*   **Add route:** Define in `router.py` and register in `src/main.py` via `app.include_router(...)`.
*   **Alembic Migration:** `uv run alembic revision --autogenerate -m "add_post_table"` → `uv run alembic upgrade head`.
*   **Run server:** `make run` (uses `PYTHONPATH=src uvicorn src.main:app --reload`).
*   **Run tests:** `make coverage`.

## Troubleshooting

- **`RuntimeError: Event loop is closed`:** Set `asyncio_mode = "auto"` in `pyproject.toml` and use `scope="session"` in engine fixtures.
- **`greenlet_spawn` error (SQLAlchemy sync in async context):** Change to `AsyncSession` and `await session.execute(...)` methods.
- **Pydantic `model_rebuild()` error:** Add `from __future__ import annotations` at the top of the file.
- **Response serialized twice:** Avoid creating Pydantic instances just to return from routes — return dicts or ORM objects that the `response_model` already validates.
- **Unexpected dependency caching:** Use `Depends(func, use_cache=False)` when you need execution on every call.

