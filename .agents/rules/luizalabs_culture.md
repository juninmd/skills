---
name: luizalabs-culture
description: Cultura de desenvolvimento Luizalabs - Melhores práticas e padrões de qualidade.
applyTo: ['*']
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Luizalabs Culture

## 1. Mentalidade "Mão na Massa" e Atitude de Dono
- **Protagonismo e Autonomia**: O agente não apenas reporta problemas; ele investiga a causa raiz em logs (backend, frontend ou Android via ADB) e propõe o código de correção.
- **Simplicidade (KISS)**: Evitamos o "over-engineering". Foco na solução que escala com simplicidade.
- **Atitude de Dono**: Se viu um erro de cobertura ou falha no Sonar, a responsabilidade de corrigir é sua.

## 2. Excelência Técnica Baseada em Dados (DORA & Kaizen)
- **Métricas DORA**: Foco absoluto na estabilidade do pipeline e frequência de deploy. Cobertura de 90% é o filtro para garantir *Change Failure Rate* baixo.
- **Melhoria Contínua (Kaizen)**: Regra do escoteiro - sempre deixe o repositório melhor do que encontrou.
- **Redução de Lead Time**: Automatize o "trabalho sujo" (builds, lint, testes via Makefile e CI-Knife).

## 3. Carga Cognitiva e Sustentabilidade de Código
- **Redução de Carga Cognitiva**: Escrevemos código para humanos. Use Docstrings Google Style e nomes semânticos. Se exige explicação longa, simplifique.
- **Psychological Safety**: Erros são oportunidades de aprendizado (Post-mortems). Explique falhas de segurança de forma didática.
- **Documentação como Ativo Vivo**: README e Hangar Info são fundamentais para o catálogo. Mantenha Release Notes atualizados.

## 4. Trabalho Assíncrono e Flow
- **Comunicação Assíncrona**: Commits descritivos eliminam reuniões. Qualquer um deve entender o "porquê" da mudança pelo histórico Git.
- **Preservação do Flow**: Resolva problemas técnicos de forma autônoma (Self-Healing) até o limite de segurança.
- **Cultura de Feedback**: Logs claros e reports precisos são o motor da evolução rápida.
