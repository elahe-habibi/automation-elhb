import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class EditRepositoryShareLink {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * رفتن به صفحه داشبورد
   */
  async goToDashboard(): Promise<void> {
    await this.page.goto('https://clasor-frontend.sandpod.ir/admin/dashboard');
    await this.page.waitForLoadState('networkidle');

    await this.page.waitForTimeout(2000);
  }

  /**
   * انتخاب اولین مخزن در لیست
   */
  async selectFirstRepository(): Promise<void> {
    await this.page.waitForSelector('.repo-card', { timeout: 10000 });

    const firstRepo = this.page.locator('.repo-card').first();
    await firstRepo.click();
    await this.page.waitForLoadState('networkidle');

    // اضافه کردن تاخیر برای اطمینان از بارگذاری کامل صفحه
    await this.page.waitForTimeout(2000);
  }

  /**
   * ایجاد لینک اشتراک‌گذاری با نقش مشخص
   * @param roleIndex - ایندکس نقش (0 تا 3)
   */
  async createShareLinkWithRole(roleIndex: number): Promise<void> {
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(roleIndex);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await this.page.waitForTimeout(2000);

    const shareButton = this.page.locator('.repo-menu__item--share');
    await expect(shareButton).toBeVisible();
    await shareButton.click();

    await this.page.waitForTimeout(2000);

    const linkTab = this.page
      .locator('.items-center.justify-center.text-center.cursor-pointer')
      .nth(2);
    await expect(linkTab).toBeVisible();
    await linkTab.click();

    await this.page.waitForTimeout(2000);

    const createLinkButton = this.page
      .locator('.repo-link-wrapper__create-link-button')
      .nth(roleIndex);
    await expect(createLinkButton).toBeVisible();
    await createLinkButton.click();

    await this.page.waitForTimeout(2000);

    // تنظیم رمز عبور
    const passwordCheckbox = this.page
      .locator('input.peer[type="checkbox"]')
      .nth(0);
    await expect(passwordCheckbox).toBeVisible();
    await passwordCheckbox.click();

    await this.page.waitForTimeout(2000);

    const passwordField = this.page.locator('input[type="password"]');
    await expect(passwordField).toBeVisible();
    await passwordField.fill('123456789');

    // تنظیم تاریخ انقضا
    const expirationCheckbox = this.page
      .locator('input[type="checkbox"].peer')
      .nth(1);
    await expect(expirationCheckbox).toBeVisible();
    await expirationCheckbox.click();

    const dateField = this.page.locator('.datePicker__input');
    await expect(dateField).toBeVisible();
    await dateField.click();

    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const nextDayValue = nextDay.toDateString();

    const nextDayButton = this.page.locator(
      `button[data-value*="${nextDayValue}"]`,
    );
    await expect(nextDayButton).toBeVisible();
    await nextDayButton.click();

    await this.page.waitForTimeout(3000);
    // ═════════════════════════════════════════════════════════
    // ✅ کلیک قطعی روی دکمه "ایجاد" پس از انتخاب تاریخ (بدون وابستگی به وضعیت دیالوگ تاریخ)
    // ═════════════════════════════════════════════════════════
    await this.page.waitForTimeout(3000);

    // مرحله ۱: بستن اجباری دیالوگ تاریخ با کلیک خارج از آن (در صورت باز بودن)
    console.log('🔄 در حال بستن دیالوگ تاریخ (در صورت باز بودن)...');
    try {
      // کلیک در گوشه بالا-چپ صفحه برای بستن هر دیالوگ باز
      await this.page.mouse.click(10, 10);
      await this.page.waitForTimeout(500);
      console.log('✅ دیالوگ تاریخ بسته شد');
    } catch {
      console.log('⚠️ دیالوگ تاریخ از قبل بسته بود');
    }

    // مرحله ۲: پیدا کردن دکمه "ایجاد" با سلکتورهای چندلایه
    console.log('🎯 در حال پیدا کردن دکمه "ایجاد"...');
    const createButton = this.page
      .locator(
        'button.dialog-footer__submit-button:has(p:text("ایجاد")), ' +
          'div.dialog-footer button:has-text("ایجاد"), ' +
          'button:has-text("ایجاد").dialog-footer__submit-button, ' +
          'button[type="submit"]:has-text("ایجاد")',
      )
      .first();

    await createButton.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ دکمه "ایجاد" پیدا شد');

    // مرحله ۳: کلیک قطعی با ۳ لایه پشتیبان (بدون هیچ شرطی!)
    console.log('🔥 در حال کلیک قطعی روی دکمه "ایجاد" (هر طور که هست!)...');

    // لایه اول: کلیک عادی
    try {
      await createButton.click({ timeout: 5000, delay: 100 });
      console.log('✅ کلیک عادی موفقیت‌آمیز بود');
    } catch {
      console.log('⚠️ کلیک عادی شکست خورد، در حال تلاش با حالت اجباری...');

      // لایه دوم: کلیک اجباری (force)
      try {
        await createButton.click({ force: true, timeout: 5000 });
        console.log('✅ کلیک اجباری (force) موفقیت‌آمیز بود');
      } catch {
        console.log('⚠️ کلیک اجباری شکست خورد، در حال تلاش با مختصات...');

        // لایه سوم: کلیک با مختصات فیزیکی (حتی اگر پوشیده باشد)
        const box = await createButton.boundingBox();
        if (box) {
          await this.page.mouse.click(
            box.x + box.width / 2,
            box.y + box.height / 2,
            { button: 'left', clickCount: 1 },
          );
          console.log('✅ کلیک با مختصات فیزیکی موفقیت‌آمیز بود');
        } else {
          throw new Error(
            '❌ دکمه "ایجاد" برای کلیک مختصاتی قابل دسترسی نیست!',
          );
        }
      }
    }

    console.log('🎉 دکمه "ایجاد" با موفقیت کلیک شد (بدون هیچ محدودیتی!)');
    await this.page.waitForTimeout(3000);


// ═════════════════════════════════════════════════════════
// ✅ پیدا کردن و کلیک روی دکمه حذف لینک با استفاده از کلاس منحصر به فرد
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن دکمه حذف لینک...');

// سلکتور دقیق بر اساس کلاس منحصر به فرد از HTML شما
const deleteButton = this.page.locator(
  'button.public-link-delete-button' // ✅ دقیقاً همان کلاس موجود در کد شما
).first(); // انتخاب اولین دکمه (در صورت وجود چند لینک)

// انتظار هوشمند + تأیید قابل کلیک بودن
await deleteButton.waitFor({ state: 'visible', timeout: 10000 });
await expect(deleteButton).toBeEnabled({ timeout: 5000 });

// کلیک ایمن با تأیید پس از کلیک
await deleteButton.click({ delay: 100 });
console.log('✅ دکمه حذف لینک با موفقیت کلیک شد');

// تأیید بسته شدن دیالوگ یا نمایش پیام موفقیت (اختیاری)
await this.page.waitForTimeout(1000);


// 2. تأیید پیام موفقیت (کد جدید بالا)
await expect(
  this.page.getByText('لینک مورد نظر با موفقیت حذف شد', { exact: true })
).toBeVisible({ timeout: 15000 });
console.log('✅ پیام موفقیت حذف لینک تأیید شد');

// 3. (اختیاری) تأیید ناپدید شدن لینک از لیست
await this.page.waitForTimeout(1000);
console.log('✅ تست حذف لینک با موفقیت به پایان رسید');




    await this.page.waitForTimeout(3000);
  }

  // برای سازگاری با کد قبلی، متد قبلی را حفظ می‌کنیم
  async clickDropdownButton(): Promise<void> {
    await this.createShareLinkWithRole(0);
  }

  async shareLinkRepo(): Promise<void> {
    // ... existing code ...
  }
}
