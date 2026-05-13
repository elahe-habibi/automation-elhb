import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../../../constants';
import { WaitUtils } from '../../core/waitutils';

export class CategoryManager {
  private page: Page;
  private waitUtils: WaitUtils;

  constructor(page: Page) {
    this.page = page;
    this.waitUtils = new WaitUtils(page);
  }

  async goToDashboard(): Promise<void> {
    await this.page.goto(getFullUrl(URLs.DASHBOARD));
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectFirstRepository(): Promise<void> {
    await this.page.waitForSelector('.repo-card', { timeout: 10000 });
    const firstRepo = this.page.locator('.repo-card').first();
    await expect(firstRepo).toBeVisible();
    await firstRepo.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * ایجاد دسته‌بندی با نام مشخص (موفقیت‌آمیز)
   */
  async createCategory(
    name: string,
    order: string = '1',
    description: string = 'توضیحات تستی'
  ): Promise<void> {
    // باز کردن منوی ایجاد
    const createButton = this.page.getByRole('button', { name: 'ایجاد' });
    await this.waitUtils.stableClick(createButton);

    // باز کردن دیالوگ دسته‌بندی
    const createCategoryButton = this.page.locator('.create-category');
    await this.waitUtils.stableClick(createCategoryButton);

    // پر کردن فیلدها
    const nameInput = this.page.locator('.category-create-dialog__form-name');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(name);

    const orderInput = this.page.locator('.category-create-dialog__form-order');
    await expect(orderInput).toBeVisible();
    await orderInput.fill(order);

    const descriptionInput = this.page.locator('.category-create-dialog__form-description');
    await expect(descriptionInput).toBeVisible();
    await descriptionInput.fill(description);

    // ✅ ذخیره دسته‌بندی (نه لغو!)
    const submitButton = this.page.locator('.dialog-footer__submit-button');
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // تأیید موفقیت‌آمیز بودن عملیات
    await expect(
      this.page.getByText('دسته بندی با موفقیت ایجاد شد')
    ).toBeVisible({ timeout: 10000 });
    
    console.log(`✅ دسته‌بندی "${name}" با موفقیت ایجاد شد`);
  }

  /**
   * تلاش برای ایجاد دسته‌بندی تکراری و بررسی خطا
   */

async createDuplicateCategoryAndVerifyError(duplicateName: string): Promise<void> {
  // باز کردن دیالوگ ایجاد دسته‌بندی مجدد
  const createButton = this.page.getByRole('button', { name: 'ایجاد' });
  await this.waitUtils.stableClick(createButton);

  const createCategoryButton = this.page.locator('.create-category');
  await this.waitUtils.stableClick(createCategoryButton);

  // وارد کردن نام تکراری
  const nameInput = this.page.locator('.category-create-dialog__form-name');
  await expect(nameInput).toBeVisible();
  await nameInput.fill(duplicateName);

  // پر کردن سایر فیلدها (الزامی برای فعال شدن دکمه ایجاد)
  const orderInput = this.page.locator('.category-create-dialog__form-order');
  await orderInput.fill('2');

  const descriptionInput = this.page.locator('.category-create-dialog__form-description');
  await descriptionInput.fill('توضیحات دوم');

  // ✅ کلیک روی دکمه "ایجاد" برای تریگر اعتبارسنجی (نکته حیاتی!)
  const submitButton = this.page.locator('.dialog-footer__submit-button');
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  // ✅ تأیید نمایش خطا پس از کلیک
  console.log('🔍 در انتظار نمایش خطا برای دسته‌بندی تکراری...');
  await expect(
    this.page.getByText(/عنوان نمی تواند تکراری باشد/) // ریجکس انعطاف‌پذیر
  ).toBeVisible({ timeout: 10000 });
  console.log('✅ خطا تأیید شد: "عنوان نمی تواند تکراری باشد"');

  // بستن دیالوگ با دکمه انصراف (با سلکتور مطمئن‌تر)
  const cancelButton = this.page.locator('button:has-text("انصراف")').first();
  await expect(cancelButton).toBeVisible();
  await cancelButton.click();
  console.log('✅ دیالوگ خطا بسته شد');

  }
}