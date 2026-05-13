import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../../../constants';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class KeyRepository {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * رفتن به صفحه داشبورد
   */
  async goToDashboard(): Promise<void> {
    await this.page.goto(getFullUrl(URLs.DASHBOARD));
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * انتخاب اولین مخزن در لیست
   */
  async selectFirstRepository(): Promise<void> {
    await this.page.waitForSelector('.repo-card', { timeout: 10000 });

    const firstRepo = this.page.locator('.repo-card').first();
    await firstRepo.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * کلیک روی دکمه منو و ایجاد کلید جدید
   */
  async clickDropdownButton(): Promise<void> {
    // Open menu
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // Click on repository keys button
    const repoKeysButton = this.page.locator('.repo-menu__item--keys');
    await expect(repoKeysButton).toBeVisible();
    await repoKeysButton.click();

    // Click create key button
    const createKeyButton = this.page.locator(
      '.repo-key-dialog__create-button',
    );
    await expect(createKeyButton).toBeVisible();
    await createKeyButton.click();

    // Fill key name and generate key
    const keyNameField = this.page.locator('.repo-key-create-dialog__input');
    await expect(keyNameField).toBeVisible();
    await keyNameField.fill('کلید تستی');

    const generateKeyButton = this.page.locator('.repo-key__generate-button');
    await expect(generateKeyButton).toBeVisible();
    await generateKeyButton.click();

    // Create the key
    const createButton = this.page.locator('.dialog-footer__submit-button');
    await expect(createButton).toBeVisible();
    await createButton.click();

    // Wait for the operation to complete
    await this.page.waitForLoadState('domcontentloaded');

    await this.page.waitForTimeout(3000);

// ═════════════════════════════════════════════════════════
// ✅ پیدا کردن دکمه سه‌نقطه مربوط به کلید "کلید تستی" (با اسکوپ دقیق به ردیف کلید)
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن ردیف کلید "کلید تستی"...');

// 1. پیدا کردن ردیف حاوی کلید تستی
const keyRow = this.page.locator('tr:has-text("کلید تستی")').first();
await keyRow.waitFor({ state: 'visible', timeout: 15000 });
console.log('✅ ردیف کلید پیدا شد');

// 2. پیدا کردن دکمه سه‌نقطه فقط داخل همان ردیف کلید
console.log('🎯 در حال پیدا کردن دکمه سه‌نقطه در ردیف کلید...');
const keyMenuButton = keyRow.locator('button[aria-haspopup="menu"]').first();
await keyMenuButton.waitFor({ state: 'visible', timeout: 10000 });

// اسکرول ایمن + کلیک
await keyMenuButton.scrollIntoViewIfNeeded();
await this.page.waitForTimeout(300);
await keyMenuButton.click({ delay: 150 });
console.log('✅ دکمه سه‌نقطه کلید با موفقیت کلیک شد');

// ═════════════════════════════════════════════════════════
// انتخاب گزینه "حذف" از منوی بازشده
// ═════════════════════════════════════════════════════════
console.log('⏳ در انتظار نمایش گزینه "حذف" در منو...');
const deleteButton = this.page.locator(
  'button[role="menuitem"]:has-text("حذف"), ' +
  '[role="menuitem"]:has-text("حذف")'
).first();
await deleteButton.waitFor({ state: 'visible', timeout: 10000 });
await deleteButton.click({ delay: 100 });
console.log('✅ گزینه "حذف" با موفقیت انتخاب شد');

await this.page.waitForTimeout(2000);

// ═════════════════════════════════════════════════════════
// تأیید حذف بدون دیالوگ تأیید (بر اساس اسناپ‌شات واقعی)
// ═════════════════════════════════════════════════════════
console.log('🔍 در حال تأیید حذف موفقیت‌آمیز کلید...');
try {
  // روش اصلی: بررسی ناپدید شدن ردیف کلید
  await keyRow.waitFor({ state: 'detached', timeout: 8000 });
  console.log('✅ کلید "کلید تستی" با موفقیت حذف شد (ردیف ناپدید شد)');
} catch {
  // روش پشتیبان: جستجوی توست موفقیت
  const successToast = this.page.locator(
    ':has-text("کلید با موفقیت حذف شد"), ' +
    '.toast-success, [role="alert"]:has-text("حذف")'
  ).first();
  await successToast.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ توست موفقیت حذف کلید نمایش داده شد');
}

// بستن دیالوگ لیست کلیدها
console.log('🚪 در حال بستن دیالوگ لیست کلیدها...');
const closeDialog = this.page.locator('button.close-button').first();
if (await closeDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
  await closeDialog.click({ delay: 100 });
  console.log('✅ دیالوگ لیست کلیدها بسته شد');
}

  }
}
