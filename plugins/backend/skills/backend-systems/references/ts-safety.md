# TypeScript Safety and Configuration

Guidelines for strict-mode static analysis and compiler configuration.

## 1. Mandatory tsconfig.json Settings
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}
```

## 2. Core Safety Rules
- **No `any`:** Use `unknown` for inputs with unknown shapes; narrow types using type guards.
- **Explicit Returns:** Define return types for all public-facing functions.
- **No Boxed Types:** Use `string`, `number`, `boolean` instead of `String`, `Number`, `Boolean`.
- **Void Callbacks:** Use `() => void` for callbacks that return nothing, never `() => any`.

## 3. Type Guards example
```typescript
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data;
}
```
