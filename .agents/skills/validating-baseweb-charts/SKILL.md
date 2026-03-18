---
name: validating-baseweb-charts
description: Validação rigorosa dos arquivos Chart.yaml e values.yaml com base nos padrões do baseweb-app.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[file/module] [options]"
---

# Validating BaseWeb Charts

## Description
Esta skill capacita o agente a auditar e validar os arquivos `Chart.yaml` e `values.yaml` de uma aplicação baseada em Kubernetes, garantindo que as configurações estejam em estrita conformidade com a documentação do `base-webapp`. O objetivo é assegurar governança, disponibilidade e rastreabilidade dos deploys.

## Instructions

Sempre que analisar os arquivos `Chart.yaml` e `values.yaml`, o agente deve aplicar o seguinte checklist de validação:

### 1. Chart.yaml
- **Nome**: O campo `name` deve estar preenchido.
- **Versão**: O campo `version` deve estar presente e seu valor **deve ser idêntico** ao valor do campo `image.tag` no arquivo `values.yaml`.

### 2. values.yaml
- **Governança**: As chaves `squad`, `tribe`, `vertical` e `product` não podem estar vazias.
- **Imagem e Execução**: Os campos `image.repository` e `image.tag` devem existir. Além disso, `command` e `args` devem estar definidos corretamente.
- **Recursos (Resources)**: A previsibilidade do pod é essencial. As configurações `resources.limits` (cpu e memory) e `resources.requests` (cpu e memory) são mandatórias.
- **Ingress Controller**: Deve constar a configuração de `ingress.ingressController.internal`, incluindo o annotation para o redirecionamento HTTPS: `konghq.com/https-redirect-status-code: '308'`.
- **Probes**: É obrigatório declarar o path de liveness e readiness (`livenessProbe.httpGet.path` e `readinessProbe.httpGet.path`).
- **Escalabilidade**: O HPA (Horizontal Pod Autoscaler) deve ter o campo `hpa.maxReplicas` definido para evitar sobrecarga.
- **Variáveis de Ambiente**: As variáveis da aplicação devem ser listadas na chave `envs`.
- **Rastreabilidade e Metadados**: As chaves `repositoryLink`, `author`, `date` e `gmud` devem estar presentes para fins de auditoria e change management.

## Best Practices
1. **Rejeição Clara**: Se um ou mais parâmetros estiverem ausentes ou configurados incorretamente (como a divergência de versões entre `Chart.yaml` e `values.yaml`), rejeite os arquivos e aponte exata e unicamente o que precisa ser corrigido.
2. **Exemplos**: Ao reportar um erro, mostre o trecho problemático e como deveria ser baseado no padrão `base-webapp`.
3. **Tom do Feedback**: O feedback deve ser direto, técnico, estruturado em Markdown e com foco na engenharia de confiabilidade (SRE/FinOps).

## Reference Files
Os modelos de configuração baseados no padrão da Luizalabs estão localizados no diretório `resources/` desta skill:
- `.agents/skills/validating-baseweb-charts/resources/Chart.yaml`
- `.agents/skills/validating-baseweb-charts/resources/values.yaml`

Utilize esses arquivos como base de comparação ao auditar e validar os charts.
