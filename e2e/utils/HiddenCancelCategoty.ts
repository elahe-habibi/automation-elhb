import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class HiddenCategory {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش دسته‌بندی
   */
  async hiddenCategory(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    const menuButton = this.page.locator('.category-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await this.page.waitForTimeout(2000);

    const hideCategoryButton = this.page.locator('.visible-category');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(hideCategoryButton).toBeVisible();
    // کلیک روی دکمه "مخفی سازی"
    await hideCategoryButton.click();

    const cancelButton = this.page.locator('button.cancel-button');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    await this.page.waitForTimeout(2000);
  }
}
