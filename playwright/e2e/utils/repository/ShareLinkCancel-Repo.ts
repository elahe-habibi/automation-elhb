import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class EditRepositoryShareLink {
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
    await this.page.waitForSelector('.repo-card', { timeout: 10000 });

    const firstRepo = this.page.locator('.repo-card').first();
    await firstRepo.click();
    await this.page.waitForLoadState('networkidle');

    // اضافه کردن تاخیر برای اطمینان از بارگذاری کامل صفحه
    await this.page.waitForTimeout(2000);
  }

  /**
   * ایجاد لینک اشتراک‌گذاری با نقش مشخص
   * @param roleIndex - ایندکس نقش (0 تا 3)
   */
  async createShareLinkWithRole(roleIndex: number): Promise<void> {
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(roleIndex);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await this.page.waitForTimeout(2000);

    const shareButton = this.page.locator('.repo-menu__item--share');
    await expect(shareButton).toBeVisible();
    await shareButton.click();

    await this.page.waitForTimeout(2000);

    const linkTab = this.page
      .locator('.items-center.justify-center.text-center.cursor-pointer')
      .nth(2);
    await expect(linkTab).toBeVisible();
    await linkTab.click();

    await this.page.waitForTimeout(2000);

    const createLinkButton = this.page
      .locator('.repo-link-wrapper__create-link-button')
      .nth(roleIndex);
    await expect(createLinkButton).toBeVisible();
    await createLinkButton.click();

    await this.page.waitForTimeout(2000);

    // تنظیم رمز عبور
    const passwordCheckbox = this.page
      .locator('input.peer[type="checkbox"]')
      .nth(0);
    await expect(passwordCheckbox).toBeVisible();
    await passwordCheckbox.click();

    await this.page.waitForTimeout(2000);

    const passwordField = this.page.locator('input[type="password"]');
    await expect(passwordField).toBeVisible();
    await passwordField.fill('123456789');

    // تنظیم تاریخ انقضا
    const expirationCheckbox = this.page
      .locator('input[type="checkbox"].peer')
      .nth(1);
    await expect(expirationCheckbox).toBeVisible();
    await expirationCheckbox.click();

    const dateField = this.page.locator('.datePicker__input');
    await expect(dateField).toBeVisible();
    await dateField.click();

    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const nextDayValue = nextDay.toDateString();

    const nextDayButton = this.page.locator(
      `button[data-value*="${nextDayValue}"]`,
    );
    await expect(nextDayButton).toBeVisible();
    await nextDayButton.click();

    await this.page.waitForTimeout(3000);

    const cancelButton = this.page.locator('button.cancel-button');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    await this.page.waitForTimeout(3000);
  }

  // برای سازگاری با کد قبلی، متد قبلی را حفظ می‌کنیم
  async clickDropdownButton(): Promise<void> {
    await this.createShareLinkWithRole(0);
  }

  async shareLinkRepo(): Promise<void> {
    // ... existing code ...
  }
}
