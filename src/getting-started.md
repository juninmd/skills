# Primeiros Passos

Bem-vindo ao Catalogo Luizalabs de Agentes e Skills de IA! Este guia vai te ajudar a configurar tudo do zero, mesmo que voce nunca tenha usado ferramentas de programacao antes.

---

## Antes de Comecar: Instalando o Node.js

O nosso instalador usa uma ferramenta chamada **npx**, que vem junto com o **Node.js**. O Node.js e um programa gratuito e seguro, usado por milhoes de pessoas no mundo todo.

### O que e o Node.js?

E um programa que roda no seu computador e permite executar ferramentas de linha de comando (como o nosso instalador). Voce so precisa instalar uma vez.

### Como instalar

1. Acesse **[nodejs.org](https://nodejs.org)**
2. Clique no botao verde **LTS** (versao recomendada)
3. Baixe e execute o instalador
4. Siga os passos do instalador (pode clicar "Next" em tudo)
5. Quando terminar, abra o **Terminal** e digite:

```bash
node --version
```

Se aparecer algo como `v20.x.x` ou `v22.x.x`, esta tudo certo!

::: tip Como abrir o Terminal?
- **Windows:** Pressione `Win + R`, digite `cmd` e pressione Enter. Ou procure por "Prompt de Comando" no Menu Iniciar.
- **Mac:** Pressione `Cmd + Espaco`, digite `Terminal` e pressione Enter.
- **Linux:** Pressione `Ctrl + Alt + T`.
:::

---

## Instalacao Automatica (Recomendada)

Com o Node.js instalado, basta colar este comando no terminal e pressionar Enter:

```bash
npx @luizalabs/padrao-labs-agents install
```

**O que esse comando faz:**
- Detecta automaticamente quais ferramentas de IA voce tem instaladas (Copilot, Claude, Gemini, etc.)
- Copia todos os agents, skills, rules, hooks e workflows para os diretorios corretos de cada ferramenta
- Nao altera nenhum arquivo existente do seu projeto

### Outros Comandos Uteis

| Comando | O que faz |
| :--- | :--- |
| `npx @luizalabs/padrao-labs-agents install` | Instala tudo nas suas ferramentas de IA |
| `npx @luizalabs/padrao-labs-agents update` | Atualiza para a versao mais recente |
| `npx @luizalabs/padrao-labs-agents init` | Padroniza um repositorio com arquivos de configuracao |
| `npx @luizalabs/padrao-labs-agents cron` | Configura atualizacao automatica diaria |

---

## O que Voce Encontra no Catalogo

### Skills (70+)

Skills sao "habilidades" prontas que ensinam a IA a realizar tarefas especificas. Exemplos:

- Criar e configurar containers Docker
- Montar pipelines de CI/CD
- Configurar bancos de dados
- Rodar testes automatizados
- Fazer scans de seguranca

Veja todas em [Skills](/skills/).

### Agents

Agents sao instrucoes pre-configuradas para cada ferramenta de IA. Temos agents para:

- GitHub Copilot (VS Code)
- Google Antigravity
- Gemini CLI
- Claude
- Cursor
- Windsurf
- Cline

Veja todos em [Agentes](/agents/).

### Rules (Regras)

Regras que a IA segue automaticamente, como:

- Boas praticas de seguranca
- Padroes de qualidade de codigo
- Convencoes de nomenclatura

Veja todas em [Regras](/rules/).

### Hooks e Workflows

Automacoes que rodam em momentos especificos:

- Verificacoes antes de salvar um arquivo
- Pipelines de deploy automatizado
- Fluxos de trabalho padronizados

Veja em [Hooks](/hooks/) e [Workflows](/workflows/).

---

## Instalacao Manual (Alternativa)

Se preferir instalar manualmente em uma ferramenta especifica, siga o guia correspondente:

<InstallTabs>
  <template #copilot>

```bash
# 1. Va ate a pasta do seu projeto
cd seu-projeto

# 2. Crie a pasta .github (se nao existir)
mkdir -p .github

# 3. Baixe os padroes
curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents/index.md -o agents.md
curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents/index.md -o .github/copilot-instructions.md

# 4. Salve no Git
git add agents.md .github/copilot-instructions.md
git commit -m 'docs: add luizalabs development standards'

# 5. Reinicie o VS Code
```

  </template>
  <template #antigravity>

```bash
# 1. Va ate a pasta do seu projeto
cd seu-projeto

# 2. Baixe os padroes como AGENTS.md
curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents/index.md -o AGENTS.md

# 3. Salve no Git
git add AGENTS.md
git commit -m 'docs: add luizalabs development standards'

# 4. Pronto!
```

  </template>
  <template #gemini>

```bash
# 1. Va ate a pasta do seu projeto
cd seu-projeto

# 2. Baixe o agents.md
curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents/index.md -o agents.md

# 3. Crie o arquivo de configuracao .gemini.json
cat > .gemini.json << 'EOF'
{
  "projectId": "seu-projeto-gcp",
  "context": {
    "files": ["agents.md"],
    "systemPrompt": "Follow the patterns defined in agents.md"
  },
  "generation": {
    "model": "gemini-2.0-flash",
    "temperature": 0.7
  }
}
EOF

# 4. Salve no Git
git add agents.md .gemini.json
git commit -m 'docs: add luizalabs development standards'

# 5. Comece a usar!
```

  </template>
</InstallTabs>

---

## Ferramenta GSMPatch (Google Secret Manager)

O **gsmpatch.sh** e um script utilitario para gerenciar segredos (senhas, chaves de API, credenciais) no Google Secret Manager (GSM). Ele simplifica a criacao e versionamento de secrets nos projetos GCP da Luizalabs.

### Pre-requisitos do GSMPatch

Antes de usar, voce precisa instalar:

1. **gcloud CLI** - Ferramenta oficial do Google Cloud. Instale em [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
2. **jq** - Processador de JSON para linha de comando. Instale em [stedolan.github.io/jq/download](https://stedolan.github.io/jq/download/)

### Como usar o GSMPatch

```bash
# Baixe o script
curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/src/downloads/gsmpatch.sh -o gsmpatch.sh
chmod +x gsmpatch.sh

# Exemplo: Criar um secret com valor de texto
./gsmpatch.sh \
  --project maga-homolog \
  --app MINHA-APP \
  --secret-name DATABASE_URL \
  --secret-value "postgresql://user:pass@host:5432/db" \
  --vertical minha-vertical \
  --tribe minha-tribo \
  --squad meu-squad

# Exemplo: Criar um secret a partir de um arquivo
./gsmpatch.sh \
  --project maga-homolog \
  --app MINHA-APP \
  --secret-name GOOGLE_APPLICATION_CREDENTIALS \
  --secret-file ./credentials.json \
  --pod-file-path /application/files/credentials.json \
  --vertical minha-vertical \
  --tribe minha-tribo \
  --squad meu-squad
```

O script vai mostrar o que precisa ser adicionado ao `values.yaml` do seu deploy apos criar o secret.

---

## Resolucao de Problemas

### A ferramenta de IA nao esta usando os padroes

- Verifique se o arquivo esta no local correto (veja os guias de cada ferramenta)
- Reinicie o editor de codigo (VS Code, Cursor, etc.)
- No terminal, feche e abra novamente

### O comando `npx` nao funciona

- Verifique se o Node.js esta instalado: `node --version`
- Se nao esta instalado, siga as instrucoes no inicio desta pagina
- Se o Node.js esta instalado mas `npx` nao funciona, tente reinstalar o Node.js

### Quero atualizar os padroes

Execute o comando de atualizacao:

```bash
npx @luizalabs/padrao-labs-agents update
```

Ou configure a atualizacao automatica diaria:

```bash
npx @luizalabs/padrao-labs-agents cron
```

---

## Proximos Passos

1. **Instale os padroes** usando o comando `npx @luizalabs/padrao-labs-agents install`
2. **Escolha sua ferramenta** - veja os guias em [Copilot](/integration/copilot), [Antigravity](/integration/antigravity) ou [Gemini CLI](/integration/gemini)
3. **Explore as Skills** disponiveis em [Skills](/skills/)
4. **Leia os Conceitos Basicos** em [Conceitos Basicos](/agentic-concepts) para entender como agents e skills funcionam
