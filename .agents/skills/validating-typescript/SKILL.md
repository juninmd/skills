---
name: validating-typescript
description: Validar código TypeScript executando verificação de tipos com tsc, linting e análise de correção de algoritmos para capturar erros de compilação, problemas de estilo e falhas lógicas.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[file/module] [options]"
---

# TypeScript Validation

Esta skill padroniza a validação rigorosa de código TypeScript através de type checking, linting e verificação de algoritmo, garantindo que o código seja correto, seguro e mantível.

## Instructions

1.  **Type Checking with tsc (TypeScript Compiler):**
    *   **Always Run:** `tsc --noEmit` antes de fazer commit ou deploy.
    *   **Reasoning:** O type checker é a primeira linha de defesa contra erros. Ele captura type mismatches, null/undefined bugs, propriedades inexistentes e incompatibilidades de interface.
    *   **Verification:** A saída deve ser vazia ou apenas warnings. Zero erros críticos (TS2, TS70xx).
    *   **Config:** Mantenha `tsconfig.json` com `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`.

2.  **ESLint & Formatter (Code Quality & Style):**
    *   **Lint & Fix:** `npm run lint -- --fix` ou `eslint . --fix` (ou equivalente pnpm).
    *   **Reasoning:** ESLint detecta code smells, imports não utilizados, variáveis não inicializadas, e padrões perigosos.
    *   **Verification:** Sem erros (apenas warnings se muito específicas e documentadas).
    *   **Formatter:** Após linting, rodar `prettier --write .` para garantir formatação consistente.

3.  **Algorithm Correctness (Logic Validation):**
    *   **Unit Tests:** Escrever testes com Vitest/Jest para validar o comportamento esperado e edge cases.
    *   **Example Valid Cases:** inputs vazios, `null`, números negativos, limites, períodos, strings especiais.
    *   **Example Invalid Cases:** race conditions, off-by-one errors, ordem incorreta de operações.
    *   **Reasoning:** Tipos garantem segurança, mas não garantem lógica correta. Testes confirmam que o algoritmo faz o que promete.
    *   **Verification:** Cobertura >= 80% para funções críticas. Todos os testes passando (green CI).

4.  **Integration into Development Workflow:**
    *   **Pre-commit Hook:** Use husky + lint-staged para rodar `tsc --noEmit`, `eslint` e testes antes de commit.
    *   **CI/CD Pipeline:** Inclua stages de `tsc`, `eslint`, `prettier --check` e `test` no pipeline GitLab CI.
    *   **IDE Integration:** Configure VS Code para mostrar type errors em tempo real (Pylance, TypeScript extension).

## Common Tasks

### Local Development
```bash
# Type check
tsc --noEmit

# Lint with auto-fix
npm run lint -- --fix

# Format code
prettier --write .

# Run tests (with coverage)
npm run test -- --coverage
```

### Pre-commit Setup (Husky + Lint-Staged)
```bash
pnpm add -D husky lint-staged
npx husky install

# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
lint-staged

# package.json
"lint-staged": {
  "src/**/*.ts": [
    "tsc --noEmit",
    "eslint --fix",
    "prettier --write"
  ]
}
```

### High-Performance Setup with SWC
```bash
# Instalar SWC para transpilação ultra-rápida (100x mais rápido que ts-jest)
pnpm add -D @swc/core @swc/jest

# jest.config.ts com SWC
export default {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  // Continua type checking separado com tsc
};
```

### GitHub / GitLab CI Example
```yaml
# .gitlab-ci.yml or .github/workflows/validate.yml
validate:
  script:
    - tsc --noEmit
    - npm run lint
    - prettier --check .
    - npm run test
```

## Best Practices

- **Type-First Development:** Comece pela interface (tipos), depois implemente. Tipos guiam a implementação.
- **No `any`:** Evite `any`. Use `unknown` e narrow types conforme necessário.
- **Strict Config:** Ative `strict: true` em `tsconfig.json`. Projetos herdados podem começar com `strict: false` e migrarem gradualmente.
- **Test Critical Logic:** Algoritmos, cálculos, e orquestração cross-layer devem ter testes. UI que só renderiza pode ter apenas testes visuais.
- **Document Assumptions:** Se um tipo ou algoritmo tem precondições, documente com JSDoc.
- **Fail Fast:** Conflitos type check + linting + testes devem bloquear merge.
- **Use SWC for Speed:** Para projetos com muitos testes, use SWC (`@swc/jest`, `@swc/esbuild`) em vez de `ts-jest` ou `babel-loader`. SWC é 100x+ mais rápido na transpilação, reduzindo tempo de CI/CD significativamente. Mantenha `tsc --noEmit` para type checking separado.

## Troubleshooting

- **Too Many Errors:** Se `tsc` reportar muitos erros em um projeto legado, comece com `strict: false` e aumente gradualmente ou use `@ts-ignore` comentários justificados.
- **Linter vs Formatter Conflict:** Use `eslint-config-prettier` como último extends em `.eslintrc` para evitar conflitos com Prettier.
- **Slow Type Checking:** Se `tsc` ficar lento, use `incremental: true` em `tsconfig.json` ou `tsc --incremental`.
- **Test Timeout:** Se os testes demorarem muito, use `--testTimeout` no Vitest/Jest ou divida em arquivos menores.
- **Slow Jest Tests:** Para turbinar a velocidade dos testes Jest com `ts-jest`, configure `isolatedModules: true` no `jest.config.ts` (dentro de `transform`) ou migre para SWC. Isso pula a checagem de tipos (deixe o `tsc --noEmit` cuidar disso) e acelera a execução massivamente.
- **Slow Build Times:** Se o build estiver lento, substitua webpack's `ts-loader` ou `babel-loader` por `swc-loader`. Configure em `webpack.config.js`:
  ```js
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'swc-loader',
      options: {
        jsc: { parser: { syntax: 'typescript', tsx: true } }
      }
    }]
  }
  ```
  SWC reduz tempo de build em até 70%.
- **SWC + ESBuild for Production:** Para bundling otimizado, use `esbuild` com `loader: 'ts'` (suporte nativo a TS) em vez de Webpack. Exemplo com esbuild CLI: `esbuild src/index.ts --bundle --loader:.ts=ts --outfile=dist/index.js`. Tempo de build: <1s para a maioria dos projetos.

## Related Skills

- `auditing-code` — Linting and formatting for multiple languages.
- `developing-node` — Package management and script execution for Node.js/TypeScript projects.
- `managing-quality` — Test strategies, coverage targets, and CI/CD integration.
