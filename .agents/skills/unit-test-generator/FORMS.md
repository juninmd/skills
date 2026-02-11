# Unit Test Generator Forms

## 1. Test Plan Form (test_plan.md)

### Goal
Outline the testing strategy for a specific component.

### Fields
- **Target File/Function:** [Path to file or function name]
- **Framework:** [e.g., pytest, unittest, jest]
- **Test Scenarios:**
    1. **Happy Path:** [Description of standard case]
    2. **Edge Case 1:** [Description of edge case]
    3. **Error Case 1:** [Description of error scenario]
- **Mocking Requirements:** [List of dependencies to mock]

## 2. Test Execution Report Form (test_report.md)

### Goal
Document the results of the generated tests.

### Fields
- **Target:** [Component being tested]
- **Summary:**
    - **Total Tests:** [Number]
    - **Passed:** [Number]
    - **Failed:** [Number]
- **Test Details:**
    - [Test Name 1]: [Status] (Reason for failure if applicable)
    - [Test Name 2]: [Status]
- **Coverage Summary:** [e.g., 85% line coverage]
- **Recommendations:** [Suggestions for further testing or code improvements]
