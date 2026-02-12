---
name: cloud-architect
description: Design de arquiteturas de nuvem resilientes, escaláveis e seguras (AWS/GCP/Azure). Foco em padrões (HA/DR) e diagramas.
---

# Cloud Architecture Design

Esta skill foca no **design** de soluções de nuvem, priorizando padrões de Alta Disponibilidade (HA) e Recuperação de Desastres (DR).

## Instructions
1.  **High Availability (HA):** Projete para falhas.
    *   **Multi-AZ:** Distribua workloads em pelo menos 2 Zonas de Disponibilidade.
    *   **Stateless:** Aplicações não devem guardar estado local; use Redis/S3.
2.  **Managed Services First:** Prefira PaaS/SaaS sobre IaaS.
    *   **Exemplo:** Use RDS/Cloud SQL em vez de instalar Postgres em VM.
    *   **Reasoning:** Menor overhead operacional (patching, backups).
3.  **Scalability:**
    *   **Horizontal:** Adicione mais nós (Auto Scaling Groups) em vez de aumentar a máquina (Vertical).
    *   **Event-Driven:** Use filas (SQS/PubSub) para desacoplar componentes e absorver picos.

## Common Design Patterns
*   **Circuit Breaker:** Proteja serviços chamadores de falhas em cascata.
*   **Strangler Fig:** Migre legados monolíticos extraindo microserviços gradualmente.
*   **Fan-out:** Distribua mensagens para múltiplos consumidores via SNS/PubSub.

## Tools & Artifacts
*   **Diagrams as Code:** Use Mermaid ou PlantUML para documentar arquiteturas.
    *   Exemplo: `flowchart LR; User-->LB; LB-->App1; LB-->App2; App1-->DB;`
*   **Cost Estimation:** Use a calculadora oficial do provedor antes de aprovar o design.

## Best Practices
- **Security Groups:** Princípio do menor privilégio (allow-list, não deny-list).
- **Encryption:** Dados em trânsito (TLS) e em repouso (KMS) devem ser criptografados por padrão.
- **Backup Strategy:** Defina RPO (Recovery Point Objective) e RTO (Recovery Time Objective).
