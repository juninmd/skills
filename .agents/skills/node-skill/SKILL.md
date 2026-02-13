---
name: node-dev
description: Gerenciamento de pacotes e scripts do ecossistema Node.js/TypeScript. Prioriza pnpm, mas suporta npm para projetos legados.
metadata:
  metadata:
    works_on: [vscode, antigravity, gemini_cli]

---

# Node.js Development

Esta skill foca na gestão eficiente de dependências e automação de builds JS/TS, padronizando o uso de `pnpm` para projetos novos e migrações.

## Instructions
1.  **Package Manager Strategy:**
    *   **Standard:** Use `pnpm` para novos projetos. É mais rápido e eficiente em disco.
    *   **Legacy:** Se encontrar `package-lock.json`, use `npm` para manter consistência, mas planeje a migração.
    *   **Verification:** Verifique a raiz do projeto.
        *   `pnpm-lock.yaml` → Use `pnpm`.
        *   `package-lock.json` → Use `npm` (e considere migrar).
2.  **Tool Execution:**
    *   **pnpm:** Use `pnpm dlx` para ferramentas temporárias.
    *   **npm:** Use `npx`.
3.  **Scripts:** Execute scripts via `pnpm run <script>` ou `npm run <script>`.

## Common Tasks
*   **Install Dependencies:**
    *   `pnpm install` (Ideal)
    *   `npm ci` (Para builds reprodutíveis com npm)
*   **Add Package:**
    *   `pnpm add <package>`
    *   `npm install <package>`
*   **Run Tests:** `pnpm test` ou `npm test`.
*   **Migration (npm → pnpm):**
    *   Rodar: `pnpm import` (Gera pnpm-lock.yaml a partir do package-lock.json).
    *   Rodar: `rm package-lock.json` e `rm -rf node_modules`.
    *   Rodar: `pnpm install`.

## Troubleshooting
*   **Erro `EACCES`:** Nunca use `sudo` para instalar pacotes globais. Use nvm/volta.
*   **Phantom Dependencies:** Se um pacote funciona mas não está no `package.json`, o `npm` pode estar "vazando" dependências (hoisting). O `pnpm` corrige isso por padrão, o que pode quebrar imports indevidos após a migração.
*   **Certificados (Netskope):** `npm config set cafile /path/to/cert.pem` funciona para ambos (o pnpm lê a config do npm).

## Resources
- `assets/FORMS.md`: Checklist para novas dependências (Segurança/Licença).