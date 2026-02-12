---
name: node-dev
description: Gerenciamento de pacotes e scripts do ecossistema Node.js/TypeScript. Use para instalar dependências, rodar scripts npm/pnpm e gerenciar versões.
---

# Node.js Development

Esta skill foca na gestão eficiente de dependências e automação de builds JS/TS usando `pnpm`.

## Instructions
1.  **Package Manager:** Utilize EXCLUSIVAMENTE `pnpm` para gerenciamento de dependências.
    *   **Reasoning:** `pnpm` é mais rápido, eficiente em disco (symlinks) e previne "phantom dependencies" comuns no npm/yarn.
    *   **Verification:** Verifique a presença de `pnpm-lock.yaml`. Se encontrar `package-lock.json` ou `yarn.lock`, migre para `pnpm import` e remova os antigos.
2.  **Tool Execution:** Use `pnpm dlx` (equivalente ao `npx`) para ferramentas de linha de comando temporárias.
3.  **Scripts:** Execute scripts definidos no `package.json` via `pnpm run <script>`.

## Common Tasks
*   **Install Dependencies:** `pnpm install` (Instalação limpa baseada no lockfile).
*   **Add Package:** `pnpm add <package_name>` (Ex: `pnpm add lodash`).
*   **Add Dev Dependency:** `pnpm add -D <package_name>` (Ex: `pnpm add -D typescript`).
*   **Run Tests:** `pnpm test` (ou `pnpm run test`).
*   **Build Project:** `pnpm build`.

## Troubleshooting
*   **Erro `EACCES` ou Permissão:** Nunca use `sudo` com pnpm. Corrija as permissões do diretório global ou use um gerenciador de versão (nvm/volta).
*   **Erro de Certificado/SSL:** Se estiver na rede corporativa (Netskope), configure o cafile: `npm config set cafile /path/to/cert.pem` (ou use a skill `netskope-config`).

## Resources
- `assets/FORMS.md` contém o checklist obrigatório para adicionar novas dependências (Segurança/Licença).