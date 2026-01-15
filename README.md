# Padrao Labs para Agents de desenvolvimento

A ideia aqui é ter um agent de desenvolvimento que respeite os padrões Labs, de maneira a desenvolver uma solução qualquer sem perder os padrões do Labs. 


## Como usar?
| Ferramenta / IDE | Nome do Arquivo | Localização | Descrição |
| :--- | :--- | :--- | :--- |
| **Google Antigravity** | `AGENTS.md` | Raiz `/` | Contexto padrão para o ambiente Antigravity/Gemini. |
| **Cursor** | `.cursorrules` | Raiz `/` | **(Padrão de Indústria)** Define regras de sistema lidas antes de qualquer prompt. |
| **Windsurf** (Codeium) | `.windsurfrules` | Raiz `/` | Define o comportamento dos "Cascades" e contexto do agente. |
| **GitHub Copilot (VS Code / Visual Studio)** | `copilot-instructions.md` | `.github/` | Instruções persistentes para o chat e autocompletion do Copilot. |
| **Roo Code** / **Cline** | `.clinerules` | Raiz `/` | Essencial para loops agênticos autônomos (uso de ferramentas/terminal). |
| **Aider** (CLI) | `CONVENTIONS.md` | Raiz `/` | Usado para ditar convenções de código em refatorações via terminal. |


## Estratégia "Master Agent" (Compatibilidade Universal)
Para garantir que seu projeto seja entendido por qualquer IA que interaja com ele, recomenda-se a seguinte estrutura de arquivos:

```text
meu-projeto/
├── AGENTS.md                  # Para Antigravity/Gemini
├── .cursorrules               # Para Cursor (e fallback geral)
├── .github/
│   └── copilot-instructions.md # Para usuários de VS Code/Copilot
├── src/
└── ... 
```

## Contribuição
Fique à vontade para contribuir! Vamos deixar isto o mais fiel possível as regras Magalu!

## Backlog 
- Linguagens e framework padrão 
- GMUD 

