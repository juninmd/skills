# Gemini CLI Hooks

> **⚠️ Importante:** Os hooks descritos e contidos neste diretório são exclusivos para uso com o **Gemini CLI**. Eles não funcionam em outros ambientes como VSCode, Antigravity ou terminais padrão sem a ferramenta Gemini instalada e configurada.

Este diretório contém hooks personalizados para estender e proteger seu fluxo de trabalho no terminal. Eles seguem as melhores práticas da documentação oficial do Gemini CLI.

## Documentação Oficial

Para aprofundar seu conhecimento sobre como criar, configurar e manter hooks no Gemini CLI, consulte as referências oficiais:

- [Visão Geral de Hooks](https://geminicli.com/docs/hooks/)
- [Escrevendo Hooks](https://geminicli.com/docs/hooks/writing-hooks/)
- [Melhores Práticas](https://geminicli.com/docs/hooks/best-practices/)
- [Referência Completa](https://geminicli.com/docs/hooks/reference/)

## Conceitos Chave

Hooks permitem interceptar e customizar o comportamento do Gemini CLI em pontos específicos do loop do agente. Eles funcionam de forma síncrona, ou seja, o CLI aguarda a execução do hook antes de prosseguir.

Principais usos incluem:
- **Segurança:** Validar comandos perigosos antes da execução.
- **Contexto:** Injetar informações do ambiente (git, k8s) no prompt.
- **Compliance:** Garantir que regras do projeto sejam seguidas.
- **Logging:** Registrar interações para auditoria.

## Hooks Implementados

### 1. `pre-command.py` (Safety & Context)
Este hook é executado **antes** de cada comando gerado pela IA ser executado. Ele serve como uma camada final de segurança.

**Funcionalidades:**
*   **Git Protection:** Detecta e alerta se você estiver prestes a fazer `git push` ou `git commit` diretamente nas branches `main` ou `master`.
*   **Kubernetes Awareness:** Exibe o contexto atual do cluster (`kubectl config current-context`) sempre que um comando `kubectl` for sugerido, evitando deploys acidentais em produção.
*   **Python Environment:** Verifica se existe um ambiente virtual (`.venv`) no diretório mas não está ativo, sugerindo o comando de ativação.

### Como Instalar
Para que o Gemini CLI utilize estes hooks, configure o caminho no seu arquivo `config.yaml` ou passe a flag `--hooks-dir`:

```yaml
# ~/.gemini/config.yaml
hooks:
  dir: /caminho/para/este/diretorio/hooks
```

Ou via variável de ambiente:
```bash
export GEMINI_HOOKS_DIR=$(pwd)/hooks
```
