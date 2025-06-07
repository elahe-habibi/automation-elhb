import { expect, Page } from '@playwright/test';
import path from 'path';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class FilemanageRepository {
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
      .nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const fileManagementButton = this.page.locator(
      '.repo-menu__item--file-management'
    );
    await expect(fileManagementButton).toBeVisible();
    await fileManagementButton.click();
    await this.page.waitForTimeout(3000);
  }

  /**
   * آپلود تصویر سفارشی برای مخزن
   * @param imagePath مسیر تصویر
   */
  async uploadCustomRepository(imagePath: string) {
    try {
      // انتظار برای اطمینان از لود شدن دیالوگ آپلود
      await this.page.waitForTimeout(8000);

      // آپلود تصویر
      const fileInput = this.page.locator('#file-upload');
      const absolutePath = path.resolve(__dirname, '../../assets/picture.jpg');
      await fileInput.setInputFiles(absolutePath);

      // انتظار برای اطمینان از تکمیل آپلود
      await this.page.waitForTimeout(3000);

      // کلیک روی دکمه تایید
      const confirmButton = this.page.locator(
        '.dialog-content__submit.lib-btn.lib-modal-btn-success'
      );
      await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
      await expect(confirmButton).toBeEnabled();
      await confirmButton.click();
      await this.page.waitForTimeout(2000);

      // انتخاب اولین تصویر از لیست
      const firstRecord = this.page
        .locator('.hover\\:cls-bg-\\[\\#F1EDF7\\]')
        .first();
      await firstRecord.waitFor({ state: 'visible', timeout: 10000 });
      await expect(firstRecord).toBeEnabled();
      await firstRecord.click();
      await this.page.waitForTimeout(2000);

      // کلیک روی دکمه افزودن
      const addButton = this.page.locator('.dialog-footer__submit-button');
      await addButton.waitFor({ state: 'visible', timeout: 10000 });
      await expect(addButton).toBeEnabled();
      await addButton.click();
      await this.page.waitForTimeout(2000);

      // انتظار برای اطمینان از تکمیل عملیات
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
    } catch (error) {
      console.error('خطا در آپلود تصویر سفارشی:', error);
      throw error;
    }

    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const fileManagementButton = this.page.locator(
      '.repo-menu__item--file-management'
    );
    await expect(fileManagementButton).toBeVisible();
    await fileManagementButton.click();
    await this.page.waitForTimeout(3000);
  }
}
