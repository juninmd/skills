# Cross-File Code Smells and Architectural Refactoring

Open when diagnosing structural smells that span multiple functions or files (feature envy, shotgun surgery, primitive obsession, divergent change) during code review.

## Contents

- Diagnostic Preflight
- Cross-File Code Smells Catalog
- Symptom-to-Refactor Mapping
- Guardrails and Verification

## Diagnostic Preflight

Detect candidates across files using targeted searches:

```bash
# Locate classes with high method counts to inspect for divergent change
rg -n 'class \w+' -g '*.{ts,py,cs}' | wc -l

# Identify files frequently coupled across commits (shotgun surgery signals)
git log --format= --name-only --since='6 months ago' | sort | uniq -c | sort -rn | head -n 20
```

## Cross-File Code Smells Catalog

| Code Smell | Architectural Signal | Target Refactor |
|---|---|---|
| **Feature Envy** | A method repeatedly queries internal fields or methods of an external collaborator rather than its host class | Move Method onto the queried collaborator; or Extract Method and relocate the extracted fragment |
| **Shotgun Surgery** | A single conceptual domain update forces minor edits across multiple disparate files and packages | Consolidate the distributed responsibility into a single cohesive module or service |
| **Primitive Obsession** | Domain constructs (email addresses, monetary values, tenant IDs, tokens) are passed around as raw strings or integers | Introduce branded types, value objects, or domain records that encapsulate validation at boundaries |
| **Divergent Change** | A single file or class frequently changes for multiple unrelated business reasons | Split the class along its separate axes of change so each responsibility evolves independently |

## Symptom-to-Refactor Mapping

| Symptom in Review | Likely Smell | Safe Refactor |
|---|---|---|
| A service method mostly extracts properties from an argument to calculate state | Feature Envy | Relocate the calculation directly onto the target object's interface |
| A bug fix requires applying identical logic changes across five separate handlers | Shotgun Surgery | Consolidate the repeated logic into a shared utility or domain helper before applying the fix |
| A function takes four string parameters representing distinct entities (`tenantId`, `userId`, `docId`, `orgId`) | Primitive Obsession | Create typed entity wrappers or branded types to make argument swapping a compile-time error |
| Every feature pull request regardless of domain touches the same massive manager file | Divergent Change | Partition the manager into domain-specific modules with explicit interfaces |

## Guardrails and Verification

1. **Smells Are Indicators, Not Inflexible Rules:** A small helper class calling a couple of getters is not necessarily feature envy requiring architectural overhauls. Refactor only when complexity causes maintenance friction.
2. **Dedicated Refactoring Commits:** Always perform architectural smell refactorings in a distinct, isolated commit, separate from functional feature additions or bug fixes.
3. **Cross-File Scope:** These patterns emerge across module boundaries; evaluate their coupling impact across caller graphs before reorganizing class responsibilities.
