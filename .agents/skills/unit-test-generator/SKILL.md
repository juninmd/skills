# Unit Test Generator Skill

## Description
This skill enables the agent to automatically generate unit tests for existing code implementations. It focuses on identifying test cases, covering edge cases, and ensuring that the generated tests are idiomatic and follow the project's testing framework conventions.

## Workflow

### 1. Analyze Implementation
- Read the source code of the file or function that needs testing.
- Identify the public API, input parameters, return values, and potential exceptions.
- Understand the logic flow and any external dependencies.

### 2. Identify Test Cases
- Define happy path scenarios (standard inputs).
- Identify edge cases (empty inputs, null values, maximum/minimum values).
- Determine error cases (invalid inputs, expected exceptions).

### 3. Determine Testing Framework
- Detect the project's testing framework (e.g., pytest, unittest, jest, mocha).
- Look for existing tests to match their style, structure, and naming conventions.

### 4. Generate Test Code
- Create a new test file or add to an existing one.
- Implement the identified test cases using the project's testing framework.
- Mock external dependencies if necessary.

### 5. Verify & Refine
- Run the generated tests to ensure they pass and provide adequate coverage.
- Adjust the tests if they fail or if certain logic paths are not covered.

## Best Practices
- **Isolation:** Ensure tests are isolated and don't depend on each other.
- **Readability:** Write clear and descriptive test names.
- **Coverage:** Aim for high code coverage, but prioritize testing critical logic and edge cases.
- **Idiomatic Code:** Use the features and patterns of the selected testing framework.
