import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class MoveDocument {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش دسته‌بندی
   */
  async moveDoc(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');

    await this.page.waitForTimeout(8000);

    await this.page.reload();

    await this.page.waitForTimeout(8000);

    await this.page
      .locator('.document-menu')
      .filter({ has: this.page.locator('svg') })
      .first()
      .click();

    await this.page.locator('.document-move').click();

    const moveBtn = this.page.locator('.document-move');
    if (await moveBtn.isVisible()) {
      await moveBtn.click();
    }

    await this.page.locator('.move-document__select').click();

    await this.page.locator('.move-category-item').first().click();

    await this.page.waitForTimeout(2000);

    await this.page.locator('.dialog-footer__submit-button').click();
  }
}
