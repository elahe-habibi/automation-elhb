import { Page, expect } from '@playwright/test';
import path from 'path';
import { URLs, getFullUrl } from '../../constants';

export class CreateTag {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ایجاد یک مخزن جدید با نام و توضیحات مشخص
   * @param name نام مخزن
   * @param description توضیحات مخزن
   * @param shouldComplete اگر true باشد، مخزن ایجاد می‌شود، در غیر این صورت فقط فرم پر می‌شود و انصراف داده می‌شود
   */
  async createRepository(
    name: string,
    description: string,
    shouldComplete: boolean = false,
  ) {
    try {
      // کلیک روی دکمه ایجاد مخزن جدید
      const createRepoButton = this.page.locator(
        'button:has-text("ایجاد مخزن جدید")',
      );
      await createRepoButton.waitFor({ state: 'visible', timeout: 12000 });
      await createRepoButton.click();

      // انتظار برای نمایش فرم و اطمینان از بارگذاری کامل
      await this.page.waitForSelector('#repo-name', {
        state: 'visible',
        timeout: 12000,
      });

      // پر کردن فرم با مدیریت خطا
      try {
        // پر کردن نام مخزن
        await this.page.locator('#repo-name').fill(name);

        // پر کردن توضیحات
        await this.page
          .locator('textarea[name="description"]')
          .fill(description);

        // اطمینان از اینکه دیالوگ باز است
        const stepperDialog = this.page.locator(
          'div[placeholder="stepper-dialog"]',
        );
        await expect(stepperDialog).toBeVisible();

        // کلیک روی دکمه ادامه
        const continueButton = this.page.locator(
          '.repo-create-dialog__create-button',
        );
        await continueButton.waitFor({ state: 'visible' });
        await continueButton.click({ force: true });

        // انتظار برای اطمینان از حرکت به مرحله بعد
        await this.page.waitForTimeout(3000);

        if (!shouldComplete) {
          // کلیک روی دکمه انصراف
          const cancelButton = this.page.locator('button:has-text("انصراف")');
          await cancelButton.click();
        }
      } catch (error) {
        console.error('Error in form submission:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in createRepository:', error);
      throw error;
    }
  }

  /**
   * ایجاد یک مخزن با نام یکتا (بر اساس تاریخ و زمان)
   * @param description توضیحات مخزن
   * @param shouldComplete اگر true باشد، مخزن ایجاد می‌شود، در غیر این صورت فقط فرم پر می‌شود و انصراف داده می‌شود
   * @returns نام یکتای مخزن ایجاد شده
   */
  async createRepositoryWithUniqueName(
    description: string,
    shouldComplete: boolean = false,
  ): Promise<string> {
    // ایجاد نام یکتا برای مخزن
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}-${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}`;
    const uniqueRepoName = `test-repo-${formattedDate}`;

    // ایجاد مخزن با نام یکتا
    await this.createRepository(uniqueRepoName, description, shouldComplete);

    return uniqueRepoName;
  }


  /**
   * کلیک روی دکمه منو
   */
  async clickDropdownButton(): Promise<void> {


// 🧪 تست ایجاد تگ تکراری و بررسی خطا
console.log('\n🧪 شروع تست تگ تکراری...');

// مرحله ۱: ایجاد تگ اول (موفقیت‌آمیز)
console.log('✅ ایجاد تگ اول "تگ-تکراری"...');
await this.page.locator('div.createTag').first().click();
await this.page.locator('input.tag-create-dialog__name').fill('تگ-تکراری');
await this.page.locator('button.dialog-footer__submit-button:has(p:text("ایجاد"))').first().click();
await expect(this.page.getByText(/تگ با موفقیت ایجاد شد\.?/)).toBeVisible({ timeout: 10000 });
console.log('✅ تگ اول با موفقیت ایجاد شد');

// مرحله ۲: تلاش برای ایجاد تگ دوم با همان نام (باید خطا بدهد)
console.log('⚠️ تلاش برای ایجاد تگ تکراری "تگ-تکراری"...');
await this.page.locator('div.createTag').first().click();
await this.page.locator('input.tag-create-dialog__name').fill('تگ-تکراری');
await this.page.locator('button.dialog-footer__submit-button:has(p:text("ایجاد"))').first().click();

// مرحله ۳: بررسی دقیق توست خطا (متن کامل + کد خطا)
console.log('🔍 در انتظار نمایش خطا...');
await expect(
  this.page.getByText('عنوان نمی تواند تکراری باشد - cl-42')
).toBeVisible({ timeout: 10000 });
console.log('✅ خطا تأیید شد: "عنوان نمی تواند تکراری باشد - cl-42"');

// مرحله ۴: بستن دیالوگ پس از خطا
console.log('CloseOperation دیالوگ...');
await this.page.locator('button.cancel-button').click();
console.log('✅ دیالوگ بسته شد');


  }

}
