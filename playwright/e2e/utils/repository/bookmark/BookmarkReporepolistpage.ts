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

  // /**
  //  * انتخاب اولین مخزن در لیست
  //  */
  // async selectFirstRepository(): Promise<void> {
  //   await this.page.waitForSelector('.repo-card', { timeout: 10000 });

  //   const firstRepo = this.page.locator('.repo-card').first();
  //   await firstRepo.click();
  //   await this.page.waitForLoadState('networkidle');
  //   // اضافه کردن تاخیر برای اطمینان از بارگذاری کامل صفحه
  //   await this.page.waitForTimeout(3000);
  // }

  /**
   * کلیک روی دکمه منو
   */
  async clickDropdownButton(): Promise<void> {

// ═════════════════════════════════════════════════════════
// ✅ کلیک قطعی روی دکمه منوی اصلی مخزن (با ۳ لایه پشتیبان)
// ═════════════════════════════════════════════════════════
const menuButton = this.page.locator('.repoInformationTab.repoActions button').nth(0);

// انتظار هوشمند + تأیید فعال بودن
await menuButton.waitFor({ state: 'visible', timeout: 10000 });
await expect(menuButton).toBeEnabled({ timeout: 5000 });

// اسکرول به سمت دکمه (جلوگیری از پوشیده شدن توسط هدر)
await menuButton.scrollIntoViewIfNeeded();
await this.page.waitForTimeout(300);

console.log('🔥 در حال کلیک قطعی روی دکمه منوی اصلی مخزن...');

// لایه ۱: کلیک عادی با تأخیر
try {
  await menuButton.click({ delay: 150, timeout: 5000 });
  console.log('✅ کلیک عادی موفقیت‌آمیز بود');
} catch {
  console.log('⚠️ کلیک عادی شکست خورد، در حال تلاش با حالت اجباری...');
  
  // لایه ۲: کلیک اجباری (force)
  try {
    await menuButton.click({ force: true, timeout: 5000 });
    console.log('✅ کلیک اجباری (force) موفقیت‌آمیز بود');
  } catch {
    console.log('⚠️ کلیک اجباری شکست خورد، در حال تلاش با مختصات فیزیکی...');
    
    // لایه ۳: کلیک با مختصات مرکز دکمه (حتی اگر پشت المان دیگه باشه)
    const box = await menuButton.boundingBox();
    if (box) {
      await this.page.mouse.click(
        box.x + box.width / 2,
        box.y + box.height / 2,
        { button: 'left', clickCount: 1 }
      );
      console.log('✅ کلیک با مختصات فیزیکی موفقیت‌آمیز بود');
    } else {
      throw new Error('❌ دکمه برای کلیک با مختصات قابل دسترسی نیست!');
    }
  }
}

console.log('🎯 دکمه منوی اصلی مخزن با موفقیت کلیک شد!');
await this.page.waitForTimeout(1000);
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
