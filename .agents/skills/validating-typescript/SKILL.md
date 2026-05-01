---
name: validating-typescript
description: "Validate TypeScript with strict type safety. Triggers: typescript, validation."

argument-hint: "[file/module] [options: strict, types, patterns, lint, test]"
---

# TypeScript Validation & Best Practices (2025)

Comprehensive validation of TypeScript code combining type safety, advanced type patterns, compiler checks, linting, and algorithm verification to ensure production-ready code.

## Core Validation Phases

### Phase 1: Type Safety First (Static Analysis)

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "target": "ES2022",
    "module": "ES2022"
  }
}
```

**Validation Rules:**
- ✅ Run `tsc --noEmit` before every commit
- ✅ Zero `any` type usage (except during JS→TS migration)
- ✅ Use `unknown` instead of `any` for truly unknown values
- ✅ Explicit types for all function parameters
- ✅ Use `void` return type for callbacks (not `any`)
- ✅ Never use boxed types (`Number`, `String`, `Boolean`—use lowercase)

**Common Violations to Catch:**
```typescript
// ❌ WRONG
function process(data: any) { }
function callback(x: () => any) { }
const boxed: String = "hello";  // Boxed type

// ✅ CORRECT
function process(data: unknown) { /* narrow type */ }
function callback(x: () => void) { }
const str: string = "hello";
```

### Phase 2: Advanced Type Patterns (2025)

**Validate Type Feature Usage:**

1. **Mapped Types** — Transform existing types
```typescript
type User = { name: string; age: number };
type UserReadonly = { readonly [K in keyof User]: User[K] };
```

2. **Template Literal Types** — Dynamic type generation
```typescript
type Color = "red" | "green" | "blue";
type ColorCode = `${Color}-color`;  // "red-color" | ...
```

3. **Conditional Types** — Type-level logic
```typescript
type IsString<T> = T extends string ? true : false;
type Flatten<T> = T extends Array<infer U> ? U : T;
```

4. **Function Overloads** — Order from specific to general
```typescript
// ✅ CORRECT: Specific to general
function fn(x: HTMLDivElement): string;
function fn(x: HTMLElement): number;
function fn(x: unknown): unknown;

// ❌ WRONG: General to specific
function fn(x: unknown): unknown;
function fn(x: HTMLElement): number;  // Unreachable!
```

5. **Generics** — Must use their type parameters
```typescript
// ✅ CORRECT: T is used
function process<T>(item: T): T { return item; }

// ❌ WRONG: T is unused
interface Box<T> { value: string; }
```

**Validation Checklist:**
- ✅ Generics actually use their type parameters
- ✅ Callback parameters are non-optional (don't use optional for multiarity)
- ✅ Function overloads ordered: specific → general
- ✅ Mapped types don't reinvent built-ins (Partial, Required, etc)
- ✅ Conditional types have clear purpose
- ✅ Union types preferred over multiple overloads

### Phase 3: Biome (Code Quality & Style)

**Commands:**
```bash
# Check and fix all issues
biome check --write .

# Check specific file
biome check src/myfile.ts --write

# Format only
biome format --write .
```

**Validates:**
- Unused imports and variables
- Code smells and potential bugs
- Consistent formatting (replaces ESLint + Prettier)
- Style guide compliance
- No redundant `else` blocks
- Proper async patterns

### Phase 4: Algorithm Correctness (Testing)

**Testing Strategy (Test Pyramid):**
```
        E2E Tests        [small]
    Integration Tests    [medium]
        Unit Tests       [large]
```

**Unit Test Pattern (AAA):**
```typescript
describe("calculateDiscount", () => {
  it("returns correct discount for valid percentage", () => {
    // Arrange
    const price = 100;
    const percentage = 10;

    // Act
    const result = calculateDiscount(price, percentage);

    // Assert
    expect(result).toBe(90);
  });

  it("throws on negative percentage", () => {
    expect(() => calculateDiscount(100, -10)).toThrow(ValidationError);
  });
});
```

**Coverage Goals:**
- ✅ >= 80% coverage for critical functions (algorithms, calculations)
- ✅ Edge cases tested: `null`, `undefined`, empty, boundaries, negative
- ✅ Error paths tested: exceptions, timeouts, invalid inputs
- ✅ Integration tests for cross-module communication

**Use Vitest (Recommended):**
```bash
vitest run --coverage
```

### Phase 5: CI/CD Integration

**Pre-commit Hook (Husky):**
```bash
# .husky/pre-commit
#!/bin/sh
tsc --noEmit
biome check --write .
vitest run
```

**GitLab CI Pipeline:**
```yaml
validate-typescript:
  script:
    - tsc --noEmit
    - biome check .
    - vitest run --coverage
  coverage: '/Coverage: \d+\.\d+%/'
```

## 2025 Best Practices

### Type Safety Patterns
- ✅ **Type Inference**: Let TypeScript infer when possible (`const arr = [1,2,3]`)
- ✅ **Discriminated Unions**: Use for type-safe state machines
- ✅ **Exhaustive Checks**: Use `never` to ensure all cases handled
- ✅ **Strict Null Checks**: Always enabled; handle `null`/`undefined` explicitly

### Performance & Optimization
- ✅ **Code Splitting**: Use dynamic imports for large modules
- ✅ **SWC for Speed**: Replace ts-jest with `@swc/jest` (100x faster)
- ✅ **Incremental Builds**: Enable `incremental: true` in tsconfig
- ✅ **ESBuild for Production**: Use instead of Webpack for 70% faster builds

### Framework Integration
- **React 19**: Use `use()` hook for promises, `useFormStatus`, `useOptimistic`
- **Angular**: Type models with interfaces, leverage dependency injection
- **Vue 3**: Use `<script setup lang="ts">` for type-safe components
- **Next.js**: Type `getServerSideProps`, `getStaticProps`, API routes

### Testing Best Practices
- ✅ AAA (Arrange-Act-Assert) pattern
- ✅ Behavior-focused test names
- ✅ No business logic in tests
- ✅ Mock external dependencies only
- ✅ Use `@testing-library` for React (avoid implementation details)

### Security Considerations
- ✅ Validate all external inputs with Zod or similar
- ✅ Type-safe API responses
- ✅ No hardcoded secrets
- ✅ Sanitize HTML rendering
- ✅ Implement proper error handling (reveal minimal info)

## Validation Checklist

**Before Commit:**
- ✅ `tsc --noEmit` passes with no errors
- ✅ `biome check .` passes
- ✅ All tests pass: `vitest run`
- ✅ Coverage >= 80% for critical code
- ✅ No `any` type usage
- ✅ No `@ts-ignore` without comment explaining why
- ✅ No unused imports/variables
- ✅ Function overloads ordered correctly (specific → general)
- ✅ Error handling implemented
- ✅ Security reviewed (validation, sanitization, secrets)

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Too many errors | Legacy project | Start with `strict: false`, migrate gradually |
| Slow type checking | Large codebase | Enable `incremental: true` |
| Tests timeout | Many tests | Use `--testTimeout` or split into smaller files |
| Slow Jest | ts-jest slow | Migrate to SWC: `@swc/jest` |
| Slow build | Webpack + ts-loader | Use SWC: `swc-loader` or ESBuild |
| `tsc` memory leak | Large projects | Use `--watch` with `-p` flag and restart periodically |

## Related Skills

- `auditing-code` — Multi-language linting
- `developing-node` — TypeScript tooling
- `managing-quality` — Testing & coverage
- `designing-graphql-schemas` — Type-safe APIs
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  // Continues separate type checking with tsc
};
```

### CI Example on GitHub / GitLab
```yaml
# .gitlab-ci.yml or .github/workflows/validate.yml
validate:
  script:
    - tsc --noEmit
    - biome check .
    - vitest run
```

## Best Practices

- **Type-First Development:** Start with the interface (types), then implement. Types guide the implementation.
- **No `any`:** Avoid `any`. Use `unknown` and narrow types as needed.
- **Strict Configuration:** Enable `strict: true` in `tsconfig.json`. Legacy projects can start with `strict: false` and migrate gradually.
- **Test Critical Logic: ** Algorithms, calculations, and cross-layer orchestration must have tests. UI that only renders may only have visual tests.
- **Document Assumptions:** If a type or algorithm has preconditions, document them with JSDoc.
- **Fail Fast:** Conflicts between type checking, linting, and tests should block merges.
- **Use SWC for Performance:** For projects with many tests, use SWC (`@swc/jest`, `@swc/esbuild`) instead of `ts-jest` or `babel-loader`. SWC is 100x+ faster in transpilation, significantly reducing CI/CD time. Keep `tsc --noEmit` for separate type checking.

## Troubleshooting

- **Too Many Errors:** If `tsc` reports many errors in a legacy project, start with `strict: false` and increase gradually or use justified `@ts-ignore` comments.
- **Migration to Biome:** If migrating from legacy tooling, delete `.eslintrc`, `.prettierrc`, and `eslint-config-prettier`. Initialize with `biome init` and rely strictly on `biome.json`.
- **Slow Type Checking:** If `tsc` becomes slow, use `incremental: true` in `tsconfig.json` or `tsc --incremental`.
- **Test Timeout:** If tests take too long, use `--testTimeout` in Vitest/Jest or split into smaller files.
- **Slow Jest Tests:** To boost the speed of Jest tests with `ts-jest`, set `isolatedModules: true` in `jest.config.ts` (inside `transform`) or migrate to SWC. This skips type checking (let `tsc --noEmit` handle that) and speeds up execution massively.
- **Slow Build Time:** If the build is slow, replace webpack's `ts-loader` or `babel-loader` with `swc-loader`. Configure in `webpack.config.js`:
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
  SWC reduces build time by up to 70%.
- **SWC + ESBuild for Production:** For optimized bundling, use `esbuild` with `loader: 'ts'` (native TS support) instead of Webpack. Example with esbuild CLI: `esbuild src/index.ts --bundle --loader:.ts=ts --outfile=dist/index.js`. Build time: <1s for most projects.

## Related Skills

- `auditing-code` — Linting and formatting for multiple languages.
- `developing-node` — Package management and script execution for Node.js/TypeScript projects.
- `managing-quality` — Testing strategies, coverage goals, and CI/CD integration.

## References

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Biome Linter/Formatter](https://biomejs.dev/)
- [Vitest Testing Framework](https://vitest.dev/guide/)
