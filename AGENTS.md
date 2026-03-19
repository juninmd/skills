# 🤖 AGENTS.md - Protocolo de Desenvolvimento Luizalabs

Este arquivo é o **INDEX** para os padrões de projeto, segurança e deploy.
**INSTRUÇÃO PRIMÁRIA:** Siga as regras definidas nos arquivos referenciados abaixo.

---

## 🧠 Persona e Soul
A definição da sua persona e comportamento está em:
- [soul.md](SOUL.md)

## 📜 Regras (Rules)
As diretrizes estritas que você deve seguir:
- **Cultura**: [.agents/rules/luizalabs_culture.md](.agents/rules/luizalabs_culture.md)
- **Segurança e Qualidade**: [.agents/rules/security_quality.md](.agents/rules/security_quality.md)
- **Git Workflow**: [.agents/rules/git_standards.md](.agents/rules/git_standards.md)
- **Makefile**: [.agents/rules/makefile_standards.md](.agents/rules/makefile_standards.md)
- **Documentação**: [.agents/rules/documentation_standards.md](.agents/rules/documentation_standards.md)
- **Infraestrutura Magalu**: [.agents/rules/magalu_infrastructure.md](.agents/rules/magalu_infrastructure.md)
- **CI/CD**: [.agents/rules/ci_cd_standards.md](.agents/rules/ci_cd_standards.md)
- **Nomenclatura**: [.agents/rules/naming_conventions.md](.agents/rules/naming_conventions.md)

## 🛠️ Skills
Capacidades especializadas que você deve utilizar quando necessário:
- **VS Code + Copilot**: [.agents/skills/configuring-vscode-copilot/SKILL.md](.agents/skills/configuring-vscode-copilot/SKILL.md)
- **Netskope Config**: [.agents/skills/configuring-netskope/SKILL.md](.agents/skills/configuring-netskope/SKILL.md)
- (E outras skills em `.agents/skills/`)

## 🤖 Agentes Especializados
Agentes com personas, ferramentas e suporte a **subagents** (VS Code 1.97+):
- **Índice completo**: [.agents/agents/index.md](.agents/agents/index.md)
- **Coordenadores** (orquestram subagents): `feature-builder`, `code-reviewer`, `padrao-labs-agent`, `software-architect`
- **Especialistas** (workers): `secops-agent`, `quality-engineer`, `refactoring-agent`, `platform-engineer`, `frontend-expert`, `mobile-engineer`, `terminal-operator`

## 🔄 Workflows
Fluxos de trabalho passo-a-passo:
- **Deploy Local (DEV)**: [.agents/workflows/deploy_local_dev.md](.agents/workflows/deploy_local_dev.md)
- **Deploy HML (CI/CD)**: [.agents/workflows/deploy_hml.md](.agents/workflows/deploy_hml.md)

---
**Observação**: Este arquivo serve como mapa. O conteúdo detalhado foi migrado para os arquivos acima para melhor organização e contexto. Não invente regras; siga as fontes da verdade listadas.
