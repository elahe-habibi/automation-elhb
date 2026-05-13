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

    await this.page.locator('input.document-white-list__name-input').click();

    const usernameInput = this.page.locator(
      'input.document-white-list__name-input',
    );
    if (await usernameInput.isVisible()) {
      await usernameInput.click();
      await usernameInput.fill('hbrs');
    }

    await this.page
      .locator('input.document-white-list__name-input')
      .press('Enter');

    await this.page.locator('button.dialog-footer__submit-button').click();

    await this.page.waitForTimeout(8000);
  }

  /**
   * ویرایش سند
   */
  async LimitAccessDocumenterrorpodid(): Promise<void> {
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

    await this.page.locator('input.document-white-list__name-input').click();

    const usernameInput = this.page.locator(
      'input.document-white-list__name-input',
    );
    if (await usernameInput.isVisible()) {
      await usernameInput.click();
      await usernameInput.fill('elhb699');
    }

    await this.page
      .locator('input.document-white-list__name-input')
      .press('Enter');

    await this.page.locator('button.dialog-footer__submit-button').click();

    const toast = this.page.locator('.Toastify__toast-body').last();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('نام کاربری پیدا نشد');

    await this.page.waitForTimeout(8000);
  }

 /**
   * ویرایش سند
   */
 async LimitAccessDocumentDelete(): Promise<void> {
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

  await this.page.locator('input.document-white-list__name-input').click();

  const usernameInput = this.page.locator(
    'input.document-white-list__name-input',
  );
  if (await usernameInput.isVisible()) {
    await usernameInput.click();
    await usernameInput.fill('hbrs');
  }

  await this.page
    .locator('input.document-white-list__name-input')
    .press('Enter');

  await this.page.locator('button.dialog-footer__submit-button').click();

  await this.page.waitForTimeout(8000);

  const deleteBtn = this.page.locator('button.delete-button');
  await deleteBtn.waitFor({ state: 'visible' });
  await deleteBtn.click();

  await this.page.waitForTimeout(5000);

  await this.page.locator('button.dialog-footer__submit-button').click();

  await this.page.waitForTimeout(5000);

}

}
