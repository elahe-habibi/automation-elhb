import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class PubliclastversionDocument {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش سند
   */
  async Publiclastversion(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const publicVersionButton = this.page
      .locator('.document-public-version')
      .nth(0);
    await expect(publicVersionButton).toBeVisible();
    await publicVersionButton.click();

    const cancelButton = this.page.locator('button.cancel-button');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    await this.page.waitForTimeout(5000);
  }
}
