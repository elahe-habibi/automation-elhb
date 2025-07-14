import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../constants';
import { WaitUtils } from './waitutils';
import path from 'path';  // Add this line
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
      '.repo-menu__item--file-management'
    );
    await expect(fileManagementButton).toBeVisible();
    await fileManagementButton.click();
  }

  /**
   * آپلود تصویر سفارشی برای مخزن
   * @param imagePath مسیر تصویر
   */
  async uploadCustomRepository(imagePath: string){

  // انتظار برای اطمینان از لود شدن دیالوگ آپلود
  await this.page.waitForTimeout(20000);

// آپلود تصویر
const fileInput = this.page.locator('#file-upload');
const absolutePath = path.resolve(__dirname, '../../assets/picture.jpg');
await fileInput.setInputFiles(absolutePath);

// انتظار برای اطمینان از تکمیل آپلود
await this.page.waitForTimeout(3000);


      // کلیک روی دکمه انصراف
      const cancelButton = this.page.locator('button.lib-modal-btn-cancel');
      await this.page.waitForTimeout(3000);

      await cancelButton.waitFor({ state: 'visible', timeout: 10000 });
      await expect(cancelButton).toBeEnabled();
      await cancelButton.click();

    } 

    async manageFiles(): Promise<void> {
      await this.waitUtils.waitForPageLoad();
  
      const menuButton = this.page.locator('.repository-menu button').first();
      await this.waitUtils.stableClick(menuButton);
  
      const fileManagementButton = this.page.locator('.file-management').first();
      await this.waitUtils.stableClick(fileManagementButton);
  
      // ... rest of the code with waitUtils ...
    }
  
  }
  

