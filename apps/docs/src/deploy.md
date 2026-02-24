# Instrucoes de Deploy

Este guia explica como fazer deploy das suas aplicacoes na infraestrutura Luizalabs, incluindo configuracao de ArgoCD, DNS e gerenciamento de segredos.

---

## Pre-requisitos

Antes de comecar, certifique-se de que voce tem:

1. **Acesso ao GitLab** - Seu repositorio deve estar no GitLab da Luizalabs
2. **gcloud CLI** instalado - [Guia de Instalacao](https://cloud.google.com/sdk/docs/install)
3. **kubectl** configurado para o cluster correto
4. **ci-knife** disponivel no pipeline (ja vem configurado no `.gitlab-ci.yml` padrao)

---

## ArgoCD

O ArgoCD e a ferramenta que sincroniza o estado do seu repositorio Git com o cluster Kubernetes. Quando voce faz push de uma mudanca, o ArgoCD detecta e aplica automaticamente.

### Ambientes Disponiveis

| Ambiente | URL do ArgoCD | Uso |
| :--- | :--- | :--- |
| **Homologacao (HML)** | `https://argocd-mke-operacoes-hml.ipet.sh` | Testes e validacao |
| **Producao (PRD)** | Consulte o time de infraestrutura | Ambiente de producao |

### Como acessar o ArgoCD

1. Abra a URL do ArgoCD do ambiente desejado no navegador
2. Faca login com suas credenciais corporativas
3. Procure sua aplicacao pelo nome (geralmente o mesmo nome do repositorio)
4. Verifique se o status esta **Synced** (sincronizado) e **Healthy** (saudavel)

---

## Configuracao de DNS

Ao configurar o `host` no arquivo `values.yaml` com o dominio `.mgc-hml.mglu.io`, os registros DNS sao criados automaticamente apontando para o IP do Ingress Controller.

### Exemplo de values.yaml

```yaml
ingress:
  enabled: true
  hosts:
    - host: minha-app.mgc-hml.mglu.io
      paths:
        - path: /
          pathType: Prefix
```

::: tip
O DNS automatico so funciona para o dominio `*.mgc-hml.mglu.io`. Para outros dominios, entre em contato com o time de infraestrutura.
:::

---

## Pipeline CI/CD com ci-knife

O `ci-knife` e a ferramenta padrao para automacao de pipelines na Luizalabs. Ele cuida de build, testes, deploy e seguranca.

### Etapas do Pipeline

1. **Build** - Compila o codigo e gera a imagem Docker
2. **Test** - Roda os testes automatizados
3. **Security** - Executa scans de seguranca (Atena)
4. **Deploy HML** - Faz deploy automatico em homologacao
5. **Deploy PRD** - Faz deploy em producao (requer aprovacao manual)

### Comandos ci-knife Mais Usados

```bash
# Deploy via ArgoCD
ci-knife argocd-deploy --tag $DEPLOY_TAG --server $ARGOCD_SERVER --namespace $NAMESPACE

# Scan de seguranca
ci-knife security-scanner --project $CI_PROJECT_NAME

# Criar release (versao nova)
ci-knife create-release

# Scanner de qualidade (SonarQube)
ci-knife sonar-scanner --project-key $SONAR_PROJECT_KEY
```

---

## Gerenciamento de Segredos (GSMPatch)

O **gsmpatch.sh** e um script utilitario para criar e gerenciar segredos no Google Secret Manager (GSM). Ele cuida de senhas, chaves de API, credenciais e outros dados sensiveis.

### Pre-requisitos

- **gcloud CLI** instalado e autenticado
- **jq** instalado (processador de JSON)

### Download do Script

```bash
curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/src/downloads/gsmpatch.sh -o gsmpatch.sh
chmod +x gsmpatch.sh
```

### Criar um Secret de Texto

Use quando precisar armazenar uma variavel de ambiente (como uma URL de banco de dados ou chave de API):

```bash
./gsmpatch.sh \
  --project maga-homolog \
  --app MINHA-APP \
  --secret-name DATABASE_URL \
  --secret-value "postgresql://user:pass@host:5432/db" \
  --vertical minha-vertical \
  --tribe minha-tribo \
  --squad meu-squad
```

### Criar um Secret de Arquivo

Use quando precisar armazenar um arquivo de credenciais (como um JSON de service account):

```bash
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

### Parametros do GSMPatch

| Parametro | Obrigatorio | Descricao |
| :--- | :--- | :--- |
| `--project` | Sim | Nome do projeto GCP (ex: `maga-homolog`, `magalu-ops-transacional`) |
| `--app` | Sim | Nome da aplicacao (mesmo nome do ArgoCD) |
| `--secret-name` | Sim | Nome da variavel de ambiente |
| `--secret-value` | Sim* | Valor do segredo (texto) |
| `--secret-file` | Sim* | Caminho para o arquivo de credenciais |
| `--pod-file-path` | Condicional | Caminho no pod onde o arquivo sera montado (obrigatorio com `--secret-file`) |
| `--vertical` | Sim | Nome da vertical |
| `--tribe` | Sim | Nome da tribo |
| `--squad` | Sim | Nome do squad |
| `-y` | Nao | Pula a confirmacao interativa |

*Use `--secret-value` OU `--secret-file`, nao os dois ao mesmo tempo.

### Atualizando o values.yaml

Apos criar o secret, o script mostrara exatamente o que voce precisa adicionar ao seu `values.yaml`. Copie a saida e cole no arquivo de configuracao do seu deploy.

---

## Padronizando um Novo Repositorio

Use o comando `init` do CLI para gerar automaticamente todos os arquivos de configuracao:

```bash
npx @luizalabs/padrao-labs-agents init
```

Isso vai criar (ou atualizar) os seguintes arquivos:

| Arquivo | Funcao |
| :--- | :--- |
| `dependency.yaml` | Declaracao de dependencias do projeto |
| `sonar-project.properties` | Configuracao do SonarQube para analise de codigo |
| `hangar-info.yaml` | Metadados do projeto para o catalogo interno |
| `.gitlab-ci.yml` | Pipeline de CI/CD padrao com build, test, security e deploy |

O comando vai perguntar interativamente as informacoes do seu projeto (nome, vertical, tribo, linguagem, etc.).
