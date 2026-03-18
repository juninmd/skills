# Primeiros Passos

Bem-vindo ao Catalogo Luizalabs de Agentes e Skills de IA! Este guia vai te ajudar a configurar e entender tudo do zero, focando na sua experiência com o Visual Studio Code e o GitHub Copilot.

---

## 1. O que é Engenharia Agêntica?

A indústria de desenvolvimento de software está transitando de um modelo assistido por ferramentas passivas para um paradigma de colaboração ativa com Inteligência Artificial (IA), denominado "Engenharia Agêntica". Diferentemente dos assistentes de codificação do passado (apenas autocompletar), as plataformas contemporâneas introduzem o conceito de "Agentes Autônomos", que percebem o ambiente, planejam ações, usam ferramentas e iteram sobre erros.

Antes de abrir o VS Code, entenda os termos como se fossem a estrutura de uma empresa:

* **Agent (Agente):** É o "funcionário" ou colaborador sênior. Você dá uma meta (ex: "crie um site") e ele orquestra os passos. No VS Code, é o `@copilot`.
* **Sub-agent (Sub-agente):** É o "assistente" ou especialista terceirizado. Quando o agente principal tem uma tarefa complexa, ele delega para focar na memória principal.
* **Skills (Habilidades/Tools):** São os "manuais de procedimentos". É o pacote de conhecimento que ensina ao agente como executar uma ferramenta ou roteiro (ex: migração de banco de dados).
* **Workflows (Fluxos):** É o "procedimento padrão" (SOP). Sequência obrigatória e ordenada de passos para garantir consistência.
* **Rules (Regras):** O "manual de conduta" ou "políticas da empresa". Diretrizes persistentes, como "Sempre escreva em Português" ou "Nunca exponha segredos".

---

## 2. GitHub Copilot no Visual Studio Code

O Copilot evoluiu de um "corretor automático" para um Agente completo capaz de orquestrar a construção de código dentro do editor. A filosofia é manter o desenvolvedor no controle ("human-in-the-loop").

### Passo a Passo de Operação Básica

1. **Ativar o Modo Agent:**
    * Abra o Chat do Copilot (`Ctrl+Alt+I` ou `Cmd+Alt+I`).
    * Certifique-se de usar o modo Agent para que a IA possa criar, editar e rodar comandos sozinha.

2. **Contexto e Comandos:**
    * Digite `@` no chat para acessar comandos e contexto.
    * `@workspace`: O agente lê todo o seu projeto. (ex: `@workspace Explique como esse projeto funciona`).
    * `#file:nome-do-arquivo.ts` ou `#selection`: Foca a atenção do agente.
    * `/tests`: Atalho para criar testes.

3. **Sub-agentes (`#runSubagent`):**
    * Use sub-agentes para evitar saturar a janela de contexto em conversas longas.
    * *Exemplo:* `@copilot Analise a arquitetura de banco de dados. Utilize #runSubagent para investigar e retorne apenas o relatório de recomendações.`

---

## 3. Instalando o Node.js (Pré-requisito)

O nosso instalador automático requer o Node.js. Você só precisa instalar uma vez.

1. Acesse **[nodejs.org](https://nodejs.org)**, baixe e instale a versão **LTS** (recomendada).
2. Quando terminar, abra o **Terminal** e digite:
   ```bash
   node --version
   ```
   Se aparecer `v18.x.x` ou superior, está tudo certo!

---

## 4. Instalacao Automatica (Recomendada)

Com o Node.js instalado, basta colar este comando no terminal e pressionar Enter:

```bash
padrao-labs-agents install
```

**O que esse comando faz:**
- Detecta automaticamente o Visual Studio Code.
- Copia todos os agents, skills, rules e workflows para o diretório `.github` e outras pastas necessárias no seu ambiente.
- Não altera arquivos do projeto, apenas configura a ferramenta de IA.

### Outros Comandos Uteis

| Comando | O que faz |
| :--- | :--- |
| `padrao-labs-agents install` | Instala tudo na sua ferramenta (VS Code / Copilot) |
| `padrao-labs-agents update` | Atualiza para a versao mais recente |
| `padrao-labs-agents init` | Padroniza um repositorio com arquivos de configuracao |
| `padrao-labs-agents cron` | Configura atualizacao automatica diaria |

---

## 5. Instalacao Manual e Configuração (Alternativa)

Se preferir instalar manualmente para o seu GitHub Copilot:

### 1. Crie o arquivo de instruções
O Copilot suporta regras personalizadas através do arquivo `copilot-instructions.md`.
```bash
mkdir -p .github
touch .github/copilot-instructions.md
```

### 2. Defina as Regras
Adicione suas regras no `.github/copilot-instructions.md`:
```markdown
# Instruções Luizalabs

Você é um assistente de IA focado em qualidade e segurança.
1. **Segurança:** Nunca exponha segredos ou chaves de API.
2. **Testes:** Todo código novo deve ter testes unitários.
```

### 3. Baixe as Skills e Padrões Completos
```bash
curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents/index.md -o agents.md
```

### 4. Salve e Faça o Commit
```bash
git add .github/copilot-instructions.md agents.md
git commit -m 'docs: add luizalabs development standards for copilot'
```

---

## 6. O que Voce Encontra no Catalogo

Com a instalação concluída, você tem acesso local a:

- **[Skills](/skills/) (70+):** Manuais prontos ensinando o Copilot tarefas como configurar Docker ou rodar scans de segurança. Ficam em `.github/skills`.
- **[Agents](/agents/):** Funcionalidades de persona e orquestração pré-configuradas.
- **[Regras](/rules/):** Diretrizes persistentes de qualidade, segurança e convenção.
- **[Workflows](/workflows/):** Automações de ciclos completos (deploy, revisão).

---

## 7. Ferramenta GSMPatch (Google Secret Manager)

O **gsmpatch.sh** é um script utilitário para gerenciar segredos no Google Cloud. 

**Pré-requisitos:** [gcloud CLI](https://cloud.google.com/sdk/docs/install) e [jq](https://stedolan.github.io/jq/download/).

```bash
# Baixe o script
curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/src/downloads/gsmpatch.sh -o gsmpatch.sh
chmod +x gsmpatch.sh

# Exemplo: Criar um secret de texto
./gsmpatch.sh \
  --project maga-homolog \
  --app MINHA-APP \
  --secret-name DATABASE_URL \
  --secret-value "postgresql://user:pass@host:5432/db" \
  --vertical minha-vertical \
  --tribe minha-tribo \
  --squad meu-squad
```

O script vai mostrar o que adicionar ao `values.yaml` do seu deploy.

---

## 8. Resolucao de Problemas

### O Copilot não está usando os padrões
- Verifique se o arquivo `.github/copilot-instructions.md` está no local correto.
- Reinicie o Visual Studio Code.
- No terminal, feche e abra novamente.

### Quero atualizar os padrões
Execute o comando de atualização:
```bash
padrao-labs-agents update
```