---
name: running-autonomous-loops
description: Transforma o Gemini CLI em um engenheiro autônomo que executa tarefas sequenciais de um plano com self-healing e verificação contínua.
metadata:
  works_on: [gemini_cli]

argument-hint: "[context] [options]"
disable-model-invocation: true
---

# Autonomous Agent Loop

Esta skill guia o agente na execução autônoma de tarefas utilizando um plano (`TODO_LIST.md`).

## Instructions
1.  **Interactive Setup:** Execute `skills/autonomous-loop-skill/scripts/setup_autonomous_agent.sh` para iniciar o assistente interativo.
2.  **Execution:** Rode o loop infinito gerado via `./run_agent.sh`.
3.  **Protocol:** O agente lerá `PROMPT.md` em cada iteração para manter o estado e a persona.

## Resources
- `PROMPT.md`: Persona e protocolo de execução (Gerado dinamicamente).
- `TODO_LIST.md`: Lista de tarefas com checkboxes (Gerado dinamicamente).
- `run_agent.sh`: Motor do loop (Gerado dinamicamente).
