import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../constants';

/**
 * کلاس مدیریت دسته‌بندی‌ها در سیستم
 * این کلاس شامل توابع مورد نیاز برای مدیریت دسته‌بندی‌هاست
 */
export class DocumentManager {
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
    await this.page.waitForTimeout(2000);

    const newDocumentButton = this.page.locator('.create-document');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(newDocumentButton).toBeVisible();
    // کلیک روی دکمه "سند جدید"
    await newDocumentButton.click();
    await this.page.waitForTimeout(2000);

    const dropdownButton = this.page.locator('.document-type__select');

    // بررسی اینکه دراپ‌داون قابل مشاهده است
    await expect(dropdownButton).toBeVisible();

    // کلیک روی دراپ‌داون
    await dropdownButton.click();
    await this.page.waitForTimeout(2000);

    // اسکرول در لیست انتخاب
    const dropdownList = this.page.locator('.shadow-menu');
    await dropdownList.evaluate(el => el.scrollIntoView());
    await this.page.waitForTimeout(2000);

    // انتخاب گزینه "clasor"
    const clasorOption = this.page.locator('.select_option__text', {
      hasText: 'clasor',
    });
    await expect(clasorOption).toBeVisible();
    await clasorOption.click();
    await this.page.waitForTimeout(2000);

    const continueButton = this.page.locator('.dialog-footer__submit-button');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(continueButton).toBeVisible();

    // کلیک روی دکمه "ادامه"
    await continueButton.click();
    await this.page.waitForTimeout(2000);

    // مقدار یونیک برای نام سند
    const uniqueDocumentName = `سند-تست-${Date.now()}`;

    // پر کردن فیلد "نام سند"
    await this.page.fill('.document-info-form__name', uniqueDocumentName);
    await this.page.waitForTimeout(1000);

    // پر کردن فیلد "اولویت سند"
    await this.page.fill('.document-info-form__order', '1');
    await this.page.waitForTimeout(1000);

    // پر کردن فیلد "توضیحات سند"
    await this.page.fill(
      '.document-info-form__description',
      'این یک سند تستی برای بررسی عملکرد Playwright است.'
    );
    await this.page.waitForTimeout(1000);

    // ارسال فرم (اگر دکمه تأیید وجود دارد، آن را کلیک کن)
    const confirmButton = this.page.locator('.dialog-footer__submit-button');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    await this.page.waitForTimeout(2000);

    const finalSaveButton = this.page.locator('.dialog-footer__submit-button');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(finalSaveButton).toBeVisible();
    // کلیک روی دکمه "ادامه"
    await finalSaveButton.click();
    await this.page.waitForTimeout(2000);

    const lastContinueButton = this.page.locator(
      '.dialog-footer__submit-button'
    );

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(lastContinueButton).toBeVisible();

    // کلیک روی دکمه "ادامه"
    await lastContinueButton.click();
    await this.page.waitForTimeout(2000);

    const versionField = this.page.locator('.document-version-form__name');

    // بررسی اینکه فیلد ورژن قابل مشاهده است
    await expect(versionField).toBeVisible();

    // مقدار یونیک برای نسخه
    const uniqueVersionName = `نسخه-${Date.now()}`;

    // پر کردن فیلد "نام نسخه"
    await versionField.fill(uniqueVersionName);
    await this.page.waitForTimeout(1000);

    const createButtonfinal = this.page.locator(
      '.dialog-footer__submit-button'
    );

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(createButtonfinal).toBeVisible();

    // کلیک روی دکمه "ایجاد"
    await createButtonfinal.click();

    // انتظار برای اطمینان از تکمیل عملیات ایجاد سند
    await this.page.waitForTimeout(5000);
  }

  /**
   * بررسی نمایش فرم دسته‌بندی
   * @returns آیا فرم دسته‌بندی نمایش داده می‌شود
   */
  async isDocumentFormVisible() {
    const documentForm = this.page.locator('form').filter({ hasText: 'سند' });
    return await documentForm.isVisible();
  }
}
