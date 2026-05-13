import { Page, Locator } from '@playwright/test';

export class WaitUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageLoad(): Promise<void> {
    await Promise.race([
      this.page.waitForLoadState('load'), // حالت پایدارتر
      this.page.waitForTimeout(5000), // یا هر مقداری که مطمئنی کافی باشه
    ]);
  }

  async waitForElementStable(element: Locator): Promise<void> {
    await element.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForLoadState('load'); // یا
    await this.page.waitForLoadState('domcontentloaded');
  }

  async stableClick(element: Locator): Promise<void> {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        await element.waitFor({ state: 'visible', timeout: 15000 });
        await element.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500); // Wait for any animations
        await element.click({ timeout: 10000 });
        return; // Success, exit the function
      } catch (error) {
        attempts++;
        console.error(`Click failed (attempt ${attempts}/${maxAttempts}), retrying...`, error);
        
        if (attempts >= maxAttempts) {
          // Last attempt: try force click
          try {
            await element.waitFor({ state: 'visible', timeout: 15000 });
            await element.scrollIntoViewIfNeeded();
            await element.click({ force: true, timeout: 10000 });
            return;
          } catch (forceError) {
            throw new Error(
              `Failed to click element after ${maxAttempts} attempts: ${forceError}`,
            );
          }
        }
        
        await this.page.waitForTimeout(1500);
        // Wait for page to stabilize
        await this.page.waitForLoadState('networkidle').catch(() => {});
      }
    }
  }
}
