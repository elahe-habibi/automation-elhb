import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../constants';

/**
 * کلاس مدیریت دسته‌بندی‌ها در سیستم
 * این کلاس شامل توابع مورد نیاز برای مدیریت دسته‌بندی‌هاست
 */
export class CategoryManager {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * رفتن به صفحه داشبورد
   */
  async goToDashboard() {
    await this.page.goto(getFullUrl(URLs.DASHBOARD));
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * انتخاب اولین مخزن در لیست
   */
  async selectFirstRepository() {
    const firstRepo = this.page.locator('.repo-card').first();
    await firstRepo.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * کلیک روی دکمه ایجاد
   */
  async clickCreateButton() {
    const createButton = this.page.getByRole('button', { name: 'ایجاد' });
    await createButton.click();
    const createCategoryButton = this.page.locator('.create-category');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(createCategoryButton).toBeVisible();
    // کلیک روی دکمه "ایجاد دسته‌بندی"
    await createCategoryButton.click();

    // مقدار یونیک برای نام دسته‌بندی
    const uniqueCategoryName = `دسته‌بندی-تست-${Date.now()}`;

    // پر کردن فیلد "نام دسته‌بندی"
    await this.page.fill('.category-create-dialog__form-name', uniqueCategoryName);

    // پر کردن فیلد "اولویت دسته‌بندی"
    await this.page.fill('.category-create-dialog__form-order', '1');

    // پر کردن فیلد "توضیحات دسته‌بندی"
    await this.page.fill('.category-create-dialog__form-description', 'این یک دسته‌بندی تستی برای بررسی عملکرد Playwright است.');

    // ارسال فرم (اگر دکمه ذخیره وجود دارد، آن را کلیک کن)
    const saveButton = this.page.locator('.dialog-footer__submit-button');
    await expect(saveButton).toBeVisible();
    await saveButton.click();
  }

  /**
   * بررسی نمایش فرم دسته‌بندی
   * @returns آیا فرم دسته‌بندی نمایش داده می‌شود
   */
  async isCategoryFormVisible() {
    const categoryForm = this.page.locator('form').filter({ hasText: 'دسته‌بندی' });
    return await categoryForm.isVisible();
  }
}