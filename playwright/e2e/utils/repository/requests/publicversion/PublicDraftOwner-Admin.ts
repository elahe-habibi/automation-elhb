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

    // ✅ پیدا کردن دکمه با کلاس منحصربه‌فرد + تأیید متن فارسی
    const confirmPublicButton = this.page
      .locator(
        'button.confirmPublic-draft:has-text("تایید و عمومی‌سازی پیش‌نویس")',
      )
      .first();

    await confirmPublicButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmPublicButton.click({ delay: 100 });

    console.log('✅ دکمه "تایید و عمومی‌سازی پیش‌نویس" با موفقیت کلیک شد');

    const confirmBtn = this.page.locator(
      'button.dialog-footer__submit-button:has-text("تایید")',
    );
    await confirmBtn.scrollIntoViewIfNeeded();
    await confirmBtn.waitFor({ state: 'visible', timeout: 10000 });
    await confirmBtn.click();
    await this.page.waitForTimeout(3000); // تاخیر ۲ ثانیه‌ای

    const toastMessage = this.page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 3000 });
    await expect(toastMessage).toContainText('نسخه باموفقیت تایید و عمومی شد.', {
      timeout: 3000,
    });
  }
}
