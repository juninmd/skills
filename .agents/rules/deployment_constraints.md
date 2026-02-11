# Rule: Deployment Constraints
# Id: deployment_constraints

## Description
Bloqueios e restrições temporais para deploys em produção.

## Constraints
1.  **Fatala Freezing**: Respeite rigorosamente os períodos de congelamento (Black Friday, Liquidação). Deploys são proibidos sem aprovação C-Level.
2.  **Sexta-feira**: Evite deploys em sextas-feiras para minimizar incidentes no final de semana.
3.  **Hybrid Cloud Distinction**: Diferencie claramente entre `GCP` e `MGC` (Magamundi). As ferramentas e limitações são distintas.
