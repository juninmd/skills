FROM node:lts-alpine

RUN apk add --no-cache openssl

WORKDIR /app
COPY . /app
RUN mkdir -p /application/files
RUN npm install
RUN npm run build

# Configurações de memória para Node.js
ENV NODE_OPTIONS="--max-old-space-size=2048 --max-semi-space-size=128"

CMD ["npm", "start"]

