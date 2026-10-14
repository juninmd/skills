# TypeScript Troubleshooting and Optimization

Resolution steps for common developer friction points.

## 1. Troubleshooting Errors
- **Slow tsc:** Enable `incremental: true` or `skipLibCheck: true`.
- **Too many errors:** Start with `strict: false` and migrate module-by-module.
- **Memory leaks:** Use `tsc --watch` with the `-p` flag and restart periodically on large projects.

## 2. Optimization Patterns
- **Type Inference:** Let TS infer types for simple assignments to reduce noise.
- **Discriminated Unions:** Use for type-safe state machines and API responses.
- **Exhaustive Checks:** Use `never` in switch-case defaults to ensure all union members are handled.
- **Zod Validation:** Use `zod` at the network/input boundary to ensure runtime-to-type safety.

## References
- [TypeScript Official Docs](https://www.typescriptlang.org/docs/)
- [Biome Docs](https://biomejs.dev/)
- [Vitest Guide](https://vitest.dev/guide/)
