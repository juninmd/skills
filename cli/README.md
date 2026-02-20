# @luizalabs/padrao-labs-agents CLI

Este diretório contém o código-fonte da CLI para o projeto Padrao Labs Agents.

## Como testar localmente

Para testar as alterações da CLI sem precisar publicar no Nexus, você pode seguir os passos abaixo:

### 1. Preparação (Raiz do projeto)

Certifique-se de que todas as dependências do workspace estão instaladas:

```bash
pnpm install
```

### 2. Build da CLI

Navegue até o diretório `cli` e execute o build e o bundle dos agents:

```bash
cd cli
pnpm run build
pnpm run bundle-agents
```

### 3. Execução Local

Existem três formas principais de testar a CLI localmente:

#### A. Usando `node` diretamente (Mais rápido para desenvolvimento)

Você pode executar o arquivo transpilado diretamente com o Node.js:

```bash
# No diretório /cli
node dist/index.js install --dry-run
```

#### B. Usando `npm link` (Simula instalação global)

Isso registrará o binário `padrao-labs-agents` no seu sistema:

```bash
# No diretório /cli
npm link

# Agora você pode usar o comando em qualquer lugar do seu terminal
padrao-labs-agents --help
```

*Para remover o link depois:* `npm unlink -g @luizalabs/padrao-labs-agents`

#### C. Usando `pnpm` a partir da raiz

Se você estiver na raiz do projeto, pode usar o comando `exec` do pnpm:

```bash
# Na raiz do projeto
pnpm --filter @luizalabs/padrao-labs-agents exec node dist/index.js init
```

### Dicas de Teste

- Use a flag `--dry-run` no comando `install` para ver o que seria feito sem alterar seus arquivos de configuração reais.
- Use a flag `--verbose` para ver detalhes da execução e logs de debug.
- Se estiver testando mudanças nos agents/skills/rules, lembre-se de rodar `pnpm run bundle-agents` dentro da pasta `cli` para atualizar o pacote interno que a CLI utiliza.

## Estrutura de Comandos

- `install`: Instala as regras e skills nas ferramentas detectadas.
- `update`: Atualiza a CLI (em ambiente real).
- `init`: Cria arquivos de configuração padrão no repositório atual.
- `cron`: Gerencia o auto-update diário.
