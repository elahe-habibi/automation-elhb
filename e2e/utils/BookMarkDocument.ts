import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class BookMarkDocument {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش دسته‌بندی
   */
  async bookmarkDocument(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const bookmarkButton = this.page.locator('.document-bookmark').nth(0);
    await expect(bookmarkButton).toBeVisible();
    await bookmarkButton.click();

    const confirmButton = this.page.locator('.dialog-footer__submit-button');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(confirmButton).toBeVisible();
    // کلیک روی دکمه "تایید"
    await confirmButton.click();
  }
}
