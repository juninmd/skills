---
name: running-autonomous-loops
description: Transform Gemini CLI into an autonomous engineer that executes sequential tasks from a plan with self-healing and continuous verification.
metadata: { works_on: [copilot, antigravity] }

argument-hint: "[context] [options]"
disable-model-invocation: true
---

# Autonomous Agent Loop

This skill guides the agent in the autonomous execution of tasks using a plan (`TODO_LIST.md`).

## Instructions
1.  **Interactive Setup:** Execute `skills/autonomous-loop-skill/scripts/setup_autonomous_agent.sh` to start the interactive assistant.
2.  **Execution:** Run the infinite loop generated via `./run_agent.sh`.
3.  **Protocol:** The agent will read `PROMPT.md` in each iteration to maintain state and persona.

## Resources
- `PROMPT.md`: Persona and execution protocol (dynamically generated).
- `TODO_LIST.md`: Task list with checkboxes (dynamically generated).
- `run_agent.sh`: Loop engine (dynamically generated).
