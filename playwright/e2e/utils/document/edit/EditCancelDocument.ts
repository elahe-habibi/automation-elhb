import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class EditDocument {
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
    await this.page.waitForTimeout(2000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const editButton = this.page.locator('button[role="menuitem"]').nth(0);
    await expect(editButton).toBeVisible();
    await editButton.click();

    const editDocumentButton = this.page.locator('.document-edit').nth(0);
    await expect(editDocumentButton).toBeVisible();
    await editDocumentButton.click();

    // فیلد نام سند
    const titleInput = this.page.locator('.document-edit__form-name');
    await expect(titleInput).toBeVisible();
    await titleInput.fill('نام جدید سند');

    // فیلد اولویت سند
    const orderInput = this.page.locator('.document-edit__form-order');
    await expect(orderInput).toBeVisible();
    await orderInput.fill('5'); // مقدار را بر اساس نیاز تغییر بده

    // فیلد توضیحات سند
    const descriptionInput = this.page.locator(
      '.document-edit__form-description',
    );
    await expect(descriptionInput).toBeVisible();
    await descriptionInput.fill('این سند مربوط به پروژه جدید است.');

    const cancelButton = this.page.locator('button.cancel-button');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
  }
}
