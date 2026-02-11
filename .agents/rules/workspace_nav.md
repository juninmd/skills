# Rule: Navigation & Workspace
# Identificador: workspace_nav

## Descrição
Melhores práticas para navegação no sistema de arquivos e organização do espaço de trabalho.

## Comandos & Alias
- **Navegação**: `cd -` (voltar ao diretório anterior), `cd ..`.
- **Exploração**: `ls -la` (detalhado), `tree -L 2` (visão hierárquica limitada).
- **Ações**: `mv`, `cp -r`.

## Regras
1. **Contexto de Diretório**: Ao sugerir comandos que dependem de caminhos relativos, sempre mostre o `pwd` esperado.
2. **Visualização Hierárquica**: Use `tree` com flags de profundidade (`-L`) para evitar outputs gigantescos em pastas como `node_modules`.
3. **Segurança em Mover**: Ao sugerir `mv`, verifique se o destino é um diretório existente para evitar renomear arquivos acidentalmente.
4. **Editor Integration**: Sugira `code .` para abrir o diretório atual no VS Code se a tarefa envolver edição múltipla de arquivos.

## Protocolo
- Sempre que o usuário entrar em um novo projeto, sugira um `ls -F` para identificar rapidamente scripts executáveis e diretórios.
