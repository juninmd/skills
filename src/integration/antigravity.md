# Integracao com Google Antigravity

Guia para utilizar os padroes de desenvolvimento da Luizalabs no Google Antigravity (IDE interna do Google).

::: tip Instalacao Automatica (Recomendada)
A forma mais facil de instalar todas as skills, rules e workflows e usar nosso CLI automatico. Basta ter o [Node.js](https://nodejs.org) instalado e rodar:
```bash
npx @luizalabs/padrao-labs-agents install
```
Veja o guia completo em [Primeiros Passos](/getting-started).
:::

## Instalacao Manual

O Antigravity é um IDE "Agent-First" que lê automaticamente arquivos de contexto para guiar a IA. O arquivo padrão para regras de comportamento é o `AGENTS.md`.

### 1. Crie o arquivo AGENTS.md

Execute o comando abaixo na raiz do seu projeto para baixar a versão mais recente dos padrões:

```bash
curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents.md -o AGENTS.md
```

### 2. Comite no Repositório

É importante versionar este arquivo para que todos os desenvolvedores (e agentes) tenham o mesmo contexto.

```bash
git add AGENTS.md
git commit -m "docs: adiciona padrões luizalabs para antigravity"
git push
```

## ✨ Como Funciona

Uma vez que o `AGENTS.md` está na raiz:

- **Detecção Automática:** O Antigravity detecta o arquivo na inicialização do workspace.
- **Contexto Persistente:** Todas as sugestões de código, refatorações e chats levarão em conta as regras definidas (ex: não usar `console.log`, padrões de segurança, estrutura de testes).
- **Sem Configuração Extra:** Não é necessário instalar plugins adicionais.

## 📝 Melhores Práticas

- **Mantenha Atualizado:** Periodicamente, baixe novamente o arquivo para pegar novas regras de segurança e compliance.
- **Contexto Específico:** Você pode adicionar seções específicas do seu projeto ao final do `AGENTS.md`, mas evite alterar as regras core da Luizalabs.
