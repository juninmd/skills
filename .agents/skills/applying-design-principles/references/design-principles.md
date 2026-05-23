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

## References
- [SOLID Principles (Wikipedia)](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code (Summary)](https://github.com/ryanmcdermott/clean-code-javascript)
