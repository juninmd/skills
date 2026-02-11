# Integração com Gemini CLI

Guia para utilizar o catálogo de Skills da Luizalabs com a interface de linha de comando do Gemini.

## O que é o Gemini CLI?

O Gemini CLI é uma ferramenta de automação que permite executar tarefas complexas, gerenciar arquivos e interagir com seu sistema operacional usando linguagem natural. Ele pode ser estendido através de **Skills**.

## Instalação

### 1. Instale o Gemini CLI

Caso ainda não tenha instalado:

```bash
npm install -g @google/gemini-cli
```

### 2. Instale o Catálogo de Skills

Você pode instalar todas as skills da Luizalabs diretamente do repositório oficial:

```bash
gemini skills install git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git
```

Para instalar apenas uma skill específica (ex: Git):

```bash
gemini skills install git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git --path .agents/skills/git-skill
```

### 3. Instalação Local (Para Desenvolvimento)

Se você clonou este repositório e quer usar as skills locais:

```bash
gemini skills install . --scope workspace
```

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
