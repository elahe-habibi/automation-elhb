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

 
    /**
   * انتخاب اولین مخزن در لیست
   */
  async selectFirstRepository(): Promise<void> {
    await this.page.waitForSelector('.repo-card', { timeout: 10000 });

    const firstRepo = this.page.locator('.repo-card').first();
    await expect(firstRepo).toBeVisible();
    await firstRepo.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای
  }

  /**
   * تست ایجاد دسته‌بندی با مقدار نامعتبر در فیلد order (عدد منفی)
   */
  async createCategoryWithInvalidOrder(): Promise<void> {
    // باز کردن دیالوگ ایجاد دسته‌بندی
    const createButton = this.page.getByRole('button', { name: 'ایجاد' });
    await this.waitUtils.stableClick(createButton);

    const createCategoryButton = this.page.locator('.create-category');
    await this.waitUtils.stableClick(createCategoryButton);

    // پر کردن نام معتبر (برای جلوگیری از خطاهای دیگر)
    const validName = `دسته‌بندی-تست-${Date.now()}`;
    const nameInput = this.page.locator('.category-create-dialog__form-name');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(validName);

    // ✅ پر کردن فیلد order با مقدار نامعتبر (عدد منفی)
    const orderInput = this.page.locator('.category-create-dialog__form-order');
    await expect(orderInput).toBeVisible();
    await orderInput.fill('-1'); // عدد منفی برای تریگر خطا

    // پر کردن توضیحات
    const descriptionInput = this.page.locator('.category-create-dialog__form-description');
    await expect(descriptionInput).toBeVisible();
    await descriptionInput.fill('توضیحات تستی برای order نامعتبر');

    // ✅ کلیک روی دکمه ایجاد برای تریگر اعتبارسنجی
    const submitButton = this.page.locator('.dialog-footer__submit-button');
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // ✅ تأیید نمایش خطا (بدون وابستگی به کد پویا cl-47)
    console.log('🔍 در انتظار نمایش خطا برای order نامعتبر...');
    await expect(
      this.page.getByText(/فیلد order از نوع عدد بزرگتر از 0 میباشد/) // ریجکس انعطاف‌پذیر
    ).toBeVisible({ timeout: 10000 });
    console.log('✅ خطا تأیید شد: "فیلد order از نوع عدد بزرگتر از 0 میباشد"');

    // بستن دیالوگ با دکمه انصراف
    const cancelButton = this.page.locator('button:has-text("انصراف")').first();
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    console.log('✅ دیالوگ خطا بسته شد');
  }
}