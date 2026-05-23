# Gitleaks Quality Criteria and Validation

Standards for ensuring a clean, leak-free repository.

## 1. Quality Criteria Table

| RuleID | False Positive? | Default Action |
|--------|-----------------|----------------|
| `google-api-key` | Rarely | Remove + Revoke |
| `private-key` | Never | Remove + Revoke |
| `aws-token` | Never | Remove + Revoke |
| `jwt` | Sometimes | Verify Context |
| `*-key` in README | Usually | .gitleaksignore |

## 2. Final Validation
Re-run Gitleaks locally to confirm zero findings:
`gitleaks detect --source . -v --redact`

## 3. Golden Rule
**Revoke before ignoring.** If a leak reached a public branch, revoke it at the provider first.
