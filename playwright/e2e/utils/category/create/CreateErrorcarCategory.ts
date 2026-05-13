import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../../../constants';
import { WaitUtils } from '../../core/waitutils';

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
     // باز کردن منوی ایجاد
     const createButton = this.page.getByRole('button', { name: 'ایجاد' });
     await this.waitUtils.stableClick(createButton);
 
     // باز کردن دیالوگ دسته‌بندی
     const createCategoryButton = this.page.locator('.create-category');
     await this.waitUtils.stableClick(createCategoryButton);
 
     // وارد کردن نام با کاراکترهای غیرمجاز
     const invalidName = 'دسته‌بندی*//\\<>';
     const nameInput = this.page.locator('.category-create-dialog__form-name');
     await expect(nameInput).toBeVisible();
     await nameInput.fill(invalidName);
 
     // ✅ تأیید نمایش پیام خطا (بدون کلیک دکمه ایجاد)
     console.log('🔍 در انتظار نمایش خطا برای کاراکترهای غیرمجاز...');
     const errorMessage = this.page.getByText('نام دسته بندی شامل کاراکتر غیرمجاز است');
     await expect(errorMessage).toBeVisible({ timeout: 5000 });
     console.log('✅ خطا تأیید شد: "نام دسته بندی شامل کاراکتر غیرمجاز است"');
 
     // ✅ تأیید غیرفعال بودن دکمه ایجاد (الزامی نیست اما بهتر است)
     const submitButton = this.page.locator('.dialog-footer__submit-button');
     await expect(submitButton).toBeDisabled({ timeout: 3000 });
     console.log('✅ دکمه "ایجاد" به درستی غیرفعال است');
 
     // بستن دیالوگ با دکمه انصراف
     const cancelButton = this.page.locator('button.cancel-button');
     await expect(cancelButton).toBeVisible();
     await cancelButton.click();
     console.log('✅ دیالوگ با موفقیت بسته شد');
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
