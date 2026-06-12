---
name: agent-security-owasp
description: "Agent Security & OWASP LLM Top 10 for Defending against, Implementing tool, Validating system via security-scanning, zero-trust-architecture."
license: MIT
metadata:
  version: 1.0.0
  token_budget_exception: "OWASP agent threats require explicit controls and verification guidance."
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Agent Security & OWASP LLM Top 10

Expert guidance for securing agentic AI systems against prompt injection, supply chain attacks, and instruction injection threats specific to agent architectures.

**USE FOR:**
- Defending against prompt injection (73% of production deployments vulnerable; 88% success rate).
- Implementing tool permission isolation and least-privilege tool binding.
- Validating system prompt and instruction injection vectors.
- Supply chain risk management (AI-BOM, dependency hash pinning, model weight verification).
- Designing HITL (Human-in-the-Loop) approval flows for high-impact tool calls.
- Agent-specific threat modeling and attack surface analysis.
- Audit logging and incident response for agent decisions.

**DO NOT USE FOR:**
- General application security (use `security-scanning`).
- Infrastructure hardening and network policy (use `zero-trust-architecture`).
- Encryption and key management (use `zero-trust-architecture`).

**INVOKES:**
- `security-scanning` for dependency and secrets management.
- `zero-trust-architecture` for supply chain attestation.
- `ai-code-review` for instruction injection detection in code reviews.

## OWASP LLM Top 10 for Agentic Applications (2026)

1. **LLM01: Prompt Injection** — Direct/indirect injection via untrusted inputs to agents.
2. **LLM02: Insecure Output Handling** — Agent output used without validation; tool results trusted implicitly.
3. **LLM03: Training Data Poisoning** — Model weights or training data compromised.
4. **LLM04: Model Denial of Service** — Expensive operations triggered via agent tools.
5. **LLM05: Supply Chain Vulnerability** — Dependencies, adapters, plugins carry malicious code.
6. **Agent-specific: Instruction Injection** — System prompt manipulation via tool outputs or user context.
7. **Agent-specific: Tool Abuse** — Agents executing unintended tools due to confused deputyship.
8. **Agent-specific: Permission Escalation** — Agent gains access beyond intended tool scope.
9. **Agent-specific: Unsafe Tool Call Chains** — Tool outputs feed into dangerous subsequent calls without validation.
10. **Agent-specific: Audit & Forensics Gaps** — No logging of agent decisions; impossible to reconstruct attack.

## Core Defense Patterns

1. **Tool Permission Isolation**
   - Least-privilege tool binding: agents only access required tools.
   - Capability lists: explicit tool contracts (parameters, return types).
   - Approval gates: high-impact tools (delete, transfer, notify) require HITL approval.

2. **Instruction Injection Defenses**
   - System prompt validation: use structured templates, not dynamic strings.
   - User input sanitization: escape/quote all untrusted data fed to agent.
   - Tool schema as contract: enforce strict parameter validation before tool invocation.

3. **Supply Chain Risk (AI-BOM)**
   - Dependency hash pinning: lock model weights, adapter versions to known-good hashes.
   - Provenance attestation: Sigstore/SLSA for model artifacts.
   - Incident response: immediate rollback if compromise detected.

4. **HITL Approval Flows**
   - High-risk operations (modify data, send notifications, delete resources) require human approval.
   - Timeout: unapproved tool calls expire after N seconds.
   - Audit trail: log approval decision, time, approver identity.

5. **Agent Loop Instrumentation**
   - Log every agent decision: input, tool selected, parameters, result.
   - Trace correlation: track request ID through entire agent→tool→result chain.
   - Error categorization: distinguish tool failures from reasoning errors.

## Checklist

- [ ] System prompt is static (not constructed from user input); validated before agent startup.
- [ ] All user inputs sanitized before passing to agent (escape untrusted data).
- [ ] Tool catalog defines least-privilege bindings (agents can't access unused tools).
- [ ] High-risk tools require HITL approval; approval gates tested and logged.
- [ ] Tool schemas are strict (parameter types, ranges, constraints enforced).
- [ ] Model weights, adapters pinned to specific versions/hashes; verified on load.
- [ ] All agent decisions logged: input → tool → result → next action (full ReAct trace).
- [ ] Incident response plan documented: detection, isolation, rollback playbook.
- [ ] Security testing: prompt injection attempts, tool abuse, permission escalation scenarios.
