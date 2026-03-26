---
name: developing-fastapi
description: Projetar, implementar e manter aplicações FastAPI prontas para produção com arquitetura modular (domain-driven), Pydantic v2, async/await correto, dependency injection, testes com httpx/pytest-asyncio e padrões de segurança. Use ao criar ou revisar APIs Python com FastAPI.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[module/router] [options]"
---

# FastAPI Development

Esta skill padroniza o desenvolvimento de APIs FastAPI robustas para produção, cobrindo arquitetura, async, Pydantic v2, DI, testes e segurança.

## Recommended Baseline

- **Python 3.13+**, **FastAPI 0.115+**, **Pydantic v2**, **SQLAlchemy 2.0+** (async), **Alembic**.
- Gerenciamento via `uv` + `pyproject.toml`. Veja a skill `developing-python`.
- Linting/formatação exclusivamente com **`ruff`** (substitui black + isort + flake8).
- Type hints **obrigatórios** em todas as funções. `pyright` em modo strict.
- Testes com **`pytest-asyncio`** + **`httpx`** (AsyncClient). Cobertura mínima: **90%**.
- Estrutura **feature-based** (domain-driven), não por tipo técnico.

## Instructions

### 1. Project Structure (Feature-Based / Domain-Driven)

Inspirada no projeto [Netflix Dispatch](https://github.com/Netflix/dispatch) e amplamente validada em produção.

```text
fastapi-project/
├── alembic/
│   └── versions/
├── src/
│   ├── auth/
│   │   ├── router.py       # Endpoints do módulo
│   │   ├── schemas.py      # Pydantic models (request/response)
│   │   ├── models.py       # SQLAlchemy ORM models
│   │   ├── service.py      # Business logic
│   │   ├── dependencies.py # FastAPI Dependencies do módulo
│   │   ├── constants.py    # Constantes e ErrorCodes
│   │   ├── exceptions.py   # Exceções de domínio (ex: InvalidCredentials)
│   │   └── utils.py        # Helpers sem lógica de negócio
│   ├── posts/
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   ├── service.py
│   │   ├── dependencies.py
│   │   ├── constants.py
│   │   ├── exceptions.py
│   │   └── utils.py
│   ├── config.py           # Pydantic BaseSettings global
│   ├── database.py         # Engine, SessionLocal, Base
│   ├── exceptions.py       # Exception handlers globais
│   ├── models.py           # Base models globais
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

*   **Regra:** Cada módulo é standalone. Importe entre módulos com nome explícito:
    ```python
    from src.auth import constants as auth_constants
    from src.notifications import service as notification_service
    ```
*   **Reasoning:** Estrutura feature-based reduz cognitive load, facilita encapsulamento e permite evoluir módulos de forma independente.

### 2. Async Routes — Use Corretamente

```python
import asyncio
import time
from fastapi import APIRouter

router = APIRouter()

# ❌ TERRÍVEL: bloqueia o event loop inteiro
@router.get("/bad-ping")
async def bad_ping():
    time.sleep(10)  # NUNCA faça isso em rota async
    return {"pong": True}

# ✅ BOM: sync route roda em threadpool automaticamente
@router.get("/sync-ping")
def sync_ping():
    time.sleep(10)  # OK, roda em thread separada
    return {"pong": True}

# ✅ IDEAL: operações I/O realmente assíncronas
@router.get("/async-ping")
async def async_ping():
    await asyncio.sleep(10)  # non-blocking
    return {"pong": True}
```

**Regras de Ouro:**
- Use `async def` **apenas** com libs que suportam `await` (httpx, asyncpg, asyncio).
- Use `def` (sync) para: CPU-bound, SDKs síncronos, operações sem I/O externo.
- Para SDKs sync em rota async, use `run_in_threadpool`:
    ```python
    from fastapi.concurrency import run_in_threadpool
    result = await run_in_threadpool(sync_sdk_client.fetch, data=payload)
    ```
- Tasks CPU-intensivas (ML, processamento de vídeo): offload para **Celery** ou **multiprocessing**.

### 3. Pydantic v2 — Use Extensivamente

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
    """Base model customizado para toda a aplicação."""
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

**Boas Práticas Pydantic:**
- Crie um `CustomModel` global com configs compartilhadas (`ConfigDict`).
- Use `StrEnum` (Python 3.11+) para campos enum.
- `@field_validator` para validações complexas em campos específicos.
- `@model_validator(mode="after")` para validações cross-field.
- `ValueError` levantado dentro de validators vira `422 Unprocessable Entity` automaticamente.

### 4. Config com Pydantic BaseSettings — Desacoplada por Módulo

```python
# src/config.py — Config global
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
# src/auth/config.py — Config do módulo auth
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

*   **Reasoning:** Config descentralizada evita um God Object e permite que cada módulo seja testado com configs isoladas.

### 5. Dependency Injection — Além do Básico

```python
# src/posts/dependencies.py
from typing import Annotated, Any
from fastapi import Depends
from pydantic import UUID4
from src.posts.exceptions import PostNotFound
from src.posts import service

async def valid_post_id(post_id: UUID4) -> dict[str, Any]:
    """Valida existência do post e injeta o objeto."""
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

**Regras de Dependency Injection:**
- Dependencies são **cacheadas** por request — `valid_post_id` chamado N vezes roda só 1x.
- Prefira `async` dependencies para operações de I/O.
- Chain dependencies para validações complexas e reuso máximo.
- Use `Annotated[..., Depends(...)]` (sintaxe moderna PEP 593) em vez de `= Depends(...)`.

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
# src/exceptions.py — Handlers globais
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

*   **Reasoning:** Separar exceções de domínio de `HTTPException` mantém as camadas de negócio desacopladas do protocolo HTTP. Services não precisam saber sobre códigos HTTP.

### 7. Router Organization (main.py)

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
        openapi_url="/openapi.json" if is_dev else None,  # oculta docs em produção
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

| Ação | Método | URL |
|---|---|---|
| Listar recursos | `GET` | `/posts` |
| Criar recurso | `POST` | `/posts` |
| Obter por ID | `GET` | `/posts/{post_id}` |
| Atualizar completo | `PUT` | `/posts/{post_id}` |
| Atualizar parcial | `PATCH` | `/posts/{post_id}` |
| Remover | `DELETE` | `/posts/{post_id}` |
| Sub-recursos | `GET` | `/posts/{post_id}/comments` |

**Naming Rules:**
- Use **plural** para coleções: `/animals`, `/users`, `/orders`.
- Use **lowercase** e **kebab-case** nos paths: `/post-likes`, não `/postLikes`.
- Versione APIs no path: `/v1/posts`, `/v2/posts`.
- Use `status_code` e `response_model` explicitamente em todos os endpoints.

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
- `snake_case` em todos os nomes.
- Forma singular para tabelas: `post`, `post_like`, `user_playlist`.
- Grupo de tabelas por módulo: `payment_account`, `payment_bill`.
- Sufixo `_at` para datetime, `_date` para date.
- Migrations Alembic: `alembic.ini` com `file_template = %%(year)d-%%(month).2d-%%(day).2d_%%(slug)s`.

### 11. OpenAPI Docs — Produção vs Desenvolvimento

```python
# Oculte docs em produção (segurança)
app = FastAPI(
    title="My API",
    openapi_url="/openapi.json" if is_dev else None,
    docs_url="/docs" if is_dev else None,
)

# Documente todos os endpoints com response_model + status_code + responses
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

- [ ] CORS configurado com lista explícita de origens (`CORS_ORIGINS` via env).
- [ ] Docs (`/docs`, `/openapi.json`) desabilitados em produção.
- [ ] Secrets via variáveis de ambiente (nunca hardcoded). Usar Google Secret Manager em produção.
- [ ] JWT com expiração curta (15 min) + refresh token separado (30 dias).
- [ ] Rate limiting em endpoints públicos (ex: `slowapi`).
- [ ] SQL via ORM (SQLAlchemy) — nunca interpolação de strings em queries.
- [ ] Sanitize inputs via Pydantic validators.
- [ ] `ValidationPipe` equivalente: Pydantic no body + `Query()`/`Path()` nos parâmetros.

## Common Tasks

*   **Criar novo módulo:** Crie o diretório `src/<module>/` com `router.py`, `schemas.py`, `service.py`, `dependencies.py`, `exceptions.py`, `models.py`, `constants.py`.
*   **Adicionar rota:** Defina em `router.py` e registre em `src/main.py` via `app.include_router(...)`.
*   **Migration Alembic:** `uv run alembic revision --autogenerate -m "add_post_table"` → `uv run alembic upgrade head`.
*   **Rodar servidor:** `make run` (usa `PYTHONPATH=src uvicorn src.main:app --reload`).
*   **Executar testes:** `make coverage`.

## Troubleshooting

- **`RuntimeError: Event loop is closed`:** Configura `asyncio_mode = "auto"` no `pyproject.toml` e usa `scope="session"` em fixtures de engine.
- **`greenlet_spawn` error (SQLAlchemy sync em contexto async):** Troque por `AsyncSession` e métodos `await session.execute(...)`.
- **Pydantic `model_rebuild()` error:** Adicione `from __future__ import annotations` no topo do arquivo.
- **Response serialized twice:** Evite criar instâncias Pydantic só para retornar de rotas — retorne dicts ou objetos ORM que o `response_model` já valida.
- **Dependency caching inesperado:** Use `Depends(func, use_cache=False)` quando precisar de execução a cada chamada.
