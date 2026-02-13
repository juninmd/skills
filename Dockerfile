FROM node:18-alpine

WORKDIR /app

# Instala make para Makefile
RUN apk add --no-cache make

# Copia package files
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia o resto do projeto
COPY . .

# Roda o loader para gerar documentação
RUN npm run generate:index

# Build para produção
RUN npm run docs:build

# Servidor HTTP simples para servir arquivos
FROM node:20-alpine

WORKDIR /app

# Instala http-server globalmente
RUN npm install -g http-server@14.1.1

# Copia os arquivos buildados
COPY --from=0 /app/docs/.vitepress/dist ./dist

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

# Usa o executável direto (não npm/pnpm)
CMD ["http-server", "dist", "-p", "5000", "-c-1", "--gzip", "-a", "0.0.0.0"]
