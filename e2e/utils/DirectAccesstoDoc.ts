import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class DirectAccessDocument {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش سند
   */
  async directaccess() {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const directAccessButton = this.page
      .locator('.document-direct-access')
      .nth(0);
    await expect(directAccessButton).toBeVisible();
    await directAccessButton.click();

    const usernameInput = this.page.locator('.direct-access-form__username');
    // بررسی اینکه فیلد قابل مشاهده است
    await expect(usernameInput).toBeVisible();
    // پر کردن فیلد با مقدار دلخواه
    await usernameInput.fill('hbrs');

    const addButton = this.page.locator('.direct-access-form__add');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(addButton).toBeVisible();

    // کلیک روی دکمه "افزودن"
    await addButton.click();

    await this.page.waitForTimeout(10000);
  }
}
