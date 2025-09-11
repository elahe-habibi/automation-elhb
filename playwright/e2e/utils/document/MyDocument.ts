import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class DirectAccessDocument {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async LogOut(): Promise<void> {
    const menuButton = this.page.locator('.userProfile').nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await this.page.waitForTimeout(3000);

    const editButton = this.page.locator('.logout-button');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(editButton).toBeVisible();
    // کلیک روی دکمه "ویرایش"
    await editButton.click();
  }

  /**
   * ویرایش سند
   */
  async directaccess(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');

    await this.page.waitForTimeout(5000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const directAccessButton = this.page
      .locator('.document-direct-access')
      .nth(0);
    await expect(directAccessButton).toBeVisible();
    await directAccessButton.click();

    const usernameInput = this.page.locator('.direct-access-form__username');
    // بررسی اینکه فیلد قابل مشاهده است
    await expect(usernameInput).toBeVisible();
    // پر کردن فیلد با مقدار دلخواه
    await usernameInput.fill('emad.mh');

    const addButton = this.page.locator('.direct-access-form__add');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(addButton).toBeVisible();

    // کلیک روی دکمه "افزودن"
    await addButton.click();

    await this.page.waitForTimeout(5000);


    const toastMessage = this.page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 10000 });
    await expect(toastMessage).toContainText('دسترسی کاربر به سند انجام شد.', { timeout: 5000 });

    await this.page.waitForTimeout(5000);

    await this.page.locator('button.close-button').first().click(); // یا nth(i)
  }


 /**
   * ویرایش سند
   */
 async editdirectaccessdoc(): Promise<void> {
  // Wait for the page to be fully loaded
  await this.page.waitForLoadState('networkidle');

  await this.page.waitForTimeout(5000);

  await this.page.locator('div.personal-document-sidebar > button').click();

  await this.page.waitForTimeout(3000);

  await this.page.locator('div.sharedDocuments button').filter({
    has: this.page.locator('p', { hasText: 'سندهای اشتراکی' })
  }).click();
  
  await this.page.waitForTimeout(5000);

  const buttons = this.page.locator('button.document-menu');
  for (let i = 0; i < await buttons.count(); i++) {
    const btn = buttons.nth(i);
    if (await btn.isVisible()) {
      await btn.click();
      break;
    }
  }

  await this.page.waitForTimeout(3000);

  await this.page.locator('button.document-version-list').click();

  await this.page.waitForTimeout(5000);

 }
}
