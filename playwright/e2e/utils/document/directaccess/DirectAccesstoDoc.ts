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
    await usernameInput.fill('hbrs');

    const addButton = this.page.locator('.direct-access-form__add');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(addButton).toBeVisible();

    // کلیک روی دکمه "افزودن"
    await addButton.click();

    await this.page.waitForTimeout(10000);

    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

  /**
   * ویرایش سند
   */
  async deletedirectaccess(): Promise<void> {
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
    await usernameInput.fill('mmohsen');

    const addButton = this.page.locator('.direct-access-form__add');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(addButton).toBeVisible();

    // کلیک روی دکمه "افزودن"
    await addButton.click();

    await this.page.waitForTimeout(10000);

    await this.page.locator('button.delete-button').first().click();
  }

  /**
   * ویرایش سند
   */
  async directaccesspoduser(): Promise<void> {
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
    await usernameInput.fill('elhb699');

    const adddButton = this.page.locator('.direct-access-form__add');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(adddButton).toBeVisible();

    const addButton = this.page.locator('.direct-access-form__add');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(addButton).toBeVisible();

    await this.page.waitForTimeout(1500);

    const allToasts = await this.page
      .locator('.Toastify__toast-body')
      .allTextContents();
    console.log('ALL TOASTS >>> ', allToasts);

    const errorToast = this.page.locator('.Toastify__toast-body', { hasText: 'نام کاربری پیدا نشد' });
    if (await errorToast.isVisible().catch(() => false)) {
        console.log('Error toast detected');
    } else {
        console.log('⚠️ هیچ Toast خطایی نمایش داده نشد');
    }
    

    await this.page.waitForTimeout(10000);

    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

  /**
   * ویرایش سند
   */
  async shareDoc(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);

    const personalDocs = this.page.locator(
      '.personal-document-sidebar > button',
    );

    await expect(personalDocs).toBeVisible();
    await personalDocs.click();
    const sharedDocs = this.page.locator('.sharedDocuments button');
    await sharedDocs.click();
  }

  /**
   * ویرایش سند
   */
  async directaccesswriter(): Promise<void> {
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
    await usernameInput.fill('hbrs');

    // باز کردن dropdown
    await this.page.locator('.direct-access-form__role').click();
    // انتخاب گزینه ویرایشگر
    await this.page.locator('li[title="ویرایشگر"]').click();

    const addButton = this.page.locator('.direct-access-form__add');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(addButton).toBeVisible();

    // کلیک روی دکمه "افزودن"
    await addButton.click();

    await this.page.waitForTimeout(10000);

    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

/**
   * ویرایش سند
   */
async directaccesslist(): Promise<void> {
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
  await usernameInput.fill('hbrs');

  const adddButton = this.page.locator('.direct-access-form__add');

  // بررسی اینکه دکمه قابل مشاهده است
  await expect(adddButton).toBeVisible();

  const addButton = this.page.locator('.direct-access-form__add');

  // بررسی اینکه دکمه قابل مشاهده است
  await expect(addButton).toBeVisible();

  await this.page.waitForTimeout(1500);

 
  const toastMessage = this.page.locator('.Toastify__toast-body');
  await expect(toastMessage).toBeVisible({ timeout: 10000 });
  await expect(toastMessage).toContainText('دسترسی کاربر به سند انجام شد.', { timeout: 5000 });

  await this.page.waitForTimeout(10000);

  const closeButton = this.page.locator('button.close-button');
  await expect(closeButton).toBeVisible();
  await closeButton.click();
}


  /**
   * ویرایش سند
   */
  async directaccesseditor(): Promise<void> {
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
    await usernameInput.fill('hbrs');

    // باز کردن dropdown
    await this.page.locator('.direct-access-form__role').click();
    // انتخاب گزینه ویرایشگر
    await this.page.locator('li[title="نویسنده"]').click();

    const addButton = this.page.locator('.direct-access-form__add');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(addButton).toBeVisible();

    // کلیک روی دکمه "افزودن"
    await addButton.click();

    await this.page.waitForTimeout(10000);

    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

  /**
   * ویرایش سند
   */
  async directaccessviewer(): Promise<void> {
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
    await usernameInput.fill('hbrs');

    // باز کردن dropdown
    await this.page.locator('.direct-access-form__role').click();
    // انتخاب گزینه ویرایشگر
    await this.page.locator('li[title="مهمان"]').click();

    const addButton = this.page.locator('.direct-access-form__add');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(addButton).toBeVisible();

    // کلیک روی دکمه "افزودن"
    await addButton.click();

    await this.page.waitForTimeout(10000);

    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }
}
