---
name: managing-dependencies-renovate
description: Automação segura de atualização de dependências (npm, pip, docker) com auto-merge em patches não-quebrantes.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[repo/file] [options]"
---

# Renovate Operations (Dependency Bot)

Esta skill orquestra a "limpeza" contínua do código, mantendo dependências sempre seguras e atualizadas.

## Instructions
1.  **Configuration (Config as Code):** `renovate.json` DEVE estar na raiz.
    *   **Extends:** `config:base`, `schedule:nonOfficeHours`, `:prHourlyLimit2`.
2.  **Auto-Merge (Safe Updates):** Automatize atualizações de `patch` e `minor` para dependências dev e libs internas, desde que o CI passe.
    *   **Condition:** `packageRules: [{ "matchUpdateTypes": ["minor", "patch"], "automerge": true }]`
3.  **Vulnerability Fixes:** Prioridade máxima para updates de segurança.
    *   **Condition:** `vulnerabilityAlerts: { "enabled": true, "automerge": true }`
4.  **Pin Versions:** Fixe versões exatas em `package.json` e `requirements.txt` (sem `^` ou `~`).
    *   **Reasoning:** Evita builds "quebrados do nada" (determinismo).

## Example: `renovate.json` Standard
```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:base",
    ":rebaseStalePrs",
    ":prHourlyLimitNone"
  ],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch", "pin", "digest"],
      "automerge": true,
      "matchPackagePatterns": ["*"]
    },
    {
      "matchDepTypes": ["devDependencies"],
      "automerge": true
    }
  ],
  "rangeStrategy": "pin"
}
```

## Troubleshooting
*   **Renovate Stuck:** Verifique o Dashboard do Renovate (issue no repo).
*   **Configure Ignore:** Se uma atualização quebra, adicione `"ignoreDeps": ["package-name"]`.
