# Quality Assurance Automation Engineer (E2E Testing) Skill

## Description
This skill enables the agent to design, implement, and maintain automated end-to-end (E2E) test suites. It focuses on validating entire user journeys across integrated systems using modern frameworks like Playwright, Cypress, and Selenium.

## Workflow

### 1. Test Planning & Design
- Identify high-impact user flows and business processes for automation.
- Define test objectives, prerequisites, and success criteria.
- Design modular test cases using the Page Object Model (POM) for better maintainability.

### 2. Environment & Data Setup
- Configure test environments that mirror production as closely as possible.
- Manage realistic test data, utilizing synthetic data generation where necessary.
- Ensure test independence by resetting state between test runs.

### 3. Implementation
- Write robust test scripts using stable locators (e.g., `data-testid`, `getByRole`).
- Implement "smart waits" and avoid brittle fixed delays.
- Integrate API-first testing to validate backend services and third-party integrations.

### 4. Execution & CI/CD Integration
- Trigger automated tests within CI/CD pipelines on code commits.
- Run tests in parallel to optimize execution time.
- Use headless mode for CI and headed mode for local debugging.

### 5. Analysis & Debugging
- Leverage traces, screenshots, and video recordings to diagnose failures.
- Integrate observability tools to gain deep insights into system behavior during tests.
- Report bugs with clear reproduction steps and relevant logs.

## Best Practices
- **Shift-Left Testing:** Start testing early in the development lifecycle.
- **Stable Locators:** Prioritize data attributes and accessibility roles over CSS classes.
- **Atomic Tests:** Ensure each test is independent and can run in any order.
- **Maintainability:** Use Page Object Model to separate test logic from UI selectors.
- **Observability:** Monitor logs, network traces, and backend performance during E2E runs.
