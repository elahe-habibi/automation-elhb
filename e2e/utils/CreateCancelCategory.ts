import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../constants';
import { WaitUtils } from './waitutils';

/**
 * کلاس مدیریت دسته‌بندی‌ها در سیستم
 * این کلاس شامل توابع مورد نیاز برای مدیریت دسته‌بندی‌هاست
 */
export class CategoryManager {
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
    await this.page.goto(getFullUrl(URLs.DASHBOARD));
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000); // تاخیر ۲ ثانیه‌ای
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
   * کلیک روی دکمه ایجاد و ایجاد دسته‌بندی جدید
   */
  async clickCreateButton(): Promise<void> {
    const createButton = this.page.getByRole('button', { name: 'ایجاد' });
    await this.waitUtils.stableClick(createButton);

    const createCategoryButton = this.page.locator('.create-category');
    await this.waitUtils.stableClick(createCategoryButton);

    // مقدار یونیک برای نام دسته‌بندی
    const uniqueCategoryName = `دسته‌بندی-تست-${Date.now()}`;

    // پر کردن فیلد "نام دسته‌بندی"
    const nameInput = this.page.locator('.category-create-dialog__form-name');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(uniqueCategoryName);

    // پر کردن فیلد "اولویت دسته‌بندی"
    const orderInput = this.page.locator('.category-create-dialog__form-order');
    await expect(orderInput).toBeVisible();
    await orderInput.fill('1');

    // پر کردن فیلد "توضیحات دسته‌بندی"
    const descriptionInput = this.page.locator(
      '.category-create-dialog__form-description'
    );
    await expect(descriptionInput).toBeVisible();
    await descriptionInput.fill(
      'این یک دسته‌بندی تستی برای بررسی عملکرد Playwright است.'
    );

    const cancelButton = this.page.locator('button.cancel-button');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    await this.page.waitForTimeout(6000);

  }

  /**
   * بررسی نمایش فرم دسته‌بندی
   * @returns آیا فرم دسته‌بندی نمایش داده می‌شود
   */
  async isCategoryFormVisible(): Promise<boolean> {
    const categoryForm = this.page
      .locator('form')
      .filter({ hasText: 'دسته‌بندی' });
    return await categoryForm.isVisible();
  }
}
