---
name: anti-patterns
description: Lista do que NÃO fazer no desenvolvimento Luizalabs.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Anti-Patterns (Proibições)
# Id: anti_patterns

## O que NÃO fazer
- **Nunca** commitar segredos, chaves de API ou arquivos `.env`.
- **Nunca** alterar a versão do `sonar.projectKey` sem autorização explícita.
- **Nunca** reduzir a cobertura de testes para passar no pipeline.
- **Nunca** usar IPs hardcoded; use sempre variáveis de ambiente ou DNS interno.
- **Nunca** Fazer push sem mensagem clara ou com problemas de segurança, qualidade ou reports de erro em logs.
