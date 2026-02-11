# QA Automation Engineer Reference

## Core Frameworks

### 1. Playwright
**Description:** Reliable end-to-end testing for modern web apps.
**Key Features:**
- **Auto-waiting:** Automatically waits for elements to be ready.
- **Trace Viewer:** Detailed records of test execution.
- **Codegen:** Generate tests by recording actions.
**Common Commands:**
- `npx playwright test`: Run all tests.
- `npx playwright show-report`: View HTML report.
- `npx playwright codegen http://example.com`: Start recorder.

### 2. Cypress
**Description:** Fast, easy, and reliable testing for anything that runs in a browser.
**Key Features:**
- **Time Travel:** See snapshots of what happened at each step.
- **Real-time Reloads:** Automatically reloads when you change tests.
**Common Commands:**
- `npx cypress open`: Open Test Runner.
- `npx cypress run`: Run all tests headlessly.

### 3. Selenium WebDriver
**Description:** The industry standard for browser automation.
**Key Features:**
- **Language Support:** Java, Python, C#, Ruby, JavaScript.
- **Grid:** Run tests across multiple machines and browsers.
**Common Patterns:**
- **WebDriverWait:** `WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "submit")))`

## Common Locator Patterns
- **Best:** `[data-testid="login-button"]`, `role="button"`, `aria-label="Submit Form"`
- **Good:** `name="email"`, `id="username"` (if static)
- **Avoid:** Brittle CSS selectors like `div > ul > li:nth-child(3)` or dynamic IDs.

## Page Object Model (POM) Example (Pseudo-code)
```javascript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-testid="username"]');
    this.passwordInput = page.locator('[data-testid="password"]');
    this.loginButton = page.locator('[data-testid="login-btn"]');
  }

  async login(user, pass) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}
```
