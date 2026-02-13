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
RUN npm install -g http-server

WORKDIR /app

# Copia os arquivos buildados
COPY --from=0 /app/docs/.vitepress/dist ./dist

EXPOSE 8080

CMD ["http-server", "dist", "-p", "8080", "-c-1", "--gzip"]
