import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class SubCategory {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش دسته‌بندی
   */
  async subCategory() {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    const menuButton = this.page.locator('.category-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await this.page.waitForTimeout(2000);

    const createButton = this.page.locator('button[role="menuitem"]').nth(0);
    await expect(createButton).toBeVisible();
    await createButton.click();

    const createSubCategoryButton = this.page.locator('.create-category');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(createSubCategoryButton).toBeVisible();
    // کلیک روی دکمه "ساخت زیر دسته‌بندی"
    await createSubCategoryButton.click();

    // مقداردهی فیلد "نام دسته‌بندی"
    const nameField = this.page.locator('.category-create-dialog__form-name');
    await expect(nameField).toBeVisible();
    await nameField.fill('نام دسته‌بندی جدید');

    // مقداردهی فیلد "اولویت دسته‌بندی"
    const orderField = this.page.locator('.category-create-dialog__form-order');
    await expect(orderField).toBeVisible();
    await orderField.fill('1'); // مقدار اولویت (مثلاً 1)

    // مقداردهی فیلد "توضیحات دسته‌بندی"
    const descriptionField = this.page.locator(
      '.category-create-dialog__form-description'
    );
    await expect(descriptionField).toBeVisible();
    await descriptionField.fill(
      'این یک دسته‌بندی جدید است که برای تست ایجاد شده است.'
    );


    const createBuuton = this.page.locator('.dialog-footer__submit-button.bg-primary-normal');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(createBuuton).toBeVisible();
    // کلیک روی دکمه "ایجاد"
    await createBuuton.click();

    await this.page.waitForTimeout(2000);


    const firstRow = this.page.locator('.category-table-row').first();
    // بررسی اینکه رکورد قابل مشاهده است
    await expect(firstRow).toBeVisible();
    // کلیک روی اولین رکورد
    await firstRow.click();

    await this.page.waitForTimeout(5000);

  
  }
}
