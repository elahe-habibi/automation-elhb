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
// ✅ پیدا کردن و کلیک روی دکمه "کپی کلید" با ترکیب هوشمند کلاس + متن (بهینه‌ترین روش)
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن دکمه "کپی کلید" در منو...');

// سلکتور هوشمند: ترکیب کلاس‌های پایدار + متن فارسی (برای دقت 100%)
const copyKeyButton = this.page.locator(
  // روش اصلی: کلاس‌های ثابت (rounded-md, p-2) + متن فارسی
  'button.rounded-md.p-2:has-text("کپی کلید"), ' +
  
  // پشتیبان 1: ساختار استاندارد منو با متن
  'button[role="menuitem"]:has-text("کپی کلید"), ' +
  
  // پشتیبان 2: جستجوی عمومی متن در دکمه‌های منو
  '[role="menuitem"]:has-text("کپی کلید")'
).first();

// انتظار هوشمند + کلیک ایمن
await copyKeyButton.waitFor({ state: 'visible', timeout: 10000 });
await copyKeyButton.click({ delay: 100 });
console.log('✅ دکمه "کپی کلید" با موفقیت کلیک شد');

// تأیید نمایش توست موفقیت (اختیاری - برای تست کامل)
await this.page.waitForTimeout(800);
console.log('📋 کلید با موفقیت کپی شد');

// 2. تأیید پیام موفقیت (کد جدید بالا)
await expect(
  this.page.getByText('کلید با موفقیت کپی شد', { exact: true })
).toBeVisible({ timeout: 10000 });
console.log('✅ پیام موفقیت کپی کلید تأیید شد');


  }
}
