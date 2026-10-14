# Privacy Engineering: LGPD and GDPR

Open when code or a design collects, stores, shares, or deletes personal data and the question is whether it complies: legal basis, consent, retention, data subject requests, breach notification. This is an engineering review, not legal advice; when the answer depends on interpretation, say so and route it to the data protection officer (LGPD *encarregado*, GDPR DPO).

## Contents

- Map the data first
- Legal basis
- Engineering controls
- Data subject requests
- Breach notification deadlines
- Evidence to keep
- Sources

## Map the data first

Build a table before judging anything. A review without it is guessing.

| Field | Source | Purpose | Legal basis | Where stored (incl. logs, caches, backups, analytics) | Shared with | Retention |
|---|---|---|---|---|---|---|

- Personal data is anything that identifies a person directly or indirectly: name, CPF, email, phone, IP, device ID, precise location, cookie IDs.
- Sensitive data (LGPD art. 5 II, GDPR art. 9): health, biometrics, genetics, racial or ethnic origin, religion, political opinion, union membership, sex life. It needs a narrower basis and stronger controls.
- Children's data (LGPD art. 14): processing in the child's best interest; consent from a parent or guardian for children.
- Follow copies: logs, error trackers, analytics events, search indexes, data warehouses, and backups are all processing.

## Legal basis

LGPD art. 7 lists ten bases; the ones product code usually relies on:

| Basis | Fits | Engineering consequence |
|---|---|---|
| Contract performance (art. 7 V) | Data needed to deliver what the user asked for | Collect only what the contract needs |
| Legal or regulatory obligation (art. 7 II) | Tax invoices, KYC | Retention is set by that law, not by product |
| Legitimate interest (art. 7 IX) | Fraud prevention, product security | Document the balancing test; keep a processing record (art. 37) |
| Consent (art. 7 I) | Marketing, optional analytics, non-essential cookies | Specific, informed, revocable as easily as given; store who, when, what text, which version |

Never bundle consent into terms of service, and never make a service depend on consent it does not need.

## Engineering controls

- **Minimize:** drop fields nobody reads; truncate IPs and coarsen location where the purpose allows.
- **Pseudonymize** internal joins with a surrogate ID; keep the mapping in one access-controlled table.
- **Anonymize** only when re-identification is not reasonably possible; hashing an email or CPF is pseudonymization, not anonymization.
- **Encrypt** in transit and at rest; field-level encryption for sensitive data and national IDs.
- **Access:** least privilege and audit logs for every read of sensitive data (`iam-least-privilege.md`).
- **Logs:** redact personal data at the logger, not at the viewer.
- **Retention:** every table and bucket gets a TTL or a scheduled purge job tied to its purpose; LGPD art. 16 requires deletion when processing ends, except listed exceptions such as legal obligations.
- **Backups:** deletions must also expire from backups within the backup retention window; document that window.
- **Third parties:** every processor (analytics, email, LLM API, error tracker) needs a contract and a record of what it receives; international transfers need a valid mechanism (LGPD art. 33, GDPR chapter V).

## Data subject requests

LGPD art. 18 rights: confirmation, access, correction, anonymization/blocking/deletion of unnecessary data, portability, deletion of consent-based data, information on sharing, information on refusing consent, revocation of consent.

- Build one pipeline that finds a person across every store in the data map, including derived copies.
- Verify identity before disclosing or deleting anything.
- Deadlines: LGPD art. 19 II gives 15 days from the request for a complete access declaration (a simplified answer is immediate). GDPR art. 12(3) gives one month, extendable by two more months for complex requests.
- Deletion is idempotent and logged by request ID, without logging the deleted data itself.

## Breach notification deadlines

| Regime | Notify the authority | Notify the people affected |
|---|---|---|
| LGPD art. 48, deadlines set by Resolução CD/ANPD nº 15/2024 | ANPD within 3 business days of learning the incident affected personal data and may cause relevant risk or harm | Same 3 business days, in clear language |
| GDPR (art. 33 and 34) | Supervisory authority within 72 hours of becoming aware, unless unlikely to result in risk | Without undue delay when the risk is high |

- Small processing agents under the ANPD small-agent regulation get doubled deadlines.
- Keep a record of every incident, notified or not, for at least five years (Resolução 15/2024, art. 10).
- Run the incident itself through `observability`; this file covers only the notification duty.

## Evidence to keep

- The data map and each processing record (LGPD art. 37).
- A data protection impact report (*relatório de impacto*, LGPD art. 38) for high-risk processing such as large-scale sensitive data or new profiling.
- Consent records, versioned policy text, retention jobs and their last successful run, DSR logs, and the incident register.

## Sources

- Lei nº 13.709/2018 (LGPD), official consolidated text: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- Resolução CD/ANPD nº 15/2024 (incident communication), Diário Oficial da União: https://www.in.gov.br/en/web/dou/-/resolucao-cd/anpd-n-15-de-24-de-abril-de-2024-556243024
- GDPR (Regulation (EU) 2016/679), articles 9, 12, 33, 34 and chapter V.
