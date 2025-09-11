import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class PubliclinknDocument {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش سند
   */
  async PubliclinkDoc(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const publishLinkButton = this.page
      .locator('.document-create-publish-link')
      .nth(0);
    await expect(publishLinkButton).toBeVisible();
    await publishLinkButton.click();

    const checkbox = this.page.locator('.expire-time__checkbox');
    // بررسی اینکه چک‌باکس قابل مشاهده است
    await expect(checkbox).toBeVisible();
    // انتخاب و فعال کردن چک‌باکس
    await checkbox.check();

    await this.page.waitForTimeout(5000);

    // ابتدا روی فیلد تاریخ کلیک کن تا پنجره انتخاب تاریخ باز شود
    const dateField = this.page.locator('.datePicker__input');
    await expect(dateField).toBeVisible();
    await dateField.click();

    // دریافت تاریخ فردا
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);

    // فقط روز فردا رو به عدد تبدیل می‌کنیم
    const nextDayValue = nextDay.toDateString(); // مثال: "Fri May 30 2025"
    // انتخاب دکمه روز موردنظر
    const nextDayButton = this.page.locator(
      `button[data-value*="${nextDayValue}"]`,
    );
    await expect(nextDayButton).toBeVisible();
    await nextDayButton.click();

    await this.page.waitForTimeout(5000);

    const cancelButton = this.page.locator('button.cancel-button');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    await this.page.waitForTimeout(2000);
  }
}
