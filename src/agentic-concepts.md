---
title: Conceitos Básicos de Agentes
description: Guia introdutório sobre Agentes, Skills, Workflows e as diferenças entre Copilot, Antigravity e Gemini CLI.
---

# Conceitos Básicos (Para não se perder)

Antes de abrir os softwares, entenda os termos como se fossem funcionários de uma empresa:

*   **Agent (Agente):** É o "funcionário". Você dá uma meta ("crie um site") e ele decide os passos.
*   **Sub-agent:** É o "assistente do funcionário". O agente principal pede ajuda a um especialista (ex: um só para banco de dados).
*   **Skills (Habilidades/Tools):** São as ferramentas que o agente sabe usar (ex: ler um arquivo, rodar um comando no terminal, pesquisar no Google).
*   **Workflows (Fluxos):** É o roteiro. "Primeiro planeje, depois escreva o código, depois teste".
*   **Rules (Regras):** O manual de conduta. "Sempre escreva em Português", "Nunca apague o banco de dados".
*   **Hooks (Ganchos):** São "alarmes automáticos". "Sempre que o agente for salvar um arquivo, verifique se tem erros antes".

---

## 1. Github Copilot (no VS Code)

O Copilot evoluiu de um "corretor automático" para um Agente.

**Onde encontrar:** Dentro do VS Code, na barra lateral (ícone do Chat).

### Passo a Passo:

1.  **Ativar o Modo Agent:**
    *   Abra o Chat do Copilot (`Ctrl+Alt+I` ou `Cmd+Alt+I`).
    *   No topo do chat, mude de "Copilot" para "Agent Mode" (ou procure pelo botão de alternância que diz "Agent").
    *   *Diferença:* O modo normal só responde perguntas. O modo Agent pode criar, editar e rodar comandos sozinho.

2.  **Usando Skills (Comandos @):**
    *   No chat, digite `@`. Uma lista aparecerá.
    *   `@workspace`: O agente "lê" todo o seu projeto. Use para: "Explique como esse projeto funciona".
    *   `@terminal`: Dá poder ao agente para rodar comandos (instalar programas, rodar testes).
    *   *Exemplo:* Digite `@workspace Crie um arquivo Python que imprima 'Olá' e execute-o.`

3.  **Definindo Rules (Regras):**
    *   Crie um arquivo na raiz do seu projeto chamado `.github/copilot-instructions.md`.
    *   Escreva dentro dele em linguagem natural.
    *   *Exemplo:* "Sempre comente o código em Português. Use sempre Python moderno." O Copilot lerá isso automaticamente antes de responder qualquer coisa.

4.  **Criando "Workflows" (Planos):**
    *   No modo Agent, peça: "Crie um plano para fazer um formulário de login".
    *   Ele vai gerar um passo a passo. Você pode clicar em "Implementar" e ele vai executar arquivo por arquivo.

---

## 2. Google Antigravity

**Nota:** O Google Antigravity é uma IDE nova (um editor de código "primo" do VS Code) focado totalmente em agentes autônomos.

**Onde encontrar:** É um software separado que você instala (fork do VS Code).

### Passo a Passo:

1.  **A Interface (Mission Control):**
    *   Ao abrir, você verá duas visões principais: o Editor (código normal) e o Agent Manager (Gerente de Agentes).
    *   Vá para o **Agent Manager**. É aqui que a mágica acontece. Você não codifica aqui, você "manda".

2.  **Usando Agents e Sub-agents:**
    *   Clique em "New Task" (Nova Tarefa).
    *   Digite algo complexo: "Crie um aplicativo de lista de tarefas completo".
    *   O Antigravity vai "invocar" um Agente Principal.
    *   *O Pulo do Gato:* Se a tarefa for difícil, você verá o agente principal criando "sub-agentes" na tela (ex: um 'Coder' para escrever e um 'Reviewer' para corrigir). Você vê eles conversando entre si.

3.  **Artifacts (Entregáveis):**
    *   Diferente do chat normal, o Antigravity gera Artifacts.
    *   No painel lateral, ele não mostra só texto, ele mostra o "Site rodando" ou o "Plano de Ação".
    *   Clique nos Artifacts para aprovar ou pedir alterações.

4.  **Workflows (O ciclo automático):**
    *   O Antigravity trabalha em loop: Planejar -> Codar -> Rodar -> Erro -> Corrigir.
    *   Seu trabalho é olhar o console. Se ele travar, ele vai te pedir permissão: "Posso rodar esse comando para consertar?". Você só clica em "Approve".

---

## 3. Google Gemini CLI

Esta é a ferramenta para quem gosta de tela preta (Terminal). É mais técnica, mas muito poderosa.

**Como instalar (Pré-requisito):** Você precisa ter o Node.js instalado. No terminal:
```bash
npm install -g @google/gemini-cli
```

### Passo a Passo:

1.  **Contexto (A memória do Agente - GEMINI.md):**
    *   Em qualquer pasta que você for trabalhar, crie um arquivo chamado `GEMINI.md`.
    *   Escreva ali o contexto do projeto.
    *   *Exemplo:* "Este é um projeto pessoal de finanças. Eu uso planilhas CSV."
    *   O Gemini CLI lê isso automaticamente sempre que você abrir o terminal nessa pasta.

2.  **Shell Mode (O Agente no comando):**
    *   Abra o terminal e digite `gemini`.
    *   Para ativar o modo "Agente que mexe no computador", digite `!` (ponto de exclamação).
    *   Agora digite: `Liste todos os arquivos PDF desta pasta e mova para uma pasta 'Docs'.`
    *   Ele vai gerar os comandos do sistema e perguntar: "Posso rodar?". Dê Enter.

3.  **Hooks (Ganchos/Automação):**
    *   *Para leigos:* Imagine que você quer que o Gemini verifique seu trabalho sempre que você terminar.
    *   Isso é configurado num arquivo `.gemini/settings.json`.
    *   Você instala "Extensões" que usam hooks. Por exemplo, uma extensão de "Segurança" pode ter um Hook que diz: "Antes de o Gemini escrever qualquer código, verifique se não estou vazando senhas".
    *   *Para usar:* Apenas instale a extensão desejada via `gemini install <nome-da-extensao>` e o Hook fica ativo sozinho.

---

## Resumo: Qual usar?

| Se você quer... | Use esta ferramenta |
| :--- | :--- |
| Trabalhar no dia a dia com ajuda inteligente dentro do código. | **Github Copilot (VS Code)** |
| Gerenciar um projeto e deixar a IA fazer quase tudo sozinha (Agente Autônomo). | **Google Antigravity** |
| Automatizar tarefas do computador (arquivos, pastas, scripts) via texto. | **Google Gemini CLI** |
