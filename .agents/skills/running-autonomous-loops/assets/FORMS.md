# Forms: Autonomous Loop (Interactive)

## Project Setup Form
Este formulário é preenchido interativamente pelo script `scripts/setup_autonomous_agent.sh`.

- **Project Name:** {NOME DO PROJETO}
- **Main Goal:** {OBJETIVO GERAL DO AGENTE}
- **Tasks (One by one):**
  - Task 1: {DESCRIÇÃO}
  - Task 2: {DESCRIÇÃO}
  - ... (Stop with empty input)

O script gera automaticamente o arquivo `TODO_LIST.md` com o seguinte formato:
```markdown
# {Project Name} Plan
**Goal:** {Main Goal}

- [ ] Task 1
- [ ] Task 2
...
```