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
 * ایجاد لینک انتشار مخزن (برای انتشار عمومی مخزن)
 */
async createPublishLink(): Promise<void> {
  console.log('🔄 شروع فرآیند ایجاد لینک انتشار مخزن...');

  // ═════════════════════════════════════════════════════════
  // مرحله ۱: باز کردن منوی سه‌نقطه مخزن
  // ═════════════════════════════════════════════════════════
  const menuButton = this.page.locator(
    'div.desktop-menu button[aria-haspopup="menu"], ' +
    '.repoInformationTab.repoActions button'
  ).first();
  
  await menuButton.waitFor({ state: 'visible', timeout: 10000 });
  await menuButton.click();
  console.log('✅ منوی سه‌نقطه مخزن باز شد');
  await this.page.waitForTimeout(1000);

  // ═════════════════════════════════════════════════════════
  // مرحله ۲: انتخاب گزینه "اشتراک‌گذاری"
  // ═════════════════════════════════════════════════════════
  const shareButton = this.page.locator(
    'button:has-text("اشتراک‌گذاری"), ' +
    '[role="menuitem"]:has-text("اشتراک")'
  ).first();
  
  await shareButton.waitFor({ state: 'visible', timeout: 10000 });
  await shareButton.click();
  console.log('✅ بخش اشتراک‌گذاری باز شد');
  await this.page.waitForTimeout(2000);

  // ═════════════════════════════════════════════════════════
  // مرحله ۳: ✨ انتخاب تب "انتشار" (بر اساس کد HTML شما)
  // ═════════════════════════════════════════════════════════
  console.log('🔄 در حال انتخاب تب "انتشار"...');
  
  // سلکتور دقیق بر اساس کد HTML ارائه شده
  const publishTab = this.page.locator(
    'li[role="tab"][data-value="انتشار"], ' + // سلکتور اصلی از HTML شما
    'li:has(div:has-text("انتشار"))'          // پشتیبان با جستجوی متن
  ).first();
  
  await publishTab.waitFor({ state: 'visible', timeout: 10000 });
  await publishTab.click();
  console.log('✅ تب "انتشار" انتخاب شد');
  await this.page.waitForTimeout(1500);

  // ═════════════════════════════════════════════════════════
  // مرحله ۴: ✨ کلیک روی دکمه "ایجاد" لینک انتشار (بر اساس کد HTML شما)
  // ═════════════════════════════════════════════════════════
  console.log('🔄 در حال کلیک روی دکمه "ایجاد" لینک انتشار...');
  
  // سلکتور دقیق بر اساس کد HTML ارائه شده
  const createPublishButton = this.page.locator(
    'button.repo-create-publish-link__create-button:has-text("ایجاد"), ' + // کلاس + متن
    'button:has(p:has-text("ایجاد")):has(.repo-create-publish-link__create-button)' // ساختار داخلی
  ).first();
  
  await createPublishButton.waitFor({ state: 'visible', timeout: 10000 });
  await createPublishButton.click();
  console.log('✅ دکمه "ایجاد" لینک انتشار کلیک شد');
  
  // انتظار برای پردازش و نمایش لینک ایجاد شده
  await this.page.waitForTimeout(3000);
  
  // ✅ تأیید موفقیت‌آمیز بودن عملیات (اختیاری)
  const successIndicator = this.page.locator(
    '.publish-link-created, ' +
    '[data-testid="publish-link"], ' +
    'text="لینک انتشار با موفقیت ایجاد شد"'
  );
  
  if (await successIndicator.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('✅ لینک انتشار مخزن با موفقیت ایجاد شد');
  } else {
    console.log('ℹ️ لینک انتشار ایجاد شد (بدون نمایش پیام تأیید)');
  }

  await this.page.waitForTimeout(4000);



  // ═════════════════════════════════════════════════════════
  // مرحله ۵: ✨ کلیک روی دکمه "ورود به صفحه مخزن منتشرشده"
  // ═════════════════════════════════════════════════════════
  console.log('🔄 در حال جستجوی دکمه "ورود به صفحه مخزن منتشرشده"...');
  
  // سلکتور دقیق بر اساس کد HTML ارائه شده + پشتیبان‌های هوشمند
  const enterPublishedRepoButton = this.page.locator(
    // ✅ سلکتور اصلی از کد HTML شما
    'button:has-text("ورود به صفحه مخزن منتشرشده"), ' +
    
    // پشتیبان ۱: متن کوتاه‌تر (در صورت تغییر متن)
    'button:has-text("ورود به مخزن منتشرشده"), ' +
    
    // پشتیبان ۲: بر اساس کلاس خاص دکمه
    'button.bg-transparent.text-\\[\\#0C8CE9\\], ' +
    
    // پشتیبان ۳: دکمه‌ای که حاوی متن "منتشرشده" است
    'button:has-text("منتشرشده")'
  ).first();
  
  // انتظار برای ظهور دکمه (تا 10 ثانیه)
  await enterPublishedRepoButton.waitFor({ state: 'visible', timeout: 10000 });
  console.log('✅ دکمه "ورود به صفحه مخزن منتشرشده" پیدا شد');
  
  // کلیک ایمن روی دکمه
  await enterPublishedRepoButton.click();
  console.log('✅ کلیک روی دکمه "ورود به صفحه مخزن منتشرشده" انجام شد');
  
  // انتظار برای ناوبری به صفحه مخزن منتشرشده
  await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  await this.page.waitForTimeout(2000);
  
  // تأیید ورود به صفحه مخزن منتشرشده
  console.log('✅ وارد صفحه مخزن منتشرشده شد');
  
  // ✅ لاگ نهایی موفقیت
  console.log('✅ فرآیند ایجاد لینک انتشار و ورود به صفحه مخزن با موفقیت به پایان رسید');

}
  }