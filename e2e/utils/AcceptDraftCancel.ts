import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class AcceptDraft {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش سند
   */
  async acceptDraft(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const versionListButton = this.page.locator('.document-version-list');
    await expect(versionListButton).toBeVisible();
    await versionListButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const versionMenuButton = this.page.locator('button.version-menu').nth(0);
    await versionMenuButton.waitFor({ state: 'visible' });
    await versionMenuButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const buttons = await this.page.locator('button.confirm-version').all();
    for (const btn of buttons) {
      const text = await btn.innerText();
      if (text.includes('تایید پیش نویس')) {
        await btn.click();
        break;
      }
    }

    const cancelButtons = await this.page.locator('button.cancel-button').all();
    for (const btn of cancelButtons) {
      const text = await btn.innerText();
      if (text.includes('انصراف')) {
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
        break;
      }
    }
    await this.page.waitForTimeout(3000); // تاخیر ۲ ثانیه‌ای

  }
}
