import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class AcceptDraft {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش سند
   */
  async acceptDraft(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const versionListButton = this.page.locator('.document-version-list');
    await expect(versionListButton).toBeVisible();
    await versionListButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const versionMenuButton = this.page.locator('button.version-menu').nth(0);
    await versionMenuButton.waitFor({ state: 'visible' });
    await versionMenuButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // کلیک روی دکمه "تایید و عمومی‌سازی پیش‌نویس" با استفاده از کلاس اختصاصی
    console.log('🎯 در حال کلیک روی دکمه "تایید و عمومی‌سازی پیش‌نویس"...');

    const confirmPublicButton = this.page
      .locator('button.confirmPublic-draft')
      .first();

    await confirmPublicButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmPublicButton.click();
    console.log('✅ دکمه تایید و عمومی‌سازی با موفقیت کلیک شد');

    const confirmBtn = this.page.locator(
      'button.dialog-footer__submit-button:has-text("تایید")',
    );
    await confirmBtn.scrollIntoViewIfNeeded();
    await confirmBtn.waitFor({ state: 'visible', timeout: 10000 });
    await confirmBtn.click();
    await this.page.waitForTimeout(3000); // تاخیر ۲ ثانیه‌ای

    const toastMessage = this.page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 3000 });
    await expect(toastMessage).toContainText(
      'نسخه باموفقیت تایید و عمومی شد.',
      {
        timeout: 3000,
      },
    );
  }

  /**
   * پذیرش درخواست پیش‌نویس نسخه از طریق مسیر کامل منو
   * 1. کلیک روی منوی سه‌نقطه مخزن
   * 2. کلیک روی گزینه "درخواست‌ها"
   * 3. کلیک روی منوی سه‌نقطه درخواست پیش‌نویس
   * 4. کلیک روی "قبول درخواست"
   */
  async acceptVersionPublicRequest(): Promise<void> {
    // مرحله ۱: کلیک روی دکمه منوی سه‌نقطه مخزن (در دسکتاپ)
    console.log('🎯 در حال کلیک روی منوی سه‌نقطه مخزن...');
    const repoMenuButton = this.page
      .locator(
        '.repoInformationTab.repoActions .desktop-menu button[aria-haspopup="menu"]',
      )
      .first();

    await repoMenuButton.waitFor({ state: 'visible', timeout: 10000 });
    await repoMenuButton.click();
    console.log('✅ منوی مخزن باز شد');

    // مرحله ۲: کلیک روی گزینه "درخواست‌ها"
    console.log('🎯 در حال انتخاب گزینه "درخواست‌ها"...');
    const requestsMenuItem = this.page
      .locator(
        'button.repo-menu__item--version-requests:has-text("درخواست‌ها")',
      )
      .first();

    await requestsMenuItem.waitFor({ state: 'visible', timeout: 10000 });
    await requestsMenuItem.click();
    console.log('✅ بخش درخواست‌ها باز شد');
    // مرحله ۶: کلیک روی تب "نسخه‌های در انتظار عمومی شدن"
    console.log('🎯 در حال کلیک روی تب "نسخه‌های در انتظار عمومی شدن"...');

    // ✅ پیشنهاد: ترکیب یک کلاس منحصر‌به‌فرد + data-value برای پایداری بیشتر
    const pendingVersionsTab = this.page
      .locator(
        'li[role="tab"].cursor-pointer[data-value="نسخه‌های در انتظار عمومی شدن"]',
      )
      .first();

    await pendingVersionsTab.waitFor({ state: 'visible', timeout: 10000 });
    await pendingVersionsTab.click();
    console.log('✅ تب "نسخه‌های در انتظار عمومی شدن" انتخاب شد');

    // ✅ انتظار برای لود شدن محتوای تب (اختیاری اما توصیه می‌شود)
    await this.page.waitForLoadState('networkidle');

    // کلیک روی منوی سه‌نقطه درخواست نسخه
    console.log('🎯 در حال کلیک روی منوی درخواست نسخه...');

    const versionRequestMenu = this.page
      .locator('button.repo-version-request-menu')
      .first();

    await versionRequestMenu.waitFor({ state: 'visible', timeout: 10000 });
    await versionRequestMenu.click();
    console.log('✅ منوی درخواست نسخه باز شد');

    // مرحله: کلیک روی گزینه "رد درخواست" در منو
    console.log('🎯 در حال کلیک روی دکمه "رد درخواست"...');

    const rejectRequestButton = this.page
      .locator('button.repo-version-request__reject-request')
      .first();

    await rejectRequestButton.waitFor({ state: 'visible', timeout: 10000 });
    await rejectRequestButton.click();
    console.log('✅ دکمه "رد درخواست" با موفقیت کلیک شد');

    /// مرحله ۵: ✅ کلیک روی دکمه "تایید" در دیالوگ تأیید (با کلاس دقیق)
    console.log('🎯 در حال کلیک روی دکمه "تایید" در دیالوگ...');
    const confirmButton = this.page
      .locator('button.dialog-footer__submit-button:has-text("تایید")')
      .first();

    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmButton.click();
    console.log('✅ دکمه "تایید" با موفقیت کلیک شد');

    // ✅ انتظار و بررسی پیام توست: "تایید پیش‌نویس رد شد."
    console.log('🔍 در انتظار نمایش پیام تأیید رد درخواست...');

    const toastMessage = this.page.locator('.Toastify__toast-body');

    // انتظار برای نمایش توست
    await expect(toastMessage).toBeVisible({ timeout: 10000 });

    // بررسی متن دقیق پیام
    await expect(toastMessage).toContainText('تایید پیش‌نویس رد شد.', {
      timeout: 5000,
    });

    console.log('✅ پیام "تایید پیش‌نویس رد شد." با موفقیت نمایش داده شد');
  }
}
