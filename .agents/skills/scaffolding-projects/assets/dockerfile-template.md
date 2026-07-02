# Dockerfile Template (Repository Standard)

```dockerfile
FROM python:3.12-bullseye

# Instalação de dependências do sistema (Make é obrigatório)
RUN apt-get update && 
    apt-get install -y --no-install-recommends make && 
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instalação de dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Cópia do código
COPY . .

# Comando padrão via Makefile
CMD ["make", "server"]
```

