---
name: rabbitmq-diagnose
description: Diagnóstico de saúde de filas RabbitMQ, consumidores e Dead Letter Queues (DLQ).
metadata:
  metadata:
    works_on: [vscode, antigravity, gemini_cli]

---

# Diagnose RabbitMQ Health

Esta skill inspeciona filas para identificar gargalos e falhas de processamento.

## Instructions
- Utilize `rabbitmqadmin` para coletar métricas.
- Analise `consumer_count == 0` (Crítico) e `messages_unacknowledged` (Lentidão).

## Capabilities
- **Queue Stats**: Obter contagem de mensagens e status.
- **DLQ Inspection**: Amostragem de mensagens mortas para RCA.

## Commands
- `rabbitmqadmin get queue=<name> stat.messages stat.consumer_count`
