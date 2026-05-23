# MCP Server Validation and Evaluation

Guidelines for testing and creating effectiveness benchmarks.

## 1. Review and Local Testing
- **Lint:** Run `npm run build` or `py_compile`.
- **Inspector:** Test manually with `npx @modelcontextprotocol/inspector`.
- **Audit:** Ensure no code duplication and full type coverage.

## 2. Creating Evaluations
Build a suite of 10 complex, realistic questions in XML format:
- **Criteria:** Independent, read-only, verifiable, and stable answers.
- **Focus:** Multi-tool exploration rather than single-call checks.

## 3. Evaluation Format
```xml
<evaluation>
  <qa_pair>
    <question>COMPLEX_SCENARIO_QUESTION</question>
    <answer>VERIFIABLE_ANSWER</answer>
  </qa_pair>
</evaluation>
```

## References
- [✅ Detailed Evaluation Guide](../reference/evaluation.md)
