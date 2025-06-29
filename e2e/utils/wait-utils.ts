import { Page, Locator } from '@playwright/test';

export class WaitUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElementStable(element: Locator): Promise<void> {
    await element.waitFor({ state: 'visible', timeout: 10000 });
  }

  async stableClick(element: Locator): Promise<void> {
    try {
      await element.waitFor({ state: 'visible', timeout: 10000 });
      await element.click({ timeout: 5000 });
    } catch (error) {
      console.error('Click failed, retrying...', error);
      await this.page.waitForTimeout(1000);
      await element.click({ timeout: 5000 });
    }
  }
}
