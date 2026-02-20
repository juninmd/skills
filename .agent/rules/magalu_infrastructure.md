---
name: magalu-infrastructure
description: Padrões de infraestrutura, deploy e dependências na Luizalabs (Magalu).
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Magalu Infrastructure

## Deploy e Infraestrutura
- **Deploy**: ArgoCD. Endpoint: `https://argocd-mke-operacoes-hml.ipet.sh`.
- **Repositório**: GitLab. Endpoint: `https://gitlab.luizalabs.com`.
- **Variáveis de Ambiente**: Google Secret Manager via `values.yaml`.
  ```yaml
  - name: MYSQL_PASSWORD
    value: gcp:secretmanager:projects/{project_id}/secrets/{secret_name}/versions/{version}
  ```
- **Acesso GCP**: Solicitar via Papagali (Magalu Desenvolvedor).
- **APK (Android)**: Build local.

## Premissas do App
- O app deve ser containerizado e ter um arquivo Dockerfile.
  - O Dockerfile deve instalar o `make` como dependência do sistema para executar comandos do Makefile.
  - Exemplo:
    ```dockerfile
    RUN apt-get update && \
        apt-get install -y --no-install-recommends make && \
        rm -rf /var/lib/apt/lists/*
    ```

## DNS
- Ao atribuir no host no `values.yaml` o domínio `.mgc-hml.mglu.io`, os DNS são criados automaticamente apontando para o Ingress Controller.

## Tecnologias Padrão
- **Banco SQL**: Postgres, Mysql.
- **Cache**: VaulKey.
- **Fila**: PubSub, RabbitMQ, Kafka.
- **Banco NoSQL**: MongoDB, Elastic, Scylladb (evitar).
- **Ambiente**: Docker local e K8S na MagaluCloud.
- **CDN**: Azion, Akamai.
- **GW**: Kong API.

## Hangar Info (Backstage Catalog)
- Arquivo `hangar-info.yaml` obrigatório na raiz.
- Deve conter metadados e annotations de segurança.

Modelo:
```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: {APPNAME}
  description: {DESCRIPTION}
  links: []
  annotations:
    security/business-risk: Low
    security/public: Internal
    security/accessibility: 'Yes'
    security/waf: 'No'
    security/qradar: 'No'
    security/authentication: Google OAuth
    security/administration: Self-portal
    project/service.tier: OTHERS
    backstage.io/techdocs-ref: dir:./
  tags:
    - Python
spec:
  type: service
  lifecycle: production
  owner: group:{TRIBE}-{SQUAD}
  system: {SYSTEM}
```

## Dependency.yaml
- Arquivo `dependency.yaml` obrigatório na raiz.
- Squad, tribe e vertical sempre em lowercase e sem acentos (ex: ops_automacao).

Modelo:
```yaml
owner: {SQUAD}
tribe: {TRIBE}
vertical: {VERTICAL}
application:
  description: {DESCRIPTION}
  name: {APP_NAME}
  languages: {Python, Java}
  fortify_id: {APPNAME}
security:
  url_homolog: {DNS}
  url_prod: {DNS}
  businessRisk: Low
  public: Internal
  accessibility: 'Yes'
  waf: 'No'
  qradar: 'No'
  authentication: {AUTH_METHOD}
  administration: {ADMIN_METHOD}
```
