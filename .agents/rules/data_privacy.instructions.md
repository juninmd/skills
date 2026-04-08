---
name: data-privacy
description: Data privacy and sensitive-data handling rules aligned with LGPD principles.
applyTo: '**/*.{py,ts,tsx,js,jsx,go,java,kt,sql}, **/*.md'
---

# Rule: Data Privacy

## Data Handling
- Classify personal and sensitive fields in domain models.
- Collect only data strictly necessary for the business purpose.
- Define retention and deletion policy for personal data.

## Protection Controls
- Encrypt sensitive data in transit and at rest.
- Restrict data access by least privilege.
- Redact or anonymize sensitive data in logs and telemetry.

## Compliance Flow
- Support data-subject rights flows (access, correction, deletion) where applicable.
- Record audit trails for sensitive data operations.
