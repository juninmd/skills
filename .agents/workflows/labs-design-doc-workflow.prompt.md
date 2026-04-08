---
name: labs-design-doc-workflow
description: Workflow for generating a Design Doc from code, including architecture, security, observability, and quality analysis.
---

# Workflow: Design Doc from Code

This workflow standardizes the execution of `archdd-agent` with the `design-doc-generator` skill to produce complete, auditable Design Docs ready for Confluence Markdown.

## When to Use
- When a Design Doc is needed for an existing application or repository.
- When architectural analysis is required with C4, sequence flows, security, and risk mapping.
- When the document must be traceable to concrete evidence from source code.

## Prerequisites
- Read access to the target repository.
- Minimum project structure available (code, configs, and docs).
- Confirmed analysis scope (service, module, or full system).

## Step by Step
1. **Map System Context**
   - Identify domain, system purpose, and core components.
   - Map internal/external dependencies and resources (DB, queues, APIs, storage).

2. **Analyze Current Architecture (AS-IS)**
   - Derive a C4 Container-level view from the current implementation.
   - Identify bottlenecks, technical debt, operational risks, and failure points.

3. **Define Proposed Architecture (TO-BE)**
   - Propose architectural evolution aligned with technical and business goals.
   - Explicitly classify existing, new, and changed components with visual legends.

4. **Model Flows and Contracts**
   - Generate success-path sequence diagrams and alternative/failure paths.
   - Document relevant payloads (request, headers, response) when applicable.

5. **Cover Cross-Cutting Requirements**
   - Security: IDP, authorization, encryption, WAF/Cloud Armor/Vault.
   - Data/LGPD: personal/sensitive data handling, Lake/Analytics flows, and risks.
   - Quality: health checks, Swagger/OpenAPI, dependency tags, OpenTelemetry, hangar-info.

6. **Generate Final Output in Mandatory Template**
   - Fill 100% of structural sections without removing blocks.
   - When evidence is missing, explicitly register gaps and open questions.

## Acceptance Criteria
- Final document in Markdown with no extra conversational text.
- All mandatory template sections fully present.
- `mermaid` C4 and sequence diagrams included and consistent with the narrative.
- Security, risks, monitoring, and code quality properly mapped.

## Anti-patterns
- Inventing reviewers, integrations, or controls without code evidence.
- Omitting required template sections due to missing data.
- Using "keep as-is" as an alternative solution.
- Producing an overly technical summary without clear value and decision guidance.

## Expected Outcome
A Design Doc ready for technical and product review, with traceability to implementation and governance (architecture, security, quality, and operations).
