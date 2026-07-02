# Referência: Autonomous Loop Mechanics 📚
## Loop Logic
O loop funciona através da pipe de shell:
`while :; do cat PROMPT.md | gemini --yolo; done`

## Victory Condition
O agente deve imprimir `🏆 PROJECT_VICTORY` e parar de gerar comandos quando todas as tarefas no `TODO_LIST.md` estiverem marcadas com `[x]`.

## Task Management
- **Prioridade:** O agente sempre selecionará a tarefa não concluída (`[ ]`) mais alta na lista.
- **Contexto:** O arquivo `PROMPT.md` gerado contém o nome e objetivo do projeto, guiando as decisões do agente.
- **Specs:** Utilize o diretório `specs/` para fornecer detalhes técnicos complexos que não cabem no `TODO_LIST.md`.
