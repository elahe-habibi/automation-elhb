import { expect, Page } from '@playwright/test';
import { WaitUtils } from './waitutils';
import path from 'path';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class CreateFeeds {
  private page: Page;
  private waitUtils: WaitUtils;

  constructor(page: Page) {
    this.page = page;
    this.waitUtils = new WaitUtils(page);
  }

  /**
   * رفتن به صفحه داشبورد
   */
  async createfeeds(): Promise<void> {
    await this.page.goto('https://clasor-frontend.sandpod.ir/admin/dashboard');
    // await this.page.waitForLoadState('networkidle');
    await this.page.click('.feedback__button');

    await this.page.waitForTimeout(3000);

    const textarea = this.page.locator('.feedback__form-content-textarea');
    await textarea.fill('ای ول بابا دمت گررررم\nای ول بابا دمت گررررم');

    await this.page.waitForTimeout(3000);

    const filePath = path.resolve(__dirname, '../assets/picture.jpg');
    const imagePath = path.join(process.cwd(), 'e2e/assets/picture.jpg');
    await this.page.locator('#input-file').setInputFiles(imagePath);
    // آپلود فایل به input
    const fileInput = this.page.locator('#input-file');
    await fileInput.setInputFiles(filePath);
    // کلیک روی label برای تریگر رفتار رابط کاربری

    await this.page.waitForTimeout(3000);

    const submitButton = this.page.locator('.dialog-footer__submit-button');
    await submitButton.waitFor({ state: 'visible' });
    await submitButton.click();

    await this.page.waitForTimeout(3000);

  }
}
