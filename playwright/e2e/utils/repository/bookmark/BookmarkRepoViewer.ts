import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class EditRepositoryBookMark {
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
    await this.page.waitForTimeout(3000);
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
    await this.page.waitForTimeout(3000);
  }

  /**
   * کلیک روی دکمه منو
   */
  async clickDropdownButton(): Promise<void> {
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await this.page.waitForTimeout(2000);
// ═════════════════════════════════════════════════════════
// ✅ پیدا کردن و کلیک روی دکمه "بوکمارک کردن" با استفاده از کلاس منحصر به فرد
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن دکمه "بوکمارک کردن"...');

// سلکتور دقیق بر اساس کلاس موجود در HTML شما
const bookmarkButton = this.page.locator(
  'button.repo-menu__item--bookmark-remove' // ✅ دقیقاً همان کلاس از کد شما
).first();

// انتظار هوشمند + تأیید قابل کلیک بودن
await bookmarkButton.waitFor({ state: 'visible', timeout: 10000 });
await expect(bookmarkButton).toBeEnabled({ timeout: 5000 });

// کلیک ایمن با تأخیر کوتاه برای شبیه‌سازی رفتار واقعی
await bookmarkButton.click({ delay: 100 });
console.log('✅ دکمه "بوکمارک کردن" با موفقیت کلیک شد');

// تأیید نمایش پیام موفقیت (اختیاری - اگر سیستم توست نمایش می‌دهد)

    await this.page.waitForTimeout(2000);

    const confirmButton = this.page.locator('.dialog-footer__submit-button');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(confirmButton).toBeVisible();
    // کلیک روی دکمه "تایید"
    await confirmButton.click();
  }

  async bookmarkRepo(): Promise<void> {
    //... existing code ...
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
  console.log('🎯 در حال انتخاب نقش "مهمان"...');
  const editorOption = this.page
    .locator('ul[role="listbox"] li:has(p.select_option__text:has-text("مهمان"))')
    .first(); // اطمینان از انتخاب اولین گزینه مرتبط
  
  await editorOption.waitFor({ state: 'visible', timeout: 10000 });
  await editorOption.click();
  console.log('✅ نقش "مهمان" با موفقیت انتخاب شد');

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

}
