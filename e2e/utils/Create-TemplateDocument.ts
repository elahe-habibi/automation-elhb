import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../constants';

/**
 * کلاس مدیریت دسته‌بندی‌ها در سیستم
 * این کلاس شامل توابع مورد نیاز برای مدیریت دسته‌بندی‌هاست
 */
export class DocumentTemplateManager {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * رفتن به صفحه داشبورد
   */
  async goToDashboard() {
    await this.page.goto(getFullUrl(URLs.DASHBOARD));
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * انتخاب اولین مخزن در لیست
   */
  async selectFirstRepository() {
    const firstRepo = this.page.locator('.repo-card').first();
    await firstRepo.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * کلیک روی دکمه ایجاد
   */
  async clickCreateButton() {
    const createButton = this.page.getByRole('button', { name: 'ایجاد' });
    await createButton.click();

    const templateButton = this.page.locator('.create-template');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(templateButton).toBeVisible();

    // کلیک روی دکمه "نمونه سند"
    await templateButton.click();

    // انتخاب گزینه "clasor" از لیست
    const dropdownButton = this.page.locator('.document-type__select');
    await dropdownButton.click(); // باز کردن لیست

    await this.page.waitForTimeout(500); // یک وقفه کوتاه برای بارگذاری لیست

    const clasorOption = this.page.locator('.select_option__text', { hasText: 'clasor' });
    await expect(clasorOption).toBeVisible();
    await clasorOption.click();

    const continueButton = this.page.locator('.dialog-footer__submit-button');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(continueButton).toBeVisible();

    // کلیک روی دکمه "ادامه"
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
    const descriptionField = this.page.locator('.document-info-form__description');
    await expect(descriptionField).toBeVisible();
    await descriptionField.fill('این یک سند تستی برای بررسی عملکرد Playwright است.');

    const finalContinueButton = this.page.locator('.dialog-footer__submit-button');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(finalContinueButton).toBeVisible();

    // کلیک روی دکمه "ادامه"
    await finalContinueButton.click();

    const versionField = this.page.locator('.document-version-form__name');

    // بررسی اینکه فیلد قابل مشاهده است
    await expect(versionField).toBeVisible();

    // مقدار یونیک برای شماره نسخه
    const uniqueVersionNumber = `نسخه-${Date.now()}`;

    // پر کردن فیلد "نام نسخه"
    await versionField.fill(uniqueVersionNumber);

    const finalCreateButton = this.page.locator('.dialog-footer__submit-button');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(finalCreateButton).toBeVisible();

    // کلیک روی دکمه "ایجاد"
    await finalCreateButton.click();
  }

  /**
   * انتظار برای نمایش پیام موفقیت‌آمیز
   */
  async waitForSuccessToast() {
    const toastMessage = this.page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 10000 });
    await expect(toastMessage).toContainText('موفقیت', { timeout: 5000 });
  }
}
