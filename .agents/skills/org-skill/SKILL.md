---
name: org-skill
description: Navegação em estruturas organizacionais e busca em bases de conhecimento históricas (Confluence, Mapa Labs).
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Organizational & Legacy Knowledge

Esta skill auxilia na descoberta de owners de serviços, navegação em estruturas organizacionais e busca em bases de conhecimento históricas da Luizalabs.

## When to use this skill
- Descobrir quem é o owner ou time responsável por um serviço
- Encontrar documentação técnica e runbooks históricos
- Navegar na estrutura organizacional (tribos, verticais, squads)
- Localizar recursos no GCP, Kubernetes ou infraestrutura legada
- Consultar decisões arquiteturais e ADRs passadas
- Encontrar contatos de especialistas em determinadas tecnologias

## Instructions

### Descobrindo Owners de Serviços

#### Mapa Labs (Principal ferramenta)
O Mapa Labs é o catálogo oficial de serviços da Luizalabs.

**Acessar via CLI**:
```bash
# Buscar por nome do serviço
curl -s "https://mapa-labs.luizalabs.com/api/v1/services?search=code-quality" | jq

# Buscar por repositório GitLab
curl -s "https://mapa-labs.luizalabs.com/api/v1/services?gitlab_project=luizalabs/code-quality" | jq
```

**Acessar via Web**:
- URL: https://mapa-labs.luizalabs.com
- Busque pelo nome do serviço ou repositório
- Verifique a seção "Owner" e "Team"

**Informações disponíveis no Mapa Labs**:
- Squad/Tribo responsável
- Tech Lead e Product Owner
- Links para: GitLab, Backstage (Hangar), Grafana, Kibana
- SLA e criticidade do serviço
- Tecnologias utilizadas
- Dependências upstream/downstream

#### Backstage (Hangar)
Catálogo técnico interno baseado no Spotify Backstage.

**Acessar**:
- URL: https://backstage.luizalabs.com
- Busque por `kind: Component` ou `kind: API`

**Informações disponíveis**:
- Arquivos `catalog-info.yaml` no repositório
- Owner Group ID (ex: `group:62bcb2215ebf58b18f19c0d5`)
- APIs expostas (OpenAPI/Swagger)
- Documentação TechDocs
- Alertas e métricas vinculadas

**Exemplo de consulta**:
```yaml
# Procure por catalog-info.yaml ou hangar-info.yaml na raiz do repo
metadata:
  name: code-quality
spec:
  owner: 'group:62bcb2215ebf58b18f19c0d5' # Aliança Backoffice
```

Para descobrir o nome da tribo a partir do Group ID, use:
```bash
curl -s "https://backstage.luizalabs.com/api/catalog/entities?filter=kind=Group" | \
  jq '.[] | select(.metadata.uid=="62bcb2215ebf58b18f19c0d5")'
```

### Navegando a Estrutura Organizacional

#### Hierarquia da Luizalabs
```
Luizalabs
├── Verticais (ex: Operações, Comercial, Tecnologia)
│   └── Tribos (ex: Aliança Backoffice, Fulfillment)
│       └── Squads (ex: Code Quality, Shipping)
│           └── Engenheiros e POs
```

#### Confluence - Estrutura de Times
**URL Base**: https://confluence.luizalabs.com

**Páginas importantes**:
- `/display/TECH/Tech+Home` - Estrutura de tecnologia
- `/display/<TRIBO>/Home` - Home de cada tribo (ex: `/display/ABACKOFFICE/Home`)
- `/display/<TRIBO>/Runbooks` - Runbooks da tribo
- `/display/<TRIBO>/ADRs` - Architectural Decision Records

**Busca no Confluence**:
- Use a busca global (ícone de lupa)
- Filtros úteis:
  - `space:TECH` - apenas espaço de Tecnologia
  - `type:page` - apenas páginas (não comentários)
  - `label:runbook` - páginas marcadas como runbook

**Especialistas por tecnologia**:
Vá para: `/display/TECH/Especialistas` e procure por:
- Kubernetes - [buscar no Confluence]
- ArgoCD - [buscar no Confluence]
- Node.js - [buscar no Confluence]
- Python - [buscar no Confluence]

### Localizando Recursos de Infraestrutura

#### Google Cloud Platform (GCP)

**Projetos GCP por ambiente**:
```bash
# Listar projetos
gcloud projects list --filter="name:*code-quality*"

# Projeto típico de HML
luizalabs-code-quality-hml

# Projeto típico de PRD
luizalabs-code-quality-prd
```

**Recursos comuns**:
```bash
# Cloud Run services
gcloud run services list --project=luizalabs-code-quality-prd

# GKE clusters
gcloud container clusters list --project=luizalabs-infra-k8s-prd

# Cloud SQL instances
gcloud sql instances list --project=luizalabs-data-prd

# Secrets
gcloud secrets list --project=luizalabs-code-quality-prd
```

**IAM e permissões**:
```bash
# Quem tem acesso ao projeto
gcloud projects get-iam-policy luizalabs-code-quality-prd

# Testar se você tem permissão
gcloud projects get-iam-policy luizalabs-code-quality-prd \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:$(gcloud config get-value account)"
```

#### Kubernetes (MKE - Magalu Kubernetes Engine)

**Clusters por ambiente**:
- `mke-hml-operacoes` - Homologação Operações
- `mke-prd-operacoes` - Produção Operações
- `mke-hml-comercial` - Homologação Comercial
- `mke-prd-comercial` - Produção Comercial

**Listar recursos**:
```bash
# Configurar contexto
kubectl config use-context mke-prd-operacoes

# Listar namespaces
kubectl get namespaces

# Buscar um serviço específico
kubectl get all -A | grep code-quality

# Ver deployments em um namespace
kubectl get deployments -n default

# Ver logs de um pod
kubectl logs -n default <pod-name> --tail=100 -f
```

#### Magamundi (Infraestrutura Legada)

Magamundi é o portal de recursos legados (VMs, bare metal, serviços on-prem).

**Acessar**:
- URL: https://magamundi.luizalabs.com
- Requer VPN e permissões específicas

**Recursos típicos**:
- VMs legadas (CentOS, Ubuntu)
- Serviços que ainda não migraram para Cloud
- Bancos de dados on-prem (Oracle, PostgreSQL antigos)
- Load balancers F5

**Quando consultar o Magamundi**:
- Serviço não encontrado no GCP ou MKE
- Erro "host not found" para domínios internos antigos (ex: `*.luizalabs.intra`)
- Documentação menciona servidores por hostname (ex: `app-server-01.luizalabs.intra`)

**Busca no Magamundi**:
- Busque por hostname
- Busque por IP interno
- Verifique a seção "Owner" para contato

### Documentação Técnica e Runbooks

#### Onde buscar (ordem de preferência)

1. **README.md do repositório GitLab**
   - Sempre comece aqui
   - Procure por seções: "Deployment", "Troubleshooting", "Architecture"

2. **Pasta `/docs` no repositório**
   - ADRs (Architecture Decision Records)
   - Runbooks de operação
   - Diagramas de arquitetura

3. **Backstage TechDocs**
   - https://backstage.luizalabs.com/catalog/default/component/<service-name>/docs
   - Documentação gerada automaticamente do repo

4. **Confluence da tribo**
   - https://confluence.luizalabs.com/display/<TRIBO>/Runbooks
   - Busque por: `<service-name> runbook`

5. **Grafana Dashboards e Alerts**
   - https://grafana.luizalabs.com
   - Busque por: `<service-name>`
   - Verifique "alert descriptions" para troubleshooting

#### Runbooks típicos

**O que procurar em um runbook**:
- Sintomas do problema
- Comandos de diagnóstico
- Procedimento de resolução
- Escalation path (quem chamar se não resolver)

**Exemplo de busca de runbook**:
```bash
# No GitLab
gitlab --project luizalabs/code-quality tree --ref main --path docs/runbooks

# No Confluence
# Acesse: https://confluence.luizalabs.com
# Busque: "code-quality runbook restart"
```

### ADRs (Architectural Decision Records)

ADRs documentam decisões arquiteturais importantes.

**Onde encontrar**:
- `/docs/adr/` no repositório
- Confluence: `/display/<TRIBO>/ADRs`

**Formato típico**:
```markdown
# ADR-001: Escolha de banco de dados

## Status
Aceito

## Contexto
Precisávamos escolher um banco para armazenar métricas de qualidade.

## Decisão
PostgreSQL 14 no Cloud SQL.

## Consequências
- Suporta JSON nativo
- Managed service reduz overhead operacional
- Custo: ~$200/mês
```

## Troubleshooting

### Não encontro o owner de um serviço
1. Verifique Mapa Labs primeiro: https://mapa-labs.luizalabs.com
2. Se não estiver lá, verifique Backstage: https://backstage.luizalabs.com
3. Procure `catalog-info.yaml` ou `hangar-info.yaml` no repo GitLab
4. Última opção: pergunte no Slack em `#ask-architecture`

### Serviço não está no GCP nem no MKE
- Consulte o Magamundi: https://magamundi.luizalabs.com
- Pode ser um serviço legado on-prem
- Verifique documentação histórica no Confluence

### Não tenho acesso ao Confluence/Mapa Labs/Backstage
- Solicite acesso via ServiceNow: https://luizalabs.service-now.com
- Categoria: "Access Request"
- Justificativa: "Desenvolvimento e troubleshooting"

### Preciso falar com especialista em uma tecnologia
1. Confluence: `/display/TECH/Especialistas`
2. Slack: `#ask-<technology>` (ex: `#ask-kubernetes`, `#ask-argocd`)
3. Mapa Labs: veja o campo "Tech Lead" do serviço relacionado

### Runbook está desatualizado
- Criar issue no GitLab do serviço
- Mencionar no Slack do time responsável
- Se urgente, procure Grafana alerts (geralmente estão mais atualizados)

## Capabilities
- **Mapa Labs**: Descoberta de owners e estrutura de serviços
- **Backstage (Hangar)**: Catálogo técnico e TechDocs
- **Confluence**: Runbooks, ADRs, documentação de tribos
- **GCP**: Localização de recursos cloud (Cloud Run, GKE, Cloud SQL)
- **MKE (Kubernetes)**: Aplicações em containers
- **Magamundi**: Recursos de infraestrutura legada
- **GitLab**: Repositórios, docs, catalog-info.yaml