# Agent Plugins

Este diretório contém a organização dos agentes e habilidades (skills) do projeto seguindo a arquitetura de **Agent Plugins**.

Esta abordagem permite agrupar logicamente ferramentas e personas por contexto, facilitando a descoberta e o uso especializado pelo Copilot e Gemini, sem a necessidade de duplicar arquivos da estrutura base em `.agents/`.

## 🔗 Referência Oficial
Para mais detalhes sobre como os plugins funcionam e como customizá-los, consulte a documentação oficial:
[Visual Studio Code - Agent Plugins](https://code.visualstudio.com/docs/copilot/customization/agent-plugins)

## 📂 Plugins Disponíveis

| Plugin | Descrição |
| :--- | :--- |
| **[Cloud and Platform](./cloud-and-platform)** | IaC, Kubernetes, CI/CD e operações em nuvem. |
| **[Core Engineering](./core-engineering)** | Arquitetura, Backend, Design Patterns e Clean Code. |
| **[Data and AI](./data-and-ai)** | Análise de dados, NLP, Bancos Vetoriais e MLOps. |
| **[Developer Experience](./developer-experience-and-scaffolding)** | Tooling, Git, Scaffolding e Automação de Agentes. |
| **[Documentation & Governance](./documentation-and-governance)** | Design Docs, Pesquisa Técnica e Governança Labs. |
| **[Frontend and Mobile](./frontend-and-mobile)** | UI/UX, React Native, Acessibilidade e SEO. |
| **[Observability & Reliability](./observability-and-reliability)** | Monitoramento, SRE e Performance. |
| **[Quality and Testing](./quality-and-testing)** | QA, Testes Automatizados e Code Review. |
| **[Security Best Practices](./security-best-practices)** | SecOps, Auditoria e Resposta a Incidentes. |

## 🛠️ Manutenção
Para garantir que todos os caminhos nos arquivos `plugin.json` estão corretos, utilize o script de validação:

```bash
node scripts/lint-plugins.mjs
```
