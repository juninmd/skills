---
type: llm
focus: last_message
weight: 1
---
The response must:
- Identify that removing the parameterized query in favor of string interpolation introduces a SQL injection vulnerability.
- Treat it as a credible security issue that needs a dedicated security review (per this skill's own stop condition), not as a routine style note buried among other comments.
- Flag it for the security-ops flow rather than trying to fully resolve the security question itself.
