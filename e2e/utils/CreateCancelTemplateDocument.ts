import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../constants';
import { WaitUtils } from './waitutils';

/**
 * کلاس مدیریت دسته‌بندی‌ها در سیستم
 * این کلاس شامل توابع مورد نیاز برای مدیریت دسته‌بندی‌هاست
 */
export class DocumentTemplateManager {
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
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * انتخاب اولین مخزن در لیست
   */
  async selectFirstRepository(): Promise<void> {
    const firstRepo = this.page.locator('.repo-card').first();
    await firstRepo.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * کلیک روی دکمه ایجاد و ایجاد سند نمونه
   */
  async clickCreateButton(): Promise<void> {
    await this.waitUtils.waitForPageLoad();

    const createButton = this.page.getByRole('button', { name: 'ایجاد' });
    await this.waitUtils.stableClick(createButton);

    const templateButton = this.page.locator('.create-template');
    await this.waitUtils.stableClick(templateButton);

    // انتخاب گزینه "clasor" از لیست
    const dropdownButton = this.page.locator('.document-type__select');
    await expect(dropdownButton).toBeVisible();
    await dropdownButton.click();

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
    await this.page.waitForTimeout(2000); // منتظر بمونه ۲ ثانیه
    // پر کردن فیلد "اولویت سند"
    const orderField = this.page.locator('.document-info-form__order');
    await expect(orderField).toBeVisible();
    await orderField.fill('1');

    // پر کردن فیلد "توضیحات سند"
    const descriptionField = this.page.locator(
      '.document-info-form__description'
    );
    await expect(descriptionField).toBeVisible();
    await descriptionField.fill(
      'این یک سند تستی برای بررسی عملکرد Playwright است.'
    );

    const finalContinueButton = this.page.locator(
      '.dialog-footer__submit-button'
    );
    await expect(finalContinueButton).toBeVisible();
    await finalContinueButton.click();

    // پر کردن اطلاعات نسخه
    const versionField = this.page.locator('.document-version-form__name');
    await expect(versionField).toBeVisible();

    const uniqueVersionNumber = `نسخه-${Date.now()}`;
    await versionField.fill(uniqueVersionNumber);

    const prevStepButton = this.page.locator('button.cancel-button', { hasText: 'مرحله‌ قبلی' });
    await expect(prevStepButton).toBeVisible();
    await prevStepButton.click();

    await this.page.waitForTimeout(2000); // منتظر بمونه ۲ ثانیه


    const prevButton = this.page.locator('button.cancel-button');
    await expect(prevButton).toBeVisible();
    await prevButton.click();

    await this.page.waitForTimeout(2000); // منتظر بمونه ۲ ثانیه


    const cancelButton = this.page.locator('button.cancel-button');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
  }
}
