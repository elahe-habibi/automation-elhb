import { expect, Page } from '@playwright/test';
import { WaitUtils } from '../core/waitutils';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class DocumentCategory {
  private page: Page;
  private waitUtils: WaitUtils;

  constructor(page: Page) {
    this.page = page;
    this.waitUtils = new WaitUtils(page);
  }

  /**
   * ویرایش دسته‌بندی
   */
  async documentCategory(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    const menuButton = this.page.locator('.category-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await this.page.waitForTimeout(2000);

    const createButton = this.page.locator('button[role="menuitem"]').nth(0);
    await expect(createButton).toBeVisible();
    await createButton.click();

    const createDocumentButton = this.page.locator('.create-document');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(createDocumentButton).toBeVisible();
    // کلیک روی دکمه "ساخت سند"
    await createDocumentButton.click();
    const dropdownButton = this.page.locator('.document-type__select');
    await expect(dropdownButton).toBeVisible();
    await dropdownButton.click();

    // اسکرول در لیست انتخاب
    const dropdownList = this.page.locator('.shadow-menu');
    await expect(dropdownList).toBeVisible();
    await dropdownList.evaluate(el => el.scrollIntoView());

    // انتخاب گزینه "clasor"
    const clasorOption = this.page.locator('.select_option__text', {
      hasText: 'clasor',
    });
    await expect(clasorOption).toBeVisible();
    await clasorOption.click();

    const continueButton = this.page.locator('.dialog-footer__submit-button');
    await expect(continueButton).toBeVisible();
    await continueButton.click();

    // مقدار یونیک برای نام سند
    const uniqueDocumentName = `سند-تست-${Date.now()}`;

    // پر کردن فیلد "نام سند"
    const nameField = this.page.locator('.document-info-form__name');
    await expect(nameField).toBeVisible();
    await nameField.fill(uniqueDocumentName);

    // پر کردن فیلد "اولویت سند"
    const orderField = this.page.locator('.document-info-form__order');
    await expect(orderField).toBeVisible();
    await orderField.fill('1');

    // پر کردن فیلد "توضیحات سند"
    const descriptionField = this.page.locator(
      '.document-info-form__description',
    );
    await expect(descriptionField).toBeVisible();
    await descriptionField.fill(
      'این یک سند تستی برای بررسی عملکرد Playwright است.',
    );

    // ارسال فرم
    const confirmButton = this.page.locator('.dialog-footer__submit-button');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    const finalSaveButton = this.page.locator('.dialog-footer__submit-button');
    await expect(finalSaveButton).toBeVisible();
    await finalSaveButton.click();

    const lastContinueButton = this.page.locator(
      '.dialog-footer__submit-button',
    );
    await expect(lastContinueButton).toBeVisible();
    await lastContinueButton.click();

    // پر کردن اطلاعات نسخه
    const versionField = this.page.locator('.document-version-form__name');
    await expect(versionField).toBeVisible();

    const uniqueVersionName = `نسخه-${Date.now()}`;
    await versionField.fill(uniqueVersionName);

    const createButtonfinal = this.page.locator(
      '.dialog-footer__submit-button',
    );
    await expect(createButtonfinal).toBeVisible();
    await createButtonfinal.click();

    // انتظار برای تکمیل عملیات
    await this.waitUtils.waitForPageLoad();

    const firstCategoryRow = this.page.locator('.category-table-row').first();
    // بررسی اینکه رکورد قابل مشاهده است
    await expect(firstCategoryRow).toBeVisible();

    await firstCategoryRow.click({ force: true });

    // کلیک روی اولین رکورد
    await firstCategoryRow.click();
  }

  /**
   * بررسی نمایش فرم دسته‌بندی
   * @returns آیا فرم دسته‌بندی نمایش داده می‌شود
   */
  async isDocumentFormVisible(): Promise<boolean> {
    const documentForm = this.page.locator('form').filter({ hasText: 'سند' });
    return await documentForm.isVisible();
  }

  /**
   * انتظار برای نمایش پیام موفقیت‌آمیز
   */
  // async waitForSuccessToast(): Promise<void> {
  //   const toastMessage = this.page.locator('.Toastify__toast-body');
  //   await expect(toastMessage).toBeVisible({ timeout: 10000 });
  //   await expect(toastMessage).toContainText('نسخه مورد نظر با موفقیت ایجاد گردید.', { timeout: 5000 });
  // }
}
