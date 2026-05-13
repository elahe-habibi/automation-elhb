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

    const buttons = await this.page.locator('button.confirm-version').all();
    for (const btn of buttons) {
      const text = await btn.innerText();
      if (text.includes('تایید پیش نویس')) {
        await btn.click();
        break;
      }
    }

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
      'درخواست تایید نسخه برای مدیر ارسال شد.',
      {
        timeout: 3000,
      },
    );

    const versioonMenuButton = this.page.locator('button.version-menu').nth(0);
    await versioonMenuButton.waitFor({ state: 'visible' });
    await versioonMenuButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

     // 4. ✅ کلیک روی دکمه "لغو درخواست تایید پیش نویس" با کلاس
  const cancelButton = this.page.locator(
    'button.cancel-confirm-version:has-text("لغو درخواست تایید پیش نویس")'
  ).first();
  await cancelButton.waitFor({ state: 'visible', timeout: 10000 });
  await cancelButton.click();
  console.log('✅ دکمه لغو کلیک شد');

    const conffirmBtn = this.page.locator(
      'button.dialog-footer__submit-button:has-text("تایید")',
    );
    await conffirmBtn.scrollIntoViewIfNeeded();
    await conffirmBtn.waitFor({ state: 'visible', timeout: 10000 });
    await conffirmBtn.click();
    await this.page.waitForTimeout(3000); // تاخیر ۲ ثانیه‌ای

    // const toasstMessage = this.page.locator('.Toastify__toast-body');
    // await expect(toasstMessage).toBeVisible({ timeout: 3000 });
    // await expect(toasstMessage).toContainText(
    //   'درخواست تایید پیش نویس لغو شد.',
    //   {
    //     timeout: 3000,
    // },
   // );
  }

  /**
   * پذیرش درخواست پیش‌نویس نسخه از طریق مسیر کامل منو
   * 1. کلیک روی منوی سه‌نقطه مخزن
   * 2. کلیک روی گزینه "درخواست‌ها"
   * 3. کلیک روی منوی سه‌نقطه درخواست پیش‌نویس
   * 4. کلیک روی "قبول درخواست"
   */
  async acceptVersionDraftRequest(): Promise<void> {
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

    // مرحله ۳: کلیک روی دکمه منوی سه‌نقطه درخواست پیش‌نویس
    console.log('🎯 در حال کلیک روی منوی درخواست پیش‌نویس...');
    const draftRequestMenuButton = this.page
      .locator('button.repo-draft-request-menu[aria-haspopup="menu"]')
      .first();

    await draftRequestMenuButton.waitFor({ state: 'visible', timeout: 15000 }); // انتظار برای بارگذاری لیست درخواست‌ها
    await draftRequestMenuButton.click();
    console.log('✅ منوی درخواست پیش‌نویس باز شد');

    // مرحله ۴: کلیک روی "قبول درخواست"
    console.log('🎯 در حال پذیرش درخواست...');
    const acceptRequestButton = this.page
      .locator(
        'button.repo-draft-request__accept-request:has-text("قبول درخواست")',
      )
      .first();

    await acceptRequestButton.waitFor({ state: 'visible', timeout: 10000 });
    await acceptRequestButton.click();
    console.log('✅ درخواست با موفقیت پذیرفته شد');

    /// مرحله ۵: ✅ کلیک روی دکمه "تایید" در دیالوگ تأیید (با کلاس دقیق)
    console.log('🎯 در حال کلیک روی دکمه "تایید" در دیالوگ...');
    const confirmButton = this.page
      .locator('button.dialog-footer__submit-button:has-text("تایید")')
      .first();

    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmButton.click();
    console.log('✅ دکمه "تایید" با موفقیت کلیک شد');

    // ✅ تأیید موفقیت‌آمیز بودن عملیات با توست
    console.log('🔍 در انتظار نمایش توست موفقیت...');
    const successToast = this.page.locator(
      '.Toastify__toast--success .Toastify__toast-body',
    );
    await expect(successToast).toBeVisible({ timeout: 10000 });
    await expect(successToast).toContainText(/با موفقیت|تایید شد/);
    console.log('✅ توست موفقیت نمایش داده شد');
  }
}
