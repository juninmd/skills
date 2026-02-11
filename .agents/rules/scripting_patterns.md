# Rule: Shell Scripting Patterns
# Id: scripting_patterns
# Description: Padrões de automação shell (loops, condições).

## Capabilities
- **Loops (`do`)**:
    - `for i in *; do echo $i; done`: Iteração de arquivos.
    - `while true; do ...; sleep 1; done`: Execução contínua.
- **Conditionals (`then`)**:
    - `if [ -f <file> ]; then ...; fi`: Validação de existência de arquivo.
    - `command1 && command2`: Execução condicional de sucesso.
    - `command || echo "Failed"`: Tratamento de erro básico.

## Best Practices
- Use `set -e` em scripts longos para parar em erro.
- Use `sleep` dentro de loops infinitos para não travar a CPU.
- Prefira variáveis `${VAR}` com chaves para evitar erros de interpolação.
