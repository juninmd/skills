# Software Design Principles Reference

Detailed guidelines for Clean Code, DRY, KISS, SOLID, and YAGNI principles.

## Clean Code
- **Meaningful Names:** Intention-revealing, no abbreviations.
- **Small Functions:** Short, single-purpose functions.
- **No Magic Numbers:** Use named constants.
- **Purposeful Comments:** Explain *why*, not *what*.
- **Consistent Formatting:** Standardized indentation and grouping.

## DRY (Don't Repeat Yourself)
- Extract identical or nearly identical duplications.
- Parameterize small variations.
- Consolidate repeated constants/configurations.
- *Avoid unifying distinct business rules that happen to look similar.*

## KISS (Keep It Simple, Stupid)
- Avoid over-engineering for hypothetical scenarios.
- Prefer straightforward logic over "clever" constructs.
- Reduce nesting with guard clauses.
- Remove unused parameters and flexibility.

## SOLID
- **Single Responsibility (SRP):** One reason to change.
- **Open/Closed (OCP):** Open for extension, closed for modification.
- **Liskov Substitution (LSP):** Subclasses must be substitutable for superclasses.
- **Interface Segregation (ISP):** Small, specific interfaces.
- **Dependency Inversion (DIP):** Depend on abstractions.

## YAGNI (You Aren't Gonna Need It)
- Implement only what is necessary now.
- Delete unused classes, methods, and parameters.
- No abstract interfaces for non-existent requirements.
- Remove "just-in-case" logic.

## Practical Rules

### 1. File Size Limits (ENFORCED)
| File Type | Max Lines |
|-----------|-----------|
| Source files | 200 lines |
| Functions/Methods | 25 lines |
| Test files | 100 lines per `describe` block |
**Why?** Files >200 lines are harder to test, review, and understand. Split by feature or responsibility.

### 2. Nesting Depth (MAX 3 LEVELS)
Use guard clauses and early returns to avoid deep nesting.

### 3. Function Parameters (MAX 5)
If a function requires 6 or more parameters, group them into a typed object/interface.

### 4. Feature Slices (Colocation)
Group files by feature (e.g., `checkout-page.tsx`, `checkout-service.ts`, `use-checkout.ts` inside `features/checkout/`). Avoid separating by technical type (`components/`, `hooks/`, `services/`) unless they are truly shared across features.

### 5. Clean Architecture Layers
Dependencies flow inward. Inner layers know nothing about outer layers.

## Anti-Patterns
- ❌ `utils/`, `helpers/`, `common/` without domain context.
- ❌ `index.ts` files that re-export everything.
- ❌ Inheritance for simple composition (use `extend` or `mixin` pattern instead).
- ❌ Business logic in UI components (extract to hooks/services).
- ❌ API calls directly in components (use service layer).

## Refactoring Triggers
- **File > 200 lines:** Split by feature/responsibility.
- **Function > 25 lines:** Extract intention-revealing helpers.
- **Nesting > 3 levels:** Guard clauses, early returns, extract function.
- **3+ similar functions:** Extract shared utility.
- **Component with > 5 props:** Consider compound components.

## References
- [SOLID Principles (Wikipedia)](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code (Summary)](https://github.com/ryanmcdermott/clean-code-javascript)
