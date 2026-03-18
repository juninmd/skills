---
name: configuring-sonarqube
description: Configuração e padronização do arquivo sonar-project.properties para garantir o cumprimento das métricas de qualidade do Labs.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[config/tool] [options]"
---

# Configuring SonarQube

Esta skill fornece o template e as diretrizes para a configuração do `sonar-project.properties` em repositórios da Luizalabs.

## Concept
O SonarQube é a ferramenta oficial do Labs para análise estática de código e métricas de qualidade (cobertura de testes, code smells, vulnerabilidades). Todo repositório deve ter o arquivo `sonar-project.properties` configurado corretamente na raiz.

## Instructions
1.  **Template:** Utilize o template oficial localizado em `assets/sonar-project.properties`.
2.  **Variáveis:**
    *   Substitua `{APPNAME}` pelo nome do projeto no GitLab (ex: `api-meu-servico`).
    *   Ajuste `sonar.sources` e `sonar.tests` de acordo com a estrutura do projeto.
3.  **Linguagem e Coverage:**
    *   Para projetos Python, garanta a linha `sonar.python.coverage.reportPaths=coverage.xml`.
    *   Para projetos Node.js/TS, garanta a linha `sonar.javascript.lcov.reportPaths=coverage/lcov.info`.
4.  **Exclusions:** Sempre ignore pastas de dependências (node_modules, venv) e arquivos de build/dist.

## Validation
- Certifique-se de que a cobertura de testes no projeto atenda aos limites da organização (geralmente >= 90%).
- O pipeline irá rodar o comando `ci-knife sonar-scanner` baseado nessas propriedades.
