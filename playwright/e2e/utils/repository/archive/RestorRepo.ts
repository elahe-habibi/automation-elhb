import { expect, Page } from '@playwright/test';
import { WaitUtils } from '../../core/waitutils';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class ArchiveRepository {
  private page: Page;
  private waitUtils: WaitUtils;

  constructor(page: Page) {
    this.page = page;
    this.waitUtils = new WaitUtils(page);
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
   * کلیک روی دکمه منو
   */
  async clickDropdownButton(): Promise<void> {
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const archiveButton = this.page.locator('.repo-menu__item--archive');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(archiveButton).toBeVisible();
    // کلیک روی دکمه "بایگانی"
    await archiveButton.click();

    await this.page.waitForTimeout(2000);

    const archiveBuutton = this.page.locator(
      '.dialog-footer__submit-button.bg-error',
    );
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(archiveBuutton).toBeVisible();
    // کلیک روی دکمه "آرشیو"
    await archiveBuutton.click();

    await this.page.waitForTimeout(2000);

    const manageReposButton = this.page.locator('button.border-b-2').nth(1);
    await expect(manageReposButton).toBeVisible();
    await manageReposButton.click();

    await this.page.waitForTimeout(5000);

    const archivedReposButton = this.page.locator('button.text-link').nth(6);
    await expect(archivedReposButton).toBeVisible();
    await archivedReposButton.click();

    await this.page.waitForTimeout(8000);


    // ═════════════════════════════════════════════════════════
// ✅ کلیک روی اولین دکمه منوی سه‌نقطه + انتخاب "بازگردانی" از منوی بازشده
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن اولین دکمه منوی سه‌نقطه در لیست مخازن...');

// پیدا کردن اولین دکمه منوی سه‌نقطه (بر اساس کلاس والد + ویژگی‌های استاندارد)
const firstMenuButton = this.page
  .locator('div.desktop-menu button[aria-haspopup="menu"]')
  .first();

// انتظار هوشمند + تأیید فعال بودن
await firstMenuButton.waitFor({ state: 'visible', timeout: 10000 });
await expect(firstMenuButton).toBeEnabled({ timeout: 5000 });

// کلیک ایمن با تأخیر برای شبیه‌سازی رفتار واقعی
await firstMenuButton.click({ delay: 150 });
console.log('✅ اولین دکمه منوی سه‌نقطه کلیک شد و منو باز شد');

// ═════════════════════════════════════════════════════════
// انتظار برای ظهور گزینه "بازگردانی" در منوی بازشده
// ═════════════════════════════════════════════════════════
console.log('⏳ در انتظار نمایش گزینه "بازگردانی" در منو...');

// سلکتور دقیق بر اساس کلاس منحصر به فرد از HTML شما
const restoreMenuItem = this.page
  .locator('button.repo-menu__item--restore') // ✅ دقیقاً همان کلاس موجود در کد شما
  .first(); // انتخاب اولین گزینه مرتبط (در صورت وجود چند منو)

// انتظار برای نمایش کامل گزینه
await restoreMenuItem.waitFor({ state: 'visible', timeout: 10000 });
await expect(restoreMenuItem).toBeEnabled({ timeout: 5000 });

// کلیک ایمن روی گزینه "بازگردانی"
await restoreMenuItem.click({ delay: 100 });
console.log('✅ گزینه "بازگردانی" با موفقیت از منو انتخاب شد');

await this.page.waitForTimeout(5000);

// ═════════════════════════════════════════════════════════
// ✅ پیدا کردن و کلیک روی دکمه "تایید" با استفاده از کلاس منحصر به فرد + اسکوپ به دیالوگ
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن دکمه "تایید"...');

// سلکتور هوشمند با اسکوپ به دیالوگ فعال + کلاس دقیق
const confirmButton = this.page.locator(
  'div[role="dialog"] button.dialog-footer__submit-button, ' + // اسکوپ به دیالوگ فعال
  'button.dialog-footer__submit-button'                         // پشتیبان عمومی
).first();

// انتظار هوشمند تا دکمه کاملاً قابل مشاهده و فعال باشد
await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
await expect(confirmButton).toBeEnabled({ timeout: 5000 });

// کلیک ایمن با تأخیر کوتاه
await confirmButton.click({ delay: 100 });
console.log('✅ دکمه "تایید" با موفقیت کلیک شد');

  }
}
