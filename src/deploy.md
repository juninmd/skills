# Instruções de Deploy

## ArgoCD de Homologação

URL: https://argocd-mke-operacoes-hml.ipet.sh

## Configuração de DNS

Ao atribuir no host no `values.yaml` o seguinte domínio: `.mgc-hml.mglu.io`

Os DNS são criados automaticamente apontando para o IP do Ingress Controller.

Exemplo: Documentação