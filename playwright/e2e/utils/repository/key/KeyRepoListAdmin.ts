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

    // ✅ FIX: Wait for the KEY NAME to appear in the table (real indicator of success)
    console.log('⏳ در انتظار نمایش کلید جدید در لیست...');

    // روش بهینه: انتظار برای نمایش نام کلید در جدول (داخل دیالوگ)
    const dialog = this.page.locator('div[role="dialog"]');
    await expect(dialog.getByText('کلید تستی')).toBeVisible({ timeout: 15000 });

    console.log('✅ کلید جدید با موفقیت در لیست کلیدها نمایش داده شد');

    // ✅ پیدا کردن دکمه بستن با کلاس منحصربه‌فرد
    const closeButton = this.page.locator('button.close-button');

    // انتظار برای نمایش + کلیک ایمن
    await closeButton.waitFor({ state: 'visible', timeout: 5000 });
    await closeButton.click({ delay: 100 });

    console.log('✅ دکمه بستن (close-button) با موفقیت کلیک شد');
  }

  /**
   * کلیک روی دکمه منو و ایجاد کلید جدید
   */
  async Listkey(): Promise<void> {
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

    // ✅ FIX: Wait for the KEY NAME to appear in the table (real indicator of success)
    console.log('⏳ در انتظار نمایش کلید جدید در لیست...');

    // روش بهینه: انتظار برای نمایش نام کلید در جدول (داخل دیالوگ)
    const dialog = this.page.locator('div[role="dialog"]');
    await expect(dialog.getByText('کلید تستی')).toBeVisible({ timeout: 15000 });

    console.log('✅ کلید جدید با موفقیت در لیست کلیدها نمایش داده شد');

    // ✅ پیدا کردن دکمه بستن با کلاس منحصربه‌فرد
    const closeButton = this.page.locator('button.close-button');

    // انتظار برای نمایش + کلیک ایمن
    await closeButton.waitFor({ state: 'visible', timeout: 5000 });
    await closeButton.click({ delay: 100 });

    console.log('✅ دکمه بستن (close-button) با موفقیت کلیک شد');
  }
}
