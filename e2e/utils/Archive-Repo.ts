import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class ArchiveRepository {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * رفتن به صفحه داشبورد
   */
  async goToDashboard() {
    await this.page.goto('https://clasor-frontend.sandpod.ir/admin/dashboard');
    await this.page.waitForLoadState('networkidle');

    await this.page.waitForTimeout(2000);
  }

  /**
   * انتخاب اولین مخزن در لیست
   */
  async selectFirstRepository() {
    const firstRepo = this.page.locator('.repo-card').first();
    await firstRepo.click();
    await this.page.waitForLoadState('networkidle');

    // اضافه کردن تاخیر برای اطمینان از بارگذاری کامل صفحه
    await this.page.waitForTimeout(2000);
  }

  /**
   * کلیک روی دکمه منو
   */
  async clickDropdownButton() {
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const archiveButton = this.page.locator('.repo-menu__item--archive');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(archiveButton).toBeVisible();
    // کلیک روی دکمه "بایگانی"
    await archiveButton.click();

    await this.page.waitForTimeout(2000);

    const archiveBuutton = this.page.locator(
      '.dialog-footer__submit-button.bg-error'
    );
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(archiveBuutton).toBeVisible();
    // کلیک روی دکمه "آرشیو"
    await archiveBuutton.click();

    await this.page.waitForTimeout(2000);

    const manageReposButton = this.page.locator('button.border-b-2').nth(1);
    await expect(manageReposButton).toBeVisible();
    await manageReposButton.click();

    await this.page.waitForTimeout(2000);

    const archivedReposButton = this.page.locator('button.text-link').nth(3);
    await expect(archivedReposButton).toBeVisible();
    await archivedReposButton.click();

    await this.page.waitForTimeout(3000);
  }
}
