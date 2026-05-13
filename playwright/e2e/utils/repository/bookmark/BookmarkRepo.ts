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
}
