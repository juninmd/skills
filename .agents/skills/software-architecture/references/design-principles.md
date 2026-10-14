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

## Dependency Rule (Clean Architecture)
Source-code dependencies point only inward, toward policy — never toward a framework, a database driver, or a transport type (Robert C. Martin, *Clean Architecture*). The domain layer imports nothing from infrastructure; infrastructure implements interfaces the domain declares.

- **Essential coupling:** two things must agree because the domain requires it — an `Order` and its `LineItem`s. No refactor removes this; only where it lives is a choice.
- **Accidental coupling:** two things agree only because of how they happen to be implemented — a shared ORM entity reused across bounded contexts, a copy-pasted validation rule, a global. This is the coupling worth spending effort to remove (Sam Newman, *Building Microservices*, on coupling strength and change amplification).
- A violation reads as: a domain type importing an HTTP client or ORM decorator, a repository importing a controller, `core/` importing `infra/`. Encode the allowed edges as a lint rule — see the dependency-cycle table in [SKILL.md](../SKILL.md); a violation caught only in review recurs the next sprint.

## Bounded Contexts (Domain-Driven Design)
A bounded context is the boundary inside which a term has exactly one meaning (Eric Evans, *Domain-Driven Design*). Two teams editing the same table under two meanings — `status` meaning fulfillment state to the warehouse team and payment state to billing — is a bounded-context violation, not a naming disagreement. See [domain-modeling.md](domain-modeling.md) for the vocabulary-drift table and [real-world-cases.md](real-world-cases.md) for detecting the violation and integrating across it with an anti-corruption layer.

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
