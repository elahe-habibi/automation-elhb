import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class TagDocument {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش سند
   */
  async editDocument(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const editButton = this.page.locator('button[role="menuitem"]').nth(0);
    await expect(editButton).toBeVisible();
    await editButton.click();

    const tagButton = this.page.locator('button.document-edit-tags');
    if (await tagButton.isVisible()) {
      await tagButton.click();
    }

    for (let i = 0; i < 3; i++) {
      // کلیک روی فیلد جستجو
      await this.page.locator('input[placeholder="جست و جو کنید ..."]').click();

      // منتظر ظاهر شدن لیست محدودشده
      const options = this.page.locator(
        '.dialog-body ul li p.select_option__text',
      );
      await options.first().waitFor();

      // انتخاب آیتم i‌ام
      const item = options.nth(i);
      if (await item.isVisible()) {
        await item.click();
      }

      // صبر کوتاه برای بسته شدن dropdown
      await this.page.waitForTimeout(300);
    }

    const cancelBtn = this.page.locator('button.cancel-button');
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
    }
  }
}
