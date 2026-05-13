import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class EditCategory {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش دسته‌بندی
   */
  async editCategory(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    await this.page.reload();

    await this.page.waitForTimeout(5000);


    await this.page.waitForSelector('.category-menu', { state: 'visible' });
    const menuButton = this.page.locator('.category-menu button').first();
    await expect(menuButton).toBeVisible();
    await menuButton.click();


    // const menuButton = this.page.locator('.category-menu button').nth(0);
    // await expect(menuButton).toBeVisible();
    // await menuButton.click();

    await this.page.waitForTimeout(2000);

    const editCategoryButton = this.page.locator('.edit-category');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(editCategoryButton).toBeVisible();

    // کلیک روی دکمه "ویرایش دسته‌بندی"
    await editCategoryButton.click();
    await this.page.waitForTimeout(2000);

    // انتخاب فیلد "نام دسته‌بندی" و پر کردن مقدار آن
    const categoryNameInput = this.page.locator(
      '.category-edit-dialog__form-name',
    );
    await expect(categoryNameInput).toBeVisible();
    await categoryNameInput.fill('نام جدید دسته‌بندی');
    await this.page.waitForTimeout(2000);

    // انتخاب فیلد "اولویت دسته‌بندی" و پر کردن مقدار آن
    const categoryOrderInput = this.page.locator(
      '.category-edit-dialog__form-order',
    );
    await expect(categoryOrderInput).toBeVisible();
    await categoryOrderInput.fill('11');
    await this.page.waitForTimeout(2000);

    // انتخاب فیلد "توضیحات دسته‌بندی" و پر کردن مقدار آن
    const categoryDescriptionInput = this.page.locator(
      '.category-edit-dialog__form-description',
    );
    await expect(categoryDescriptionInput).toBeVisible();
    await categoryDescriptionInput.fill('این دسته‌بندی برای محصولات جدید است.');
    await this.page.waitForTimeout(2000);

    const editButton = this.page.locator('.dialog-footer__submit-button');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(editButton).toBeVisible();
    // کلیک روی دکمه "ویرایش"
    await editButton.click();
  }
}
