# Code Auditor Skill

## Description
This skill enables the agent to perform comprehensive static analysis on source code to identify potential security vulnerabilities, code quality issues, and adherence to best practices. It leverages various tools and techniques to ensure code robustness and maintainability.

## Workflow

### 1. Plan & Scope
- **Identify Target:** Determine the directory or specific files to audit.
- **Understand Context:** Recognize the programming language(s) and framework(s) used.
- **Select Tools:** Choose appropriate static analysis tools (e.g., `pylint`, `eslint`, `bandit`, `grep`) based on the context.

### 2. Configure & Prepare
- **Check Configuration:** Look for existing configuration files (e.g., `.pylintrc`, `.eslintrc`) to respect project standards.
- **Install Dependencies:** If necessary and permitted, install required linters or security scanners in a virtual environment.

### 3. Execute Analysis
- **Run Tools:** Execute the selected tools on the target code.
- **Search Patterns:** Use `grep` or `ripgrep` to search for known bad patterns (e.g., hardcoded secrets, `eval()`, SQL injection risks).
- **Capture Output:** Save the output of the tools for analysis.

### 4. Analyze & Verify
- **Review Findings:** Examine the tool output, filtering out false positives based on code context.
- **Prioritize:** Focus on critical security vulnerabilities and major bugs first.
- **Verify:** Manually verify high-severity issues to confirm they are genuine risks.

### 5. Report & Recommend
- **Document Issues:** Create a report detailing the findings, including file paths, line numbers, and issue descriptions.
- **Suggest Fixes:** Provide actionable recommendations or code snippets to resolve the identified issues.
- **Rate Severity:** Classify issues by severity (Critical, High, Medium, Low) to guide prioritization.

## Best Practices
- **Context Awareness:** Always consider the specific context of the code to avoid flagging legitimate uses as errors.
- **Incremental Audits:** For large codebases, audit one module or directory at a time.
- **Security First:** Prioritize security vulnerabilities (e.g., injection flaws, broken authentication) over style issues.
- **Actionable Feedback:** Ensure that every reported issue includes a clear explanation and a path to resolution.
