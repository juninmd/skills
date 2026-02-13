FROM node:lts-alpine

WORKDIR /app

COPY . /app

RUN mkdir -p /app/application/files

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN npm install -g pnpm \
    && pnpm config set store-dir .pnpm-store \
    && pnpm install \
    && pnpm docs:build

CMD ["sh", "-c", "node server.js"]