# Semantic Commits Guide

## Estrutura Básica
`type(scope): subject`

## Tipos Comuns
| Tipo | Descrição | Exemplo |
| :--- | :--- | :--- |
| `feat` | Nova funcionalidade (Minor version) | `feat(api): add new login endpoint` |
| `fix` | Correção de bug (Patch version) | `fix(core): resolve null pointer exception` |
| `docs` | Alteração apenas na documentação | `docs: update readme with setup instructions` |
| `style` | Formatação, pontos e vírgulas, etc. | `style: format code with black` |
| `refactor` | Refatoração de código sem mudar comportamento | `refactor: simplify auth logic` |
| `test` | Adição ou correção de testes | `test: add unit test for user service` |
| `chore` | Tarefas de build, auxiliares, etc. | `chore: update dependencies` |

## Breaking Changes
Adicione `BREAKING CHANGE: description` no corpo do commit para indicar uma mudança que quebra compatibilidade (Major version).
