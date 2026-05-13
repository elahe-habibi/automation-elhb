
# 🎭 Category Management Automation Suite
> Robust End-to-End Testing with Playwright & TypeScript

This repository features a professional-grade automation suite designed to validate the **Category Management lifecycle**. It utilizes modern QA practices, including the **Page Object Model (POM)** pattern, to ensure maintainability and scalability.

---

## 🚀 Key Features
- **Automated Workflow:** Full E2E coverage for creating and managing categories.
- **Page Object Model (POM):** Decoupled test logic from UI selectors for clean, reusable code.
- **Configurable Environments:** Optimized for different browser engines and viewports.
- **Detailed Reporting:** Built-in support for HTML reporting and failure screenshots.

## 🛠 Tech Stack
- **Framework:** [Playwright](https://playwright.dev/)
- **Language:** TypeScript
- **Design Pattern:** Page Object Model (POM)
- **Reporting:** Playwright HTML Reporter

## 📁 Project Architecture
- `Create-Category.ts`: **Page Object Class** containing methods and element locators for category management.
- `Create-Category.spec.ts`: **Test Specification** file containing the actual test scenarios and assertions.

## ⚙️ Installation & Setup
1. Clone the repository:
```bash
   git clone https://github.com/elahe-habibi/automation-elhb.git
   
Install dependencies:
bash
   npm install
   
Install Playwright browsers:
bash
   npx playwright install
   
🧪 Running Tests
Standard Execution (Headless)
Run the category creation suite:

bash
npx playwright test Create-Category.spec.ts
Debug Mode (Headed)
Watch the browser execution in real-time:

bash
npx playwright test Create-Category.spec.ts --headed
Targeted Testing
Run a specific test case (e.g., line 9):

bash
npx playwright test Create-Category.spec.ts:9 --headed
📊 Reporting
After running tests, you can generate and view the interactive HTML report to analyze results, execution time, and screenshots:

bash
npx playwright show-report
💡 Quality Standards
Wait Strategy: Configured with a 120s timeout for stability in slow environments.
Cross-Browser: Verified on Chromium (default) as per playwright.config.js.
Maintenance: New features can be easily integrated by extending the CategoryManager class.
👤 Author: Elahe Habibi

QA Automation Engineer | LinkedIn
