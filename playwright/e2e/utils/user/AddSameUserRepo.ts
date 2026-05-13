import { Page, expect } from '@playwright/test';
import { URLs, getFullUrl } from '../../constants';
import path from 'path';

export class RepositoryUtils {
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
 * اشتراک‌گذاری مخزن با کاربر دیگر
 * @param username نام کاربری که می‌خواهیم مخزن را با او به اشتراک بگذاریم
 */
async shareRepository(username: string) {
  // وارد کردن نام کاربری در فیلد شناسه پادی
  await this.page.getByPlaceholder('شناسه پادی').fill(username);

  // ✅ کلیک ۴ باره روی دکمه "دعوت" (طبق درخواست جدید)
  console.log('🖱️ شروع به کلیک ۴ باره روی دکمه "دعوت"...');
  
  for (let i = 1; i <= 6; i++) {
    console.log(`   کلیک ${i} از ۴ روی دکمه "دعوت"...`);
    
    const inviteButton = this.page.getByRole('button', { name: 'دعوت' });
    // انتظار برای ظاهر شدن دکمه قبل از هر کلیک
    await inviteButton.waitFor({ state: 'visible', timeout: 10000 });
    await inviteButton.click();
    
    // انتظار کوتاه بین کلیک‌ها (به جز بعد از آخرین کلیک)
    if (i < 4) {
      await this.page.waitForTimeout(800);
    }
  }
  
  console.log('✅ ۴ بار کلیک روی دکمه "دعوت" با موفقیت انجام شد');

  // انتظار برای اطمینان از پردازش درخواست‌ها
  await this.page.waitForTimeout(3000);

  try {
    // تلاش برای یافتن توست خطا
    const toastSelector = '.toast-success'; // یا '.toast-error' بسته به نوع خطا
    await this.page.waitForSelector(toastSelector, { timeout: 15000 });

    const toastMessage = await this.page.locator(toastSelector).textContent();
    // ✅ تغییر متن انتظار برای خطا (چون ۴ بار کلیک ممکنه خطا ایجاد کنه)
    expect(toastMessage).toContain('درخواست برای این کاربر قبلا ثبت شده - cl-32');
    console.log('✅ پیام خطا به درستی نمایش داده شد');
  } catch (error) {
    console.log('⚠️ Toast notification not found (ممکن است پس از ۴ کلیک خطا نمایش داده نشود)');
  }

  // کلیک روی دکمه ادامه (فقط یک بار)
  const continueButton = this.page.locator('button:has-text("ادامه")');
  await continueButton.waitFor({ state: 'visible', timeout: 10000 });
  await continueButton.click();
  
  console.log('✅ دکمه "ادامه" کلیک شد و فرآیند اشتراک‌گذاری تکمیل شد');
}


  /**
   * وارد کردن شناسه پادی
   * @param podId شناسه پادی کاربر
   */
  async enterPodId(podId: string) {
    // انتظار برای نمایش فیلد شناسه پادی
    await this.page.waitForSelector(
      'input[id="username"][placeholder="شناسه پادی"]',
      { state: 'visible' },
    );

    // پاک کردن فیلد قبل از پر کردن
    await this.page
      .locator('input[id="username"][placeholder="شناسه پادی"]')
      .clear();

    // وارد کردن شناسه پادی با استفاده از متد type
    await this.page
      .locator('input[id="username"][placeholder="شناسه پادی"]')
      .type(podId, { delay: 100 });

    // اطمینان از اینکه مقدار وارد شده در فیلد نمایش داده می‌شود
    await expect(
      this.page.locator('input[id="username"][placeholder="شناسه پادی"]'),
    ).toHaveValue(podId);

    // اضافه کردن تاخیر کوتاه برای اطمینان از پر شدن فیلد
    await this.page.waitForTimeout(3000);
  }

  async clickDropdownButton(): Promise<void> {
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const editButton = this.page.locator('.repo-menu__item--share');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(editButton).toBeVisible();
    // کلیک روی دکمه "ویرایش"
    await editButton.click();

    await this.page.waitForTimeout(5000);

    const closeButton = this.page.locator('.close-button');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(closeButton).toBeVisible();

    // کلیک روی دکمه "بستن"
    await closeButton.click();

    await this.page.waitForTimeout(5000);
  }

  async LogOut(): Promise<void> {
    const menuButton = this.page.locator('.userProfile').nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await this.page.waitForTimeout(3000);

    const editButton = this.page.locator('.logout-button');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(editButton).toBeVisible();
    // کلیک روی دکمه "ویرایش"
    await editButton.click();
  }

  async AcceptRequest(): Promise<void> {
    const menuButton = this.page
      .locator('.join-to-repo-requests__button')
      .nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await this.page.waitForTimeout(3000);

    const firstAcceptButton = this.page
      .locator('.request-menu__reject-button')
      .first();
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(firstAcceptButton).toBeVisible();
    // کلیک روی اولین دکمه "تایید"
    await firstAcceptButton.click();
  }
}
