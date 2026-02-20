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