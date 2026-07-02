---
name: testing-standards
description: Unit and integration testing standards for reliable, maintainable suites.
applyTo: '**/*test*.{py,ts,tsx,js,jsx,go,java,kt}, **/tests/**/*, **/test/**/*'
---

# Rule: Testing Standards

## Test Structure
- Use **AAA** pattern: Arrange, Act, Assert.
- Test names must describe expected behavior.
- Keep one behavior assertion per test when possible.
- Mock only external boundaries (network, database, file system, queues).

## Quality Gates
- Avoid logic branches inside tests.
- Avoid brittle assertions tied to implementation details.
- Tests must be deterministic and runnable locally and in CI.

## Coverage Guidance
- Maintain minimum project coverage targets.
- Prioritize critical paths: authentication, payments, data integrity, and error flows.

