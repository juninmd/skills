---
name: managing-docker-containers
description: Criação e otimização de imagens Docker seguras, leves e prontas para produção (Multistage, Non-Root).
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Docker Containers

Esta skill padroniza a criação de imagens para garantir segurança e eficiência no registry.

## Instructions
1.  **Security (Non-Root):** NUNCA rode a aplicação como root.
    *   **Instruction:** Adicione `USER node` ou `USER app` no final do Dockerfile.
    *   **Reasoning:** Minimiza superfície de ataque em caso de RCE.
2.  **Layer Caching:** Copie `package*.json` antes do código fonte.
    *   **Why:** Permite cachear `npm ci`. Se apenas o código mudar, o build reaproveita as dependências baixadas.
3.  **Multistage Builds:** Use estágios de build para descartar ferramentas desnecessárias na imagem final.
    *   **Stage 1:** `FROM node:20 AS builder` (Instala deps, compila TS).
    *   **Stage 2:** `FROM node:20-alpine` (Copia apenas `dist/` e `node_modules/prod`).
4.  **Linting:** Valide o Dockerfile com `hadolint`.
    *   **Common Errors:** `DL3003` (Use `WORKDIR`), `DL3018` (Pin versions in apk add).
5.  **Healthcheck:** Sempre defina um `HEALTHCHECK` no Dockerfile ou no K8s Probe.
    *   `HEALTHCHECK --interval=30s CMD curl -f http://localhost:8080/health || exit 1`

## Verification
*   **Check User:** `docker run --rm <image> whoami` (Deve retornar != root).
*   **Check Size:** Compare imagem base vs final. Multistage deve reduzir em >60%.
*   **Scan Vulnerabilities:** Use `trivy image <image>` antes do push.

---

## Orquestração com Docker Compose

Usar para ambientes locais e stacks multi-container (banco, cache, app).

### Workflow
1. **Analisar requisitos**: identifique serviços, portas, volumes e variáveis necessárias.
2. **Verificar ambiente**: `docker info` para confirmar que o daemon está ativo.
3. **Build & Deploy**: `docker compose up -d --build`
4. **Monitorar**: `docker compose ps`, `docker compose logs -f <service>`
5. **Cleanup**: `docker compose down -v` (remove containers + volumes) ou `docker system prune` para liberar espaço.

### Boas Práticas de Orquestração
- **Segredos**: nunca commite `.env` com credenciais reais. Use `.env.example` como template.
- **Persistência**: use `volumes` nomeados para dados críticos (ex: `postgres_data`).
- **Networking**: use redes user-defined (`bridge`) para isolação e resolução de nomes entre serviços.
- **Health Checks**: defina `healthcheck` nos serviços críticos para que dependências sejam respeitadas.

### Diagnóstico Rápido
- Inspecionar container: `docker inspect <container_id>`
- Estatísticas de recurso: `docker stats`
- Entrar no container: `docker exec -it <container> sh`


## Example: Secure Node.js Dockerfile
```dockerfile
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
# 1. Install dependencies first (Layer Caching)
COPY package*.json ./
RUN npm ci

# 2. Copy source code only after deps are installed
COPY . .
RUN npm run build

# Runtime Stage
FROM node:20-alpine
WORKDIR /app
# Copy artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
CMD ["node", "dist/main.js"]
```