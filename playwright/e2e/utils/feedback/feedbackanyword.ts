import { expect, Page } from '@playwright/test';
import { WaitUtils } from '../core/waitutils';
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
   * تست ارسال بازخورد خالی (بدون متن)
   * انتظار خطای اعتبارسنجی: "لطفا متن پیام را وارد کنید"
   */
  async submitEmptyFeedback(): Promise<void> {
    // باز کردن دیالوگ بازخورد
    await this.page.click('.feedback__button');
    
    // انتظار برای نمایش دیالوگ (بدون تایم‌اوت دستی)
    await this.page.waitForSelector('.feedback__form-content-textarea', { 
      state: 'visible', 
      timeout: 5000 
    });

    // ✅ اطمینان از خالی بودن فیلد (حذف هر محتوای پیش‌فرض)
    const textarea = this.page.locator('.feedback__form-content-textarea');
    await textarea.clear();
    await expect(textarea).toHaveValue(''); // تأیید خالی بودن

    // کلیک روی دکمه تایید بدون وارد کردن متن
    const submitButton = this.page.locator('.dialog-footer__submit-button');
    await submitButton.click();

    // ✅ تأیید نمایش پیام خطا (بدون وابستگی به کلاس‌های پویا)
    await expect(
      this.page.getByText('لطفا متن پیام را وارد کنید')
    ).toBeVisible({ timeout: 5000 });
    
    console.log('✅ خطای اعتبارسنجی "لطفا متن پیام را وارد کنید" نمایش داده شد');
  }

  /**
   * ایجاد بازخورد موفق (با متن و تصویر)
   */
  async createfeeds(): Promise<void> {
    await this.page.goto('https://clasor-client.sandpod.ir/admin/dashboard');
    
    await this.page.click('.feedback__button');
    await this.page.waitForSelector('.feedback__form-content-textarea', { 
      state: 'visible' 
    });

    const textarea = this.page.locator('.feedback__form-content-textarea');
    await textarea.fill('ای ول بابا دمت گررررم\nای ول بابا دمت گررررم');

    const imagePath = path.join(process.cwd(), 'e2e/assets/picture.jpg');
    await this.page.locator('#input-file').setInputFiles(imagePath);

    const submitButton = this.page.locator('.dialog-footer__submit-button');
    await submitButton.click();
    await this.page.waitForTimeout(3000); // انتظار برای بسته شدن دیالوگ
  }
}