FROM node:lts-alpine

WORKDIR /app

COPY ./apps/docs /app

# .agents é necessário pelo loader.js no build (MONOREPO_ROOT = parent de /app)
COPY .agents /.agents

RUN mkdir -p /app/application/files

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN npm install -g pnpm \
    && pnpm config set store-dir .pnpm-store \
    && pnpm install \
    && pnpm build

CMD ["sh", "-c", "node server.js"]