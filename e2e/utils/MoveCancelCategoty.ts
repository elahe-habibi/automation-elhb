import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class MoveCategory {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش دسته‌بندی
   */
  async moveCategory(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    const menuButton = this.page.locator('.category-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await this.page.waitForTimeout(2000);

    const moveCategoryButton = this.page.locator('.move-category');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(moveCategoryButton).toBeVisible();
    // کلیک روی دکمه "انتقال"
    await moveCategoryButton.click();

    // کلیک روی دکمه "انتخاب کنید" برای باز کردن لیست
    const selectButton = this.page.locator('.move-category__select');
    await expect(selectButton).toBeVisible();
    await selectButton.click();

    // انتخاب دومین گزینه از لیست
    const secondOption = this.page.locator('.move-category-item').nth(0);
    await expect(secondOption).toBeVisible();
    await secondOption.click();

    const cancelButton = this.page.locator('button.cancel-button');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    
    await this.page.waitForTimeout(2000);
  }
}
