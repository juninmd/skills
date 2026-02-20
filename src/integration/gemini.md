# Integracao com Gemini CLI

Guia para utilizar o catalogo de Skills da Luizalabs com a interface de linha de comando do Gemini.

## O que e o Gemini CLI?

O Gemini CLI e uma ferramenta de automacao que permite executar tarefas complexas, gerenciar arquivos e interagir com seu sistema operacional usando linguagem natural. Ele pode ser estendido atraves de **Skills**.

::: tip Instalacao Automatica (Recomendada)
A forma mais facil de instalar todas as skills e usar nosso CLI automatico. Basta ter o [Node.js](https://nodejs.org) instalado e rodar:

```bash
npx @luizalabs/padrao-labs-agents install
```

Veja o guia completo em [Primeiros Passos](/getting-started).
:::

## Instalacao Manual

### 1. Instale o Gemini CLI

Caso ainda não tenha instalado:

```bash
npm install -g @google/gemini-cli
```

### 2. Instale o Catálogo de Skills

Você pode instalar todas as skills da Luizalabs diretamente do repositório oficial:

<InstallTabs
  gemini="gemini skills install git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git"
  copilot="copilot skills install git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git"
  antigravity="antigravity skills install git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git"
/>

Para instalar apenas uma skill específica (ex: Git):

<InstallTabs
  gemini="gemini skills install git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git --path .agent/skills/git-skill"
  copilot="copilot skills install git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git --path .agent/skills/git-skill"
  antigravity="antigravity skills install git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git --path .agent/skills/git-skill"
/>

### 3. Instalação Local (Para Desenvolvimento)

Se você clonou este repositório e quer usar as skills locais:

#### Para Skills (Copilot, Antigravity, Gemini)

```bash
# Copiar skill específica para VSCode Copilot
mkdir -p ~/.copilot/skills && cp -r .agent/skills/git-skill ~/.copilot/skills/

# Copiar skill específica para Antigravity
mkdir -p ~/.gemini/antigravity/skills && cp -r .agent/skills/git-skill ~/.gemini/antigravity/skills/

# Copiar skill específica para Gemini
mkdir -p ~/.gemini/skills && cp -r .agent/skills/git-skill ~/.gemini/skills/
```

#### Para Rules

```bash
# Copiar rule para VSCode Copilot
mkdir -p ~/.copilot/rules && cp -r .agent/rules/<rule-name> ~/.copilot/rules/

# Copiar rule para Antigravity
mkdir -p ~/.gemini/antigravity/rules && cp -r .agent/rules/<rule-name> ~/.gemini/antigravity/rules/

# Gemini CLI: Não suporta rules
```

#### Para Workflows

```bash
# Copiar workflow para VSCode Copilot
mkdir -p ~/.copilot/workflows && cp -r .agent/workflows/<workflow-name> ~/.copilot/workflows/

# Copiar workflow para Antigravity
mkdir -p ~/.gemini/antigravity/workflows && cp -r .agent/workflows/<workflow-name> ~/.gemini/antigravity/workflows/

# Gemini CLI: Não suporta workflows
```

#### Para Hooks (apenas Gemini CLI)

Configure hooks no arquivo `~/.gemini/settings.json`. Exemplo:

```json
{
  "hooks": {
    "BeforeTool": [
      {
        "matcher": "write_file|replace",
        "hooks": [
          {
            "name": "security-check",
            "type": "command",
            "command": "$GEMINI_PROJECT_DIR/.gemini/hooks/security.sh",
            "timeout": 5000
          }
        ]
      }
    ]
  }
}
```

Veja a documentação completa: <https://geminicli.com/docs/hooks/>

## 🚀 Como Usar

Com as skills instaladas, o Gemini ganha "superpoderes" específicos. Você pode pedir tarefas como:

### Operações de Git

```text
Gemini, crie uma branch chamada 'feat/nova-funcionalidade' e faça o commit das minhas alterações seguindo o padrão.
```

*(Usa a skill `git-skill`)*

### Auditoria de Segurança

```text
Verifique se existem credenciais expostas no meu código.
```

*(Usa a skill `security-skill`)*

### Infraestrutura

```text
Gere um Dockerfile otimizado para esta aplicação Python.
```

*(Usa a skill `docker-containers`)*

## 🛠️ Gerenciando Skills

Listar skills instaladas:

```bash
gemini skills list
```

Remover uma skill:

```bash
gemini skills uninstall git-skill
```

Atualizar skills (reinstale):

```bash
gemini skills install git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git --force
```

## 🪝 Hooks (Exclusivo Gemini CLI)

Além das skills, este projeto fornece **Hooks** para estender e proteger seu fluxo de trabalho no terminal.

> **⚠️ Importante:** Os hooks descritos abaixo e contidos no diretório `.agent/hooks/` são exclusivos para uso com o **Gemini CLI**. Eles não funcionam em outros ambientes como VSCode, Antigravity ou terminais padrão sem a ferramenta Gemini instalada e configurada.

Hooks permitem interceptar e customizar o comportamento do Gemini CLI em pontos específicos do loop do agente. Eles funcionam de forma síncrona, ou seja, o CLI aguarda a execução do hook antes de prosseguir.

Principais usos incluem:

- **Segurança:** Validar comandos perigosos antes da execução.
- **Contexto:** Injetar informações do ambiente (git, k8s) no prompt.
- **Compliance:** Garantir que regras do projeto sejam seguidas.
- **Logging:** Registrar interações para auditoria.

### Documentação Oficial de Hooks

Para aprofundar seu conhecimento sobre como criar, configurar e manter hooks no Gemini CLI, consulte as referências oficiais:

- [Visão Geral de Hooks](https://geminicli.com/docs/hooks/)
- [Escrevendo Hooks](https://geminicli.com/docs/hooks/writing-hooks/)
- [Melhores Práticas](https://geminicli.com/docs/hooks/best-practices/)
- [Referência Completa](https://geminicli.com/docs/hooks/reference/)
