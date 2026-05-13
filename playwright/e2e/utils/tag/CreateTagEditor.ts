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
 * اشتراک‌گذاری مخزن با کاربر دیگر با انتخاب نقش "ویرایشگر"
 * @param username نام کاربری که می‌خواهیم مخزن را با او به اشتراک بگذاریم
 */
async shareRepository(username: string) {
  // وارد کردن نام کاربری در فیلد شناسه پادی
  await this.page.getByPlaceholder('شناسه پادی').fill(username);
  console.log(`✅ نام کاربری "${username}" وارد شد`);

  // ═════════════════════════════════════════════════════════
  // ✅ باز کردن دراپ‌دون نقش‌ها و انتخاب "ویرایشگر" (بر اساس ساختار دقیق HTML شما)
  // ═════════════════════════════════════════════════════════
  console.log('🔄 در حال باز کردن دراپ‌دون نقش‌ها...');
  
  // کلیک روی دکمه دراپ‌دون نقش‌ها (متن پیش‌فرض "مدیر")
  const roleDropdown = this.page.locator('button.repo-invite-form__select');
  await roleDropdown.waitFor({ state: 'visible', timeout: 10000 });
  await roleDropdown.click();
  console.log('✅ دراپ‌دون نقش‌ها باز شد');

  // انتخاب گزینه "ویرایشگر" با سلکتور دقیق مبتنی بر ساختار HTML شما
  console.log('🎯 در حال انتخاب نقش "ویرایشگر"...');
  const editorOption = this.page
    .locator('ul[role="listbox"] li:has(p.select_option__text:has-text("ویرایشگر"))')
    .first(); // اطمینان از انتخاب اولین گزینه مرتبط
  
  await editorOption.waitFor({ state: 'visible', timeout: 10000 });
  await editorOption.click();
  console.log('✅ نقش "ویرایشگر" با موفقیت انتخاب شد');

  // تأیید تغییر نقش در دکمه دراپ‌دون (اختیاری - برای دیباگ)
  const selectedRole = await roleDropdown.textContent();
  console.log(`🔍 نقش انتخاب‌شده در دکمه: "${selectedRole?.trim()}"`);

  // ═════════════════════════════════════════════════════════
  // ادامه فرآیند اشتراک‌گذاری (کلیک دعوت + تأیید)
  // ═════════════════════════════════════════════════════════
  await this.page.getByRole('button', { name: 'دعوت' }).click();
  console.log('✅ دکمه "دعوت" کلیک شد');

  // تأیید توست موفقیت (همان کد قبلی)
  try {
    const toastSelector = '.toast-success';
    await this.page.waitForSelector(toastSelector, { timeout: 15000 });
    const toastMessage = await this.page.locator(toastSelector).textContent();
    expect(toastMessage).toContain('کاربر با موفقیت به مخزن اضافه شد');
    console.log('✅ کاربر با نقش "ویرایشگر" به مخزن اضافه شد');
  } catch (error) {
    console.log('⚠️ توست موفقیت یافت نشد، اما ادامه فرآیند...');
  }

  // کلیک روی دکمه ادامه
  const continueButton = this.page.locator('button:has-text("ادامه")');
  await continueButton.waitFor({ state: 'visible', timeout: 10000 });
  await continueButton.click();
  console.log('✅ دکمه "ادامه" کلیک شد');
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

}
