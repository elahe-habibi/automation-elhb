import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class LimitAccessDocument {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  /**
   * ویرایش سند
   */
  async LimitAccessDocument(): Promise<void> {
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

    await this.page.locator('button.document-limitation').click();

    await this.page.waitForTimeout(10000);

    const radioBtn = this.page.locator(
      'input[type="radio"][value="black-list"]',
    );
    if (await radioBtn.isVisible()) {
      await radioBtn.check();
    }

    const blacklistInput = this.page.locator(
      'input.document-black-list__name-input',
    );

    const radiooBtn = this.page.locator(
      'input[type="radio"][value="black-list"]',
    );
    if (await radiooBtn.isVisible()) {
      await radiooBtn.check();
    }

    await blacklistInput.click();
    await blacklistInput.fill('hbrs');

    await this.page
      .locator('input.document-black-list__name-input')
      .press('Enter');

    await this.page.locator('button.dialog-footer__submit-button').click();

    await this.page.waitForTimeout(10000);
  }
}
