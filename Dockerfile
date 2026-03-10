# ==========================
# Stage 1: Build
# ==========================
FROM node:lts-alpine AS builder

WORKDIR /app

COPY ./apps/docs /app

# .agents e necessario pelo loader.js no build (MONOREPO_ROOT = parent de /app)
COPY .agents /.agents

RUN mkdir -p /app/application/files

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN npm install -g pnpm \
    && pnpm config set store-dir .pnpm-store \
    && pnpm install \
    && pnpm build

# ==========================
# Stage 2: Runtime
# ==========================
FROM node:lts-alpine AS runtime

WORKDIR /app

# Copia apenas o necessario para execucao
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/docs/.vitepress/dist ./docs/.vitepress/dist
COPY --from=builder /app/docs/catalog.json ./docs/catalog.json
COPY --from=builder /app/application ./application

# Instala apenas dependencias de producao (sem vitepress, vue, etc.)
COPY ./apps/docs/package.json ./package.json
RUN npm install -g pnpm \
    && pnpm config set store-dir .pnpm-store \
    && pnpm install --prod \
    && rm -rf .pnpm-store

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:5000/ || exit 1

# Executa como usuario nao-root (node user ja existe na imagem node:alpine)
USER node

CMD ["node", "server.js"]