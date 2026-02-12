```skill
---
name: cicd-deploy
description: Skills para configurar CI/CD (GitLab), ArgoCD e criação de secrets no Google Secret Manager (GSM) usando os exemplos do repositório.
---

# CICD Deploy Skill

Esta skill descreve como configurar pipelines de deploy para serviços que seguem o padrão deste repositório. Use-a para padronizar campanhas de deploy, criação de secrets no GSM e integração com Helm/ArgoCD.

## Quando usar

- Ao criar um novo serviço que precisa de pipeline GitLab integrado com Sonar, Registry, e ArgoCD.
- Ao configurar integração com Helm charts armazenados no repositório `exemplo/ci`.

## Procedimento recomendado

1. Preparar o Helm chart em `exemplo/ci`.
2. Criar secrets no Google Secret Manager com nomes consistentes (ex: `SONAR_TOKEN`, `DOCKER_REGISTRY_PASSWORD`, `ARGOCD_TOKEN`).
3. Conceder `roles/secretmanager.secretAccessor` ao service account do runner.
4. Referenciar secrets no job do GitLab via variáveis protegidas ou extraindo os valores com `gcloud secrets versions access latest --secret=NAME`.
5. ArgoCD deve receber apenas imagens assinadas/tags imutáveis geradas pelo pipeline.

## Comandos úteis

Criar secret e adicionar versão:

```bash
gcloud secrets create NAME --replication-policy="automatic"
echo "value" | gcloud secrets versions add NAME --data-file=-
gcloud secrets add-iam-policy-binding NAME --member="serviceAccount:RUNNER_SA" --role="roles/secretmanager.secretAccessor"
```

Acessar secret em runtime:

```bash
gcloud secrets versions access latest --secret=SONAR_TOKEN
```

## Exemplo de mapeamento (nomes sugeridos)

- `SONAR_TOKEN` → SonarQube token
- `GITLAB_TOKEN` → Token de integração/push
- `DOCKER_REGISTRY_PASSWORD` → Senha do registry
- `ARGOCD_TOKEN` → Token ArgoCD (se necessário)

## Observações de segurança

- Use Service Accounts com privilégio mínimo.
- Habilite rotação de secrets e monitore acessos via Audit Logs do GCP.

```
