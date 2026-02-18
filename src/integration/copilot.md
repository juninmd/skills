# Integracao com GitHub Copilot

Guia para configurar os padroes da Luizalabs no GitHub Copilot (VS Code e Visual Studio).

::: tip Instalacao Automatica (Recomendada)
A forma mais facil de instalar todas as skills e rules e usar nosso CLI automatico. Basta ter o [Node.js](https://nodejs.org) instalado e rodar:

```bash
npx @luizalabs/padrao-labs-agents install
```

Veja o guia completo em [Primeiros Passos](/getting-started).
:::

## Configuracao Manual no VS Code

O GitHub Copilot agora suporta instruções personalizadas através de arquivos na pasta `.github`.

### 1. Crie o arquivo de instruções

Crie o diretório `.github` e o arquivo `copilot-instructions.md`:

```bash
mkdir -p .github
touch .github/copilot-instructions.md
```

### 2. Defina as Regras

Adicione o seguinte conteúdo ao arquivo `.github/copilot-instructions.md`. Isso garantirá que o Copilot conheça as diretrizes essenciais.

```markdown
# Instruções Luizalabs

Você é um assistente de IA focado em qualidade e segurança, seguindo os padrões da Luizalabs.

## Regras Críticas
1. **Segurança:** Nunca exponha segredos ou chaves de API. Use variáveis de ambiente.
2. **Testes:** Todo código novo deve ter testes unitários. Cobertura mínima de 90%.
3. **Logs:** Não logue dados sensíveis (PII). Use logs estruturados (JSON) em produção.
4. **Linguagem:** Prefira TypeScript para Node.js e Python 3.11+ para scripts.
5. **Commits:** Use Conventional Commits (feat:, fix:, docs:, chore:).

## Contexto Completo
Para regras detalhadas sobre arquitetura e pipelines, consulte o arquivo `AGENTS.md` na raiz deste repositório.
```

### 3. Baixe o AGENTS.md (Opcional mas Recomendado)

Para que o Copilot tenha acesso aprofundado quando necessário, mantenha o arquivo completo na raiz:

```bash
curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents.md -o AGENTS.md
```

## ✨ Funcionalidades Habilitadas

- **Chat Contextual:** O Copilot Chat lerá as instruções antes de responder.
- **Sugestões em Linha:** O autocomplete respeitará convenções de nomenclatura e tipagem definidas.
- **Geração de Testes:** Ao pedir testes (`/tests`), ele seguirá o padrão exigido (ex: Jest ou Pytest com 90% coverage).

## 🔄 Validação

Para testar se está funcionando, abra o Copilot Chat e pergunte:
"Quais são as regras de log da Luizalabs?"
Ele deve responder baseando-se no arquivo de instruções que você criou.
