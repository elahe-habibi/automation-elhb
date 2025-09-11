import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class PasswordDocument {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  /**
   * ویرایش سند
   */
  async PasswordDocument(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const restrictionButton = this.page.locator(
      'button[role="menuitem"]:has-text("محدودیت در انتشار")',
    );
    await expect(restrictionButton).toBeVisible();
    await restrictionButton.click();

    const passwordBtn = this.page.locator('.document-create-password');
    if (await passwordBtn.isVisible()) {
      await passwordBtn.click();
    }

    const passwordInput = this.page.locator(
      'input.create-password-form__password',
    );
    const confirmInput = this.page.locator(
      'input.create-password-form__confirm-password',
    );

    if ((await passwordInput.isVisible()) && (await confirmInput.isVisible())) {
      await passwordInput.fill('۱۲۳۴۵۶۷۸');
      await confirmInput.fill('۱۲۳۴۵۶۷۸');
    }

    await this.page.locator('button.dialog-footer__submit-button').click();

    await this.page.waitForTimeout(10000);
  }
}
