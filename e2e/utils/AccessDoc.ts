import { Page, expect } from '@playwright/test';
import { URLs, getFullUrl } from '../constants';
import path from 'path';

export class AccessDoc {
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
    shouldComplete: boolean = false
  ) {
    try {
      // کلیک روی دکمه ایجاد مخزن جدید
      const createRepoButton = this.page.locator(
        'button:has-text("ایجاد مخزن جدید")'
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
          'div[placeholder="stepper-dialog"]'
        );
        await expect(stepperDialog).toBeVisible();

        // کلیک روی دکمه ادامه
        const continueButton = this.page.locator(
          '.repo-create-dialog__create-button'
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
    shouldComplete: boolean = false
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
   * اشتراک‌گذاری مخزن با کاربر دیگر
   * @param username نام کاربری که می‌خواهیم مخزن را با او به اشتراک بگذاریم
   */
  async shareRepository(username: string) {
    // وارد کردن نام کاربری در فیلد شناسه پادی
    await this.page.getByPlaceholder('شناسه پادی').fill(username);

    // کلیک روی دکمه دعوت
    await this.page.getByRole('button', { name: 'دعوت' }).click();

    // انتظار برای اطمینان از ایجاد تگ
    try {
      // تلاش برای یافتن توست موفقیت
      const toastSelector = '.toast-success';
      await this.page.waitForSelector(toastSelector, { timeout: 15000 });

      // اگر توست پیدا شد، محتوای آن را بررسی می‌کنیم
      const toastMessage = await this.page.locator(toastSelector).textContent();
      expect(toastMessage).toContain('کاربر با موفقیت به مخزن اضافه شد');

      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>> Toast message founded successfully.'
      );
    } catch (error) {
      // اگر توست پیدا نشد، به کار ادامه می‌دهیم
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>  Toast notification not found, proceeding with Continue button'
      );
    }

    // کلیک روی دکمه ادامه
    const continueButton = this.page.locator('button:has-text("ادامه")');
    await continueButton.waitFor({ state: 'visible' });
    await continueButton.click();

    await this.page.waitForTimeout(3000);

    await this.page.locator('.repo-image__dialog-next-button').click();

    await this.page.waitForTimeout(5000);

    await this.page.reload();
    await this.page.waitForLoadState('networkidle'); // صبر کن تا همه چیز لود شه
  }

  async AcceptRequest(): Promise<void> {
    await this.page.waitForTimeout(3000);

    const joinBtn = this.page.locator('.join-to-repo-requests__button');
    if (await joinBtn.isVisible()) {
      await joinBtn.click();
    }

    await this.page.locator('button:has-text("تایید")').first().click();
    await this.page.waitForTimeout(3000);


    const enterRepoBtn = this.page.locator('button:has-text("ورود به مخزن")');
    if (await enterRepoBtn.isVisible()) {
      await enterRepoBtn.click();
    }

    await this.page.waitForTimeout(5000);
  }

  async AccessCatUtils(): Promise<void> {
    await this.page.waitForTimeout(3000);
    await this.page.waitForSelector('.repo-card', { timeout: 10000 });
    const firstRepo = this.page.locator('.repo-card').first();
    if (await firstRepo.isVisible()) {
      await firstRepo.click();
    }
    
    await this.page.locator('button.document-menu.bg-transparent.flex.justify-center').first().click();

    const accessButton = this.page.locator('.document-access');
    if (await accessButton.isVisible()) {
      await accessButton.click();
    }
    

    await this.page.locator('input.text-primary_normal').click();


    await this.page.locator('p.select_option__text', { hasText: 'emad.mh' }).click();

    const addButton = this.page.locator('.add-button');
    if (await addButton.isVisible()) {
      await addButton.click();
    }
    
    await this.page.waitForTimeout(5000);
  }
}
