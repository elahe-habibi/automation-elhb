import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../../constants';
import { WaitUtils } from '../core/waitutils';

/**
 * کلاس مدیریت دسته‌بندی‌ها در سیستم
 * این کلاس شامل توابع مورد نیاز برای مدیریت دسته‌بندی‌هاست
 */
export class DocumentManager {
  private page: Page;
  private waitUtils: WaitUtils;

  constructor(page: Page) {
    this.page = page;
    this.waitUtils = new WaitUtils(page);
  }

  /**
   * رفتن به صفحه داشبورد
   */
  async goToDashboard(): Promise<void> {
    await this.page.goto(getFullUrl(URLs.DASHBOARD));
    await this.waitUtils.waitForPageLoad();
  }

  /**
   * انتخاب اولین مخزن در لیست
   */
  async selectFirstRepository(): Promise<void> {
    await this.page.waitForSelector('.repo-card', {
      state: 'visible',
      timeout: 15000,
    });

    await this.page.waitForTimeout(3000);

    const firstRepo = this.page.locator('.repo-card').first();
    await this.waitUtils.stableClick(firstRepo);
    await this.waitUtils.waitForPageLoad();
  }

  /**
   * کلیک روی دکمه ایجاد و ایجاد سند جدید
   */
  async clickCreateButton(): Promise<void> {
    // Wait for the document table to be ready
    await this.waitUtils.waitForPageLoad();

    // Wait for the create button with more specific selector
    const createButton = this.page
      .getByRole('button', { name: 'ایجاد' })
      .first();
    await this.waitUtils.stableClick(createButton);

    // Wait for the new document button
    const newDocumentButton = this.page.locator('.create-document');
    await this.waitUtils.stableClick(newDocumentButton);

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
  }

  /**
   * بررسی نمایش فرم دسته‌بندی
   * @returns آیا فرم دسته‌بندی نمایش داده می‌شود
   */
  async isDocumentFormVisible(): Promise<boolean> {
    const documentForm = this.page.locator('form').filter({ hasText: 'سند' });
    return await documentForm.isVisible();
  }
}
