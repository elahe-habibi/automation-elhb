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
 * باز کردن دیالوگ مدیریت کلیدهای مخزن
 */
async openKeysDialog(): Promise<void> {
  // باز کردن منوی مخزن
  const menuButton = this.page
    .locator('.repoInformationTab.repoActions button')
    .nth(0);
  await expect(menuButton).toBeVisible();
  await menuButton.click();

  // کلیک روی گزینه "کلیدهای مخزن"
  const repoKeysButton = this.page.locator('.repo-menu__item--keys');
  await expect(repoKeysButton).toBeVisible();
  await repoKeysButton.click();
}

/**
 * ایجاد کلید جدید با نام مشخص (با موفقیت)
 */
async createRepositoryKey(keyName: string): Promise<void> {
  // کلیک روی دکمه "ایجاد کلید"
  const createKeyButton = this.page.locator('.repo-key-dialog__create-button');
  await expect(createKeyButton).toBeVisible({ timeout: 10000 });
  await createKeyButton.click();

  // پر کردن نام کلید
  const keyNameField = this.page.locator('.repo-key-create-dialog__input');
  await expect(keyNameField).toBeVisible({ timeout: 10000 });
  await keyNameField.fill(keyName);

  // تولید کلید
  const generateKeyButton = this.page.locator('.repo-key__generate-button');
  await expect(generateKeyButton).toBeVisible({ timeout: 10000 });
  await generateKeyButton.click();

  // تأیید ایجاد
  const createButton = this.page.locator('.dialog-footer__submit-button');
  await expect(createButton).toBeVisible({ timeout: 10000 });
  await createButton.click();

  // ✅ تأیید نمایش کلید در لیست (موفقیت‌آمیز)
  await expect(this.page.getByText(keyName)).toBeVisible({ timeout: 15000 });
  console.log(`✅ کلید "${keyName}" با موفقیت ایجاد شد`);
}

/**
 * تلاش برای ایجاد کلید تکراری و بررسی خطا
 */
async createDuplicateKeyAndVerifyError(duplicateKeyName: string): Promise<void> {
  // باز کردن فرم ایجاد کلید مجدد
  const createKeyButton = this.page.locator('.repo-key-dialog__create-button');
  await expect(createKeyButton).toBeVisible({ timeout: 10000 });
  await createKeyButton.click();

  // وارد کردن نام تکراری
  const keyNameField = this.page.locator('.repo-key-create-dialog__input');
  await expect(keyNameField).toBeVisible({ timeout: 10000 });
  await keyNameField.fill(duplicateKeyName);

  // تولید کلید
  const generateKeyButton = this.page.locator('.repo-key__generate-button');
  await expect(generateKeyButton).toBeVisible({ timeout: 10000 });
  await generateKeyButton.click();

  // کلیک روی دکمه ایجاد (باید خطا بدهد)
  const createButton = this.page.locator('.dialog-footer__submit-button');
  await expect(createButton).toBeVisible({ timeout: 10000 });
  await createButton.click();

  // ✅ تأیید نمایش خطا (بدون وابستگی به کد دقیق خطا)
  console.log('🔍 در انتظار نمایش خطا برای کلید تکراری...');
  await expect(
    this.page.getByText(/تکراری|تکرار|وجود دارد/) // ریجکس انعطاف‌پذیر برای پوشش متون مختلف فارسی
  ).toBeVisible({ timeout: 10000 });
  console.log('✅ خطا برای کلید تکراری با موفقیت نمایش داده شد');

  // بستن دیالوگ ایجاد کلید با دکمه "انصراف"
  const cancelButton = this.page.locator('button:has-text("انصراف")').first();
  await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
  await cancelButton.click();
}
}
