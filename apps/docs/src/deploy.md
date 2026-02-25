# Instruções de Deploy

Este guia explica como fazer deploy das suas aplicações na infraestrutura Luizalabs, incluindo configuração de ArgoCD, DNS e gerenciamento de segredos.

## Pré-requisitos

Antes de começar o deploy, certifique-se de que você tem os seguintes acessos e configurações concluídas:

### Acessos Necessários
1. **Acesso ao projeto da GCP** - Necessário para recursos de infraestrutura (Logs/Cloud). Ao solicitar acesso, você precisará informar os nomes dos projetos (ex: `maga-homolog` para o ambiente de homologação). Caso não tenha, solicite via Papagali: [Solicitar via Papagali](https://papagali.ipet.sh/card/create/team/CLOUD/request/59)
2. **Acesso ao ArgoCD** - Para monitorar o status e sincronizar os deploys na Luizalabs. Caso não tenha, você pode solicitar através do Papagali: [Solicitar via Papagali](https://papagali.ipet.sh/card/create/team/CLOUD/request/123)
3. **gcloud CLI e kubectl** - O `gcloud` deve estar instalado ([Guia de Instalação](https://cloud.google.com/sdk/docs/install)) e o `kubectl` configurado para o cluster correto da GCP.

### Repositórios no GitLab
O nosso GitLab é o [https://gitlab.luizalabs.com/](https://gitlab.luizalabs.com/).

1. **Link do Repositório do Código Fonte** - O repositório do código fonte deve obrigatoriamente residir em um subgrupo dentro de [luizalabs](https://gitlab.luizalabs.com/luizalabs/).
2. **Link do Repositório do Chart (baseweb-app)** - O repositório contendo o Helm Chart (ou o diretório de deploy) normalmente reside em um subgrupo de [cicd](https://gitlab.luizalabs.com/cicd/).

### Arquivos de Configuração
Certifique-se de configurar os seguintes arquivos no seu projeto:
4. **Configurar o `.gitignore`** - Ajustado para a stack de desenvolvimento.
5. **Configurar o `.gitlab-ci.yml`** - Pipeline de CI/CD padrão com `ci-knife`.
6. **Configurar o `dependency.yaml`** e `hangar-info.yaml` - Use os templates do [catálogo de APIs](https://padrao-labs-agents.luizalabs.com/skills/cataloging-apis/).

---

## ArgoCD

O ArgoCD é a ferramenta que sincroniza o estado do seu repositório Git com o cluster Kubernetes. Quando você faz push de uma mudança, o ArgoCD detecta e aplica automaticamente.

### Ambientes Disponíveis

| Ambiente | URL do ArgoCD | Uso |
| :--- | :--- | :--- |
| **Homologação (HML)** | `https://argocd-mke-operacoes-hml.ipet.sh`* | Testes e validação |
| **Produção (PRD)** | Consulte seu tech lead | Ambiente de produção |

\* *A URL de HML acima é exclusiva da vertical **Operações**. Caso você esteja em outra vertical, consulte seu tech lead para obter a URL correta.*

::: tip
Não sabe qual é a sua vertical? Você pode consultar no [Mapa Labs](https://mapa-labs.web.app/).
:::

### Como acessar o ArgoCD

1. Abra a URL do ArgoCD do ambiente desejado no navegador
2. Faca login com suas credenciais corporativas
3. Procure sua aplicacao pelo nome (geralmente o mesmo nome do repositorio)
4. Verifique se o status está **Synced** (sincronizado) e **Healthy** (saudável)

---

## Qualidade e SonarQube

A validação de qualidade e cobertura é feita através do SonarQube. As URLs oficiais são:
*   **Staging**: [https://sonarqube-staging.luizalabs.com/](https://sonarqube-staging.luizalabs.com/)
*   **Produção**: [https://sonarqube.luizalabs.com/](https://sonarqube.luizalabs.com/)

---

## Observabilidade e Logs

Toda aplicação no Padrão Labs envia logs estruturados automaticamente para o **Google Cloud Logging**.
*   Para visualizar os logs, você deve acessar o projeto GCP correspondente ao seu ambiente (ex: `maga-homolog`).
*   Certifique-se de que sua aplicação está imprimindo logs no formato JSON para melhor análise.

---

## Registro de Imagens (GCR)

As imagens Docker geradas pelo pipeline são armazenadas obrigatoriamente no registro oficial:
*   **Registry**: `gcr.io/magalu-cicd/<NOME_DA_SQUAD>/<NOME_DA_APP>`

---

## Configuração do Repositório de CI/CD (Helm Chart)

Este repositório (localizado no subgrupo `cicd`) gerencia o deploy da aplicação utilizando Helm. Os dois arquivos principais que devem ser configurados são:

### 1. `Chart.yaml`
Define os metadados do chart e as dependências necessárias.

```yaml
apiVersion: v2
name: <NOME_DA_SUA_APP>
type: application
version: <VERSAO_DO_CHART>
dependencies:
  - name: base-webapp
    version: <VERSAO_BASE_WEBAPP>
    repository: https://chartmuseum.luizalabs.com
annotations:
  rollback_version: <VERSAO_ANTERIOR>
  previous_commit: <HASH_COMMIT_ANTERIOR>
```

**Descrição dos campos:**
- `apiVersion`: Versão da API do Helm (v2 é o padrão para o Helm 3).
- `name`: Nome do Helm Chart (deve ser o nome da sua aplicação).
- `type`: Define se é uma `application` ou uma `library`.
- `version`: A versão do seu Chart (deve ser incrementada a cada alteração).
- `dependencies`: Lista de dependências. Aqui incluímos o `base-webapp` que é o padrão do Luizalabs.
- `annotations`: Metadados adicionais úteis para o processo de CI/CD, como versão de rollback e rastreabilidade de commits.

### 2. `values.yaml`
Contém as configurações específicas da aplicação e do ambiente através do chart base `base-webapp`.

```yaml
base-webapp:
  squad: <NOME_DA_SQUAD>
  tribe: <NOME_DA_TRIBO>
  vertical: <NOME_DA_VERTICAL>
  product: <NOME_DO_PRODUTO>
  replicaCount: <NUMERO_REPLICAS>
  image:
    repository: gcr.io/magalu-cicd/<NOME_DA_APP>
    tag: <TAG_VERSAO>
  resources:
    limits:
      cpu: <CPU_LIMIT> # Ex: 800m
      memory: <MEM_LIMIT> # Ex: 3Gi
    requests:
      cpu: <CPU_REQ> # Ex: 400m
      memory: <MEM_REQ> # Ex: 500Mi
  ingress:
    ingressController:
      internal:
        enabled: true
        hosts:
          - host: <SUBDOMINIO>.luizalabs.com
            paths:
              - /*
  hpa:
    enabled: true
    minReplicas: <MIN_REPLICAS>
    maxReplicas: <MAX_REPLICAS>
    targetMetric:
      targetCPUUtilizationPercentage: 70
  envs:
    - name: NODE_ENV
      value: production
    - name: <NOME_DA_VAR>
      value: gcp:secretmanager:projects/<PROJECT_ID>/secrets/<SECRET_NAME>/versions/<VERSION>
```

**Descrição dos principais blocos:**
- `squad`, `tribe`, `vertical`: Metadados para identificação e faturamento da aplicação.
- `replicaCount`: Número de instâncias da aplicação (caso o HPA esteja desativado).
- `image`: Define o repositório da imagem no GCR e a tag da versão.
- `resources`: Define os limites e requisições de CPU e Memória (crucial para o escalonamento).
- `ingress`: Configuração de DNS e exposição da aplicação. No exemplo, usa o controlador interno (`internal`).
- `hpa`: Configura o *Horizontal Pod Autoscaler* para escalar o número de pods automaticamente com base no uso de recursos.
- `envs`: Variáveis de ambiente.

#### Observação para Clusters MGC (Magalu Cloud)
Se você estiver publicando em um cluster **MGC** e possuir uma variável chamada `GOOGLE_APPLICATION_CREDENTIALS`, você deve:
1.  Renomear a variável para `GOOGLE_APPLICATION_CREDENTIALS_REPLACEMENT`.
2.  Adicionar a variável de ambiente `DO_NOT_SILENCE_GOOGLE_APPLICATION_CREDENTIALS` com o valor `'true'`.

Exemplo:
```yaml
  envs:
    - name: GOOGLE_APPLICATION_CREDENTIALS_REPLACEMENT
      value: gcp:secretmanager:projects/<PROJECT_ID>/secrets/<SECRET_NAME>/versions/<VERSION>
    - name: DO_NOT_SILENCE_GOOGLE_APPLICATION_CREDENTIALS
      value: 'true'
```

> [!TIP]
> **Gestão de Segredos**: Note que variáveis que começam com `gcp:secretmanager` referenciam segredos do **Google Secret Manager (GSM)**. Elas são normalmente geradas e atualizadas pelo script [gsmpatch.sh](#gerenciamento-de-segredos-gsmpatch).

::: tip
O DNS automático só funciona para o domínio `*.mgc-hml.mglu.io` no ambiente de **homologação**. Para produção, domínios customizados (como `luizalabs.com`) ou outras configurações, é necessário configurar o Ingress Controller adequado e garantir as entradas de DNS via ticket ou tech lead.
:::

---

## Design Doc

Antes de realizar o deploy em **Produção**, é obrigatório o desenvolvimento e aprovação da **Design Doc** do projeto.

Você deve seguir o template oficial da Luizalabs:
*   **Template de Design Doc**: [Clique aqui para acessar o Template no Confluence](https://magazine.atlassian.net/wiki/spaces/EN/pages/3553067014/Template+de+Design+Doc)

### Construção com ArchDD Agent
Para acelerar o processo, você pode utilizar o **ArchDD Agent**, que ajuda na construção da documentação seguindo os padrões arquiteturais:
*   **Documentação ArchDD Agent**: [Acessar Guia do ArchDD](https://padrao-labs-agents.luizalabs.com/agents/archdd-agent/)

---

## Pipeline CI/CD com ci-knife {#ci-knife}

O `ci-knife` e a ferramenta padrao para automacao de pipelines na Luizalabs. Ele cuida de build, testes, deploy e seguranca.

### Fluxo da Esteira CI/CD

```mermaid
graph TD
    Start((Início)) --> BuildTest[Build & Test]
    BuildTest --> SonarStaging[Sonar Staging]
    SonarStaging --> Security[Pipeline de Segurança]
    Security --> DeployHML[Deploy Homologação]

    DeployHML --> IsMainBranch{Merge na Main?}

    IsMainBranch -- Sim --> Release[Geração de Release]
    Release --> SonarProd[Sonar Production]
    SonarProd --> GMUD[Criação de GMUD]
    GMUD --> DeployPRD[Deploy Production]
    DeployPRD --> Rollback[Rollback Production - Opcional]

    IsMainBranch -- Não --> End((Fim))
    Rollback --> End
    DeployPRD --> End
```

> [!IMPORTANT]
> **Regra de Aprovação de GMUD**: O deploy em produção só pode ser realizado após a aprovação da GMUD pelo bot **PIO** ou por **2 TLs (Tech Leads)** que não são do mesmo time.
> *   **Acessar GMUDs pendentes**: [GitLab GMUD Issues](https://gitlab.luizalabs.com/luizalabs/gmud/-/issues)

#### Auto-aprovação pelo Bot PiO
O bot **PiO** pode realizar a aprovação automática caso os seguintes critérios sejam atendidos após a primeira aprovação manual:
- **Cobertura de Código**: Maior ou igual a **90%** (avaliada pelo SonarQube).
- **Segurança**: Ausência de issues críticas de segurança (avaliadas pelo pipeline de segurança/Atena).

#### Como solicitar a Auto-aprovação
Para que seu projeto seja elegível à auto-aprovação pelo PiO, você deve solicitar a inclusão do seu repositório na lista de projetos permitidos.
1. Realize um Merge Request adicionando o nome do seu projeto ao arquivo `auto-approved-projects.csv` no repositório de GMUD:
   - **Repositório de Solicitação**: [GMUD Merge Requests](https://gitlab.luizalabs.com/luizalabs/gmud/-/merge_requests/)

2. **Requisitos de Conformidade**:
   Para ser aprovado, o MR verificará automaticamente se o projeto atende a:
   - ✅ Time pratica "Code Review" via Merge Requests.
   - ✅ Deploy e Rollback automatizados via CI.
   - ✅ Metadados (`owner`, `tribe`, `vertical`) preenchidos no `dependency.yaml` e `hangar-info.yaml`.
   - ✅ Nenhuma issue crítica de segurança (Snyk/Atena).
   - ✅ **Métricas Sonar**:
     - Cobertura de testes >= 90%.
     - Duplicação de código < 3%.
     - Rating 'A' em Maintainability, Reliability e Security.

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

# Gerar GMUD (de acordo com o CHANGELOG)
ci-knife create-gmud
```

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
| `.gitignore` | Arquivo para ignorar arquivos/diretórios no Git |
| `.gitlab-ci.yml` | Pipeline de CI/CD padrão com build, test, security e deploy |

O comando vai perguntar interativamente as informacoes do seu projeto (nome, vertical, tribo, linguagem, etc.).
