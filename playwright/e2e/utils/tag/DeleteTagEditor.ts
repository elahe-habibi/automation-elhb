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
        '>>>>>>>>>>>>>>>>>>>>>>> Toast message founded successfully.',
      );
    } catch (error) {
      // اگر توست پیدا نشد، به کار ادامه می‌دهیم
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>  Toast notification not found, proceeding with Continue button',
      );
    }

    // کلیک روی دکمه ادامه
    const continueButton = this.page.locator('button:has-text("ادامه")');
    await continueButton.waitFor({ state: 'visible' });
    await continueButton.click();
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

  /**
   * انتخاب رادیو باتن تصویر سفارشی با متن و توضیحات
   */
  async selectCustomImageRadio() {
    try {
      // Select and click the radio button
      const radioButton = this.page.locator('.repo-attach-custom-image__radio');
      await expect(radioButton).toBeVisible();
      await radioButton.click();
      await expect(radioButton).toBeChecked();

      // Select and click the custom image button
      const customImageButton = this.page.locator(
        '.repo-attach-custom-image-button',
      );
      await customImageButton.click();
    } catch (error) {
      console.error('خطا در انتخاب رادیو باتن تصویر سفارشی:', error);
      throw error;
    }
  }

  /**
   * آپلود تصویر سفارشی برای مخزن
   * @param imagePath مسیر تصویر
   */
  async uploadCustomRepositoryImage(imagePath: string) {
    try {
      // انتخاب رادیو باتن تصویر سفارشی
      await this.selectCustomImageRadio();

      // انتظار برای اطمینان از لود شدن دیالوگ آپلود
      await this.page.waitForTimeout(20000);

      // آپلود تصویر
      const fileInput = this.page.locator('#file-upload');
      const absolutePath = path.resolve(__dirname, '../../assets/picture.jpg');
      await fileInput.setInputFiles(absolutePath);

      // انتظار برای اطمینان از تکمیل آپلود
      await this.page.waitForTimeout(3000);

      // کلیک روی دکمه تایید
      const confirmButton = this.page.locator(
        '.dialog-content__submit.lib-btn.lib-modal-btn-success',
      );
      await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
      await expect(confirmButton).toBeEnabled();
      await confirmButton.click();
      await this.page.waitForTimeout(2000);

      // انتخاب اولین تصویر از لیست
      const firstRecord = this.page
        .locator('.hover\\:cls-bg-\\[\\#F1EDF7\\]')
        .first();
      await firstRecord.waitFor({ state: 'visible', timeout: 10000 });
      await expect(firstRecord).toBeEnabled();
      await firstRecord.click();
      await this.page.waitForTimeout(2000);

      // کلیک روی دکمه افزودن
      const addButton = this.page.locator('.dialog-footer__submit-button');
      await addButton.waitFor({ state: 'visible', timeout: 10000 });
      await expect(addButton).toBeEnabled();
      await addButton.click();
      await this.page.waitForTimeout(2000);

      // کلیک روی دکمه ادامه
      const continueButton = this.page.locator(
        '.repo-image__dialog-next-button',
      );
      await continueButton.waitFor({ state: 'visible', timeout: 10000 });
      await expect(continueButton).toBeEnabled();
      await continueButton.click();

      // انتظار برای اطمینان از تکمیل عملیات
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
    } catch (error) {
      console.error('خطا در آپلود تصویر سفارشی:', error);
      throw error;
    }
  }

  /**
   * کلیک روی دکمه منو
   */
  async clickDropdownButton(): Promise<void> {

   // ═════════════════════════════════════════════════════════
// ✅ پیدا کردن و کلیک روی دکمه "افزودن تگ" فقط با استفاده از کلاس اصلی createTag
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن دکمه "افزودن تگ" با کلاس createTag...');

// سلکتور دقیق فقط با کلاس اصلی (بدون وابستگی به ساختار والد یا متن)
const addTagButton = this.page.locator('div.createTag').first();

// انتظار هوشمند + کلیک ایمن
await addTagButton.waitFor({ state: 'visible', timeout: 10000 });
await addTagButton.click({ delay: 100 });
console.log('✅ دکمه "افزودن تگ" با موفقیت کلیک شد');


// ═════════════════════════════════════════════════════════
// ✅ پر کردن فیلد نام تگ + کلیک روی دکمه "ایجاد" + تأیید توست موفقیت
// ═════════════════════════════════════════════════════════
console.log('📝 در حال وارد کردن نام تگ در فیلد...');

// 1. پر کردن فیلد نام تگ با متن فارسی کاملاً تمیز
const tagNameInput = this.page.locator('input.tag-create-dialog__name');
await tagNameInput.waitFor({ state: 'visible', timeout: 10000 });
await tagNameInput.fill('تگ تستی'); // ✅ فقط متن فارسی خالص بدون هیچ کاراکتر اضافه
console.log('✅ نام تگ "تگ تستی" با موفقیت وارد شد');

// 2. کلیک روی دکمه "ایجاد" با سلکتور دقیق و ایمن
console.log('🎯 در حال پیدا کردن دکمه "ایجاد"...');
const createButton = this.page.locator(
  'button.dialog-footer__submit-button:has(p:text("ایجاد"))' // هدف‌گیری دقیق متن داخل <p>
).first();
await createButton.waitFor({ state: 'visible', timeout: 10000 });
await createButton.click({ delay: 100 });
console.log('✅ دکمه "ایجاد" با موفقیت کلیک شد');

// 3. تأیید نمایش توست موفقیت (پشتیبانی برای وجود/عدم وجود نقطه پایان)
console.log('⏳ در انتظار نمایش پیام موفقیت ایجاد تگ...');
await expect(
  this.page.getByText(/تگ با موفقیت ایجاد شد\.?/) // تطبیق با یا بدون نقطه پایان
).toBeVisible({ timeout: 10000 });
console.log('✅ پیام "تگ با موفقیت ایجاد شد" با موفقیت تأیید شد');


  }

  /**
   * خروج از حساب کاربری
   */
  async LogOut(): Promise<void> {
    const menuButton = this.page.locator('.userProfile').nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await this.page.waitForTimeout(3000);

    const editButton = this.page.locator('.logout-button');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(editButton).toBeVisible();
    // کلیک روی دکمه "خروج"
    await editButton.click();
  }

  /**
   * پذیرش درخواست عضویت در مخزن
   */
  async DeleteTag(): Promise<void> {
   
// ═════════════════════════════════════════════════════════
// ✅ کلیک روی اولین دکمه سه‌نقطه تگ (با استفاده از کلاس منحصربفرد tag-menu)
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن اولین دکمه سه‌نقطه تگ...');

// سلکتور دقیق با کلاس tag-menu (منحصربفرد به منوی تگ‌ها) + اسکوپ به دسکتاپ
const firstTagMenuButton = this.page.locator(
  'div.desktop-menu button.tag-menu[aria-haspopup="menu"]' // ✅ ترکیب کلاس + aria برای دقت 100%
).first(); // انتخاب اولین تگ در لیست

// انتظار هوشمند + اسکرول ایمن
await firstTagMenuButton.waitFor({ state: 'visible', timeout: 10000 });
await firstTagMenuButton.scrollIntoViewIfNeeded();
await this.page.waitForTimeout(300);

// کلیک ایمن با تأخیر
await firstTagMenuButton.click({ delay: 100 });
console.log('✅ اولین دکمه سه‌نقطه تگ با موفقیت کلیک شد');

// ═════════════════════════════════════════════════════════
// ✅ پیدا کردن و کلیک روی دکمه "حذف تگ" فقط با استفاده از کلاس منحصربفرد delete-tag__button
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن دکمه "حذف تگ" با کلاس منحصربفرد...');

// سلکتور دقیق فقط با کلاس اختصاصی دکمه حذف تگ (بدون وابستگی به متن یا ساختار والد)
const deleteTagButton = this.page.locator('button.delete-tag__button').first();

// انتظار هوشمند + کلیک ایمن
await deleteTagButton.waitFor({ state: 'visible', timeout: 10000 });
await deleteTagButton.click({ delay: 100 });
console.log('✅ دکمه "حذف تگ" با موفقیت کلیک شد');

// ═════════════════════════════════════════════════════════
// ✅ پیدا کردن و کلیک روی دکمه "حذف" در دیالوگ تأیید (فقط با کلاس اصلی + اسکوپ به دیالوگ فعال)
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن دکمه "حذف" در دیالوگ تأیید...');

// سلکتور دقیق فقط با کلاس اصلی + اسکوپ به دیالوگ فعال (بدون وابستگی به متن یا کلاس‌های رنگی)
const deleteButton = this.page.locator(
  'div[role="dialog"] button.dialog-footer__submit-button' // ✅ فقط کلاس اصلی + اسکوپ به دیالوگ
).first();

// انتظار هوشمند + تأیید فعال بودن
await deleteButton.waitFor({ state: 'visible', timeout: 15000 });
await expect(deleteButton).toBeEnabled({ timeout: 5000 });

// کلیک ایمن با تأخیر کوتاه
await deleteButton.click({ delay: 100 });
console.log('✅ دکمه "حذف" در دیالوگ تأیید با موفقیت کلیک شد');
  }
}
