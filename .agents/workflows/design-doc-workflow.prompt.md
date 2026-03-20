---
name: design-doc-workflow
description: Workflow para geração de Design Doc a partir de código, incluindo análise arquitetural, segurança, observabilidade e qualidade.
metadata:
    works_on: [copilot, antigravity]
---

# Workflow: Design Doc a partir de Código

Este workflow padroniza a execução do `archdd-agent` com a skill `design-doc-generator` para produzir Design Docs completos e auditáveis, prontos para Confluence Markdown.

## Quando usar
- Quando for necessário criar um Design Doc de uma aplicação/repositório existente.
- Quando houver necessidade de análise arquitetural com C4, fluxos de sequência, segurança e riscos.
- Quando o documento precisar ser rastreável com evidências do código.

## Pré-requisitos
- Acesso de leitura ao repositório alvo.
- Estrutura mínima do projeto acessível (código, configurações e docs).
- Confirmação do escopo da análise (serviço, módulo, ou sistema completo).

## Passo a passo
1. **Mapear contexto do sistema**
   - Identificar domínio, propósito do sistema e principais componentes.
   - Levantar dependências internas/externas e recursos (DB, filas, APIs, storage).

2. **Analisar arquitetura atual (AS-IS)**
   - Derivar C4 nível Container da implementação atual.
   - Identificar gargalos, dívida técnica, riscos de operação e pontos de falha.

3. **Definir arquitetura proposta (TO-BE)**
   - Propor evolução arquitetural alinhada com objetivos técnicos e de negócio.
   - Explicitar componentes existentes, novos e alterados com legendas visuais.

4. **Modelar fluxos e contratos**
   - Gerar diagrama de sequência de sucesso e fluxos alternativos/falha.
   - Documentar payloads relevantes (request, headers, response) quando aplicável.

5. **Cobrir requisitos transversais**
   - Segurança: IDP, autorização, criptografia, WAF/Cloud Armor/Vault.
   - Dados/LGPD: dados pessoais/sensíveis, envio para Lake/Analytics, riscos.
   - Qualidade: health checks, swagger, dependency tags, OpenTelemetry, hangar-info.

6. **Gerar saída final no template obrigatório**
   - Preencher 100% das seções estruturais sem remover blocos.
   - Quando faltarem evidências, registrar lacunas e perguntas em aberto.

## Critérios de aceite
- Documento final em Markdown, sem texto conversacional extra.
- Seções obrigatórias do template integralmente presentes.
- Diagramas `mermaid` C4 e sequência incluídos e coerentes com o texto.
- Segurança, riscos, monitoramento e qualidade de código devidamente mapeados.

## Anti-patterns
- Inventar revisores, integrações ou controles sem evidência no código.
- Omitir seções do template por falta de dados.
- Usar "manter como está" como solução alternativa.
- Produzir visão geral técnica demais (foco deve ser no "o que" e valor).

## Resultado esperado
Um Design Doc pronto para revisão técnica e de produto, com rastreabilidade para implementação e governança (arquitetura, segurança, qualidade e operação).
