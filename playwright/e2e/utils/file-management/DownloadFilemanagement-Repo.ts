import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../../constants';
import { WaitUtils } from '../core/waitutils';
import path from 'path'; // Add this line
/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class FilemanageRepository {
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
  }

  /**
   * انتخاب اولین مخزن در لیست
   */
  async selectFirstRepository(): Promise<void> {
    await this.page.waitForSelector('.repo-card', { timeout: 10000 });

    const firstRepo = this.page.locator('.repo-card').first();
    await firstRepo.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * کلیک روی دکمه منو
   */
  async clickDropdownButton(): Promise<void> {
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const fileManagementButton = this.page.locator(
      '.repo-menu__item--file-management',
    );
    await expect(fileManagementButton).toBeVisible();
    await fileManagementButton.click();
  }

  /**
   * آپلود تصویر سفارشی برای مخزن
   * @param imagePath مسیر تصویر
   */
  async uploadCustomRepository(imagePath: string) {
    try {
      // انتظار برای اطمینان از لود شدن دیالوگ آپلود
      await this.page.waitForTimeout(20000);

      const fileInput = this.page.locator('#file-upload');
      await fileInput.setInputFiles(imagePath);

      // انتظار برای اطمینان از تکمیل آپلود
      await this.page.waitForTimeout(3000);

      // کلیک روی دکمه تایید
      const confirmButton = this.page.locator(
        '.dialog-content__submit.lib-btn.lib-modal-btn-success',
      );

      await this.page.waitForTimeout(3000);

      await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
      await expect(confirmButton).toBeEnabled();
      await confirmButton.click();

      // انتخاب اولین تصویر از لیست
      const firstRecord = this.page
        .locator('.hover\\:cls-bg-\\[\\#F1EDF7\\]')
        .first();
      await firstRecord.waitFor({ state: 'visible', timeout: 10000 });
      await expect(firstRecord).toBeEnabled();
      await firstRecord.click();

      await this.page.getByRole('dialog').locator('button.close-button').click();

      // کلیک روی دکمه افزودن
      const addButton = this.page.locator('.dialog-footer__submit-button');
      await addButton.waitFor({ state: 'visible', timeout: 10000 });
      await expect(addButton).toBeEnabled();
      await addButton.click();

      // انتظار برای اطمینان از تکمیل عملیات
      await this.page.waitForLoadState('domcontentloaded');
    } catch (error) {
      console.error('Error uploading custom repository image:', error);
      throw error;
    }

    // Return to file management menu
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const fileManagementButton = this.page.locator(
      '.repo-menu__item--file-management',
    );
    await expect(fileManagementButton).toBeVisible();
    await fileManagementButton.click();
  }

  async manageFiles() {
    //await this.waitUtils.waitForPageLoad();
    const menuButton = this.page.locator('.repository-menu button').first();
    console.log('Waiting for .repository-menu button to be visible...');
    //await expect(menuButton).toBeVisible({ timeout: 10000 });
    //await this.waitUtils.stableClick(menuButton);

    const fileManagementButton = this.page.locator('.file-management').first();
    //await this.waitUtils.stableClick(fileManagementButton);

    await this.page.waitForTimeout(5000);

    const dropdownTrigger = this.page
      .locator('button.cls-btn-ghost.cls-h-8.cls-w-8')
      .nth(0);
    await expect(dropdownTrigger).toBeVisible();
    await dropdownTrigger.click();

    await this.page.waitForTimeout(5000);

    const deleteBtn = this.page
      .locator('li:has(p)', { hasText: 'دانلود فایل' })
      .first();
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    await this.page.waitForTimeout(5000);

    // ... rest of the code with waitUtils ...
  }
}
