import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class DeleteRepository {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * رفتن به صفحه داشبورد
   */
  async goToDashboard(): Promise<void> {
    await this.page.goto('https://clasor-frontend.sandpod.ir/admin/dashboard');
    await this.page.waitForLoadState('networkidle');

    await this.page.waitForTimeout(2000);
  }

  /**
   * انتخاب اولین مخزن در لیست
   */
  async selectFirstRepository(): Promise<void> {
    const firstRepo = this.page.locator('.repo-card').first();
    await firstRepo.click();
    await this.page.waitForLoadState('networkidle');

    // اضافه کردن تاخیر برای اطمینان از بارگذاری کامل صفحه
    await this.page.waitForTimeout(2000);
  }

  /**
   * کلیک روی دکمه منو
   */
  async clickDropdownButton(): Promise<void> {
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await this.page.waitForTimeout(2000);

    const deleteButton = this.page.locator('.repo-menu__item--delete');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(deleteButton).toBeVisible();

    // کلیک روی دکمه "حذف"
    await deleteButton.click();

    await this.page.waitForTimeout(3000);
    // دریافت مقدار از عنصر تأیید (متن داخل strong)
    // دریافت مقدار متن از داخل strong
    const nameValue = await this.page.locator('strong').innerText();
    // انتخاب فیلد ورودی و تایپ مقدار دریافت‌شده
    const inputField = this.page.locator('input[name="name"]');
    await expect(inputField).toBeVisible();
    await inputField.fill(nameValue);

    await this.page.waitForTimeout(3000);

    const deleteBuutton = this.page.locator(
      '.dialog-footer__submit-button.bg-error'
    );
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(deleteBuutton).toBeVisible();
    // کلیک روی دکمه "حذف"
    await deleteBuutton.click();

    await this.page.waitForTimeout(3000);
  }

  async deleteRepo(): Promise<void> {
    // ... existing code ...
  }
}
