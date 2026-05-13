import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class DeleteCategory {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش دسته‌بندی
   */
  async deleteCategory(): Promise<void> {
    // ✅ پیدا کردن دکمه فلش در ردیف دسته‌بندی پدر و کلیک
    const expandButton = this.page
      .locator('button.bg-transparent.h-5.w-5:has(svg.fill-icon-hover)')
      .first();

    await expandButton.waitFor({ state: 'visible', timeout: 5000 });
    await expandButton.click({ delay: 100 });

    console.log('✅ دکمه فلش (گسترش زیردسته‌بندی) با موفقیت کلیک شد');

    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    const menuButton = this.page.locator('.category-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await this.page.waitForTimeout(2000);

    const deleteCategoryButton = this.page.locator('.delete-category');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(deleteCategoryButton).toBeVisible();
    // کلیک روی دکمه "حذف دسته‌بندی"
    await deleteCategoryButton.click();

    const deleteButton = this.page.locator(
      '.dialog-footer__submit-button.bg-error',
    );
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(deleteButton).toBeVisible();
    // کلیک روی دکمه "حذف"
    await deleteButton.click();

    await this.page.waitForTimeout(2000);

    // ✅ تأیید نمایش خطا (بدون کلیک روی دکمه تأیید - خطا قبل از دیالوگ تأیید نمایش داده می‌شود)
    console.log('🔍 در انتظار نمایش خطا برای حذف دسته‌بندی با زیرمجموعه...');
    await expect(
      this.page.getByText(/ریسورس دارای زیرمجموعه است/) // ریجکس بدون وابستگی به cl-49
    ).toBeVisible({ timeout: 10000 });
    console.log('✅ خطا تأیید شد: "ریسورس دارای زیرمجموعه است"');
    
    // ✅ عدم نیاز به کلیک روی دکمه تأیید یا انصراف - خطا مستقیماً نمایش داده می‌شود
  }
}
