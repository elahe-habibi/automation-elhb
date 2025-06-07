import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class KeyRepository {
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

    const repoKeysButton = this.page.locator('.repo-menu__item--keys');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(repoKeysButton).toBeVisible();
    // کلیک روی دکمه "کلیدهای مخزن"
    await repoKeysButton.click();

    await this.page.waitForTimeout(2000);

    const createKeyButton = this.page.locator(
      '.repo-key-dialog__create-button'
    );
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(createKeyButton).toBeVisible();
    // کلیک روی دکمه "ایجاد کلید"
    await createKeyButton.click();

    // انتخاب فیلد نام کلید و پر کردن مقدار
    const keyNameField = this.page.locator('.repo-key-create-dialog__input');
    await expect(keyNameField).toBeVisible();
    await keyNameField.fill('کلید تستی');
    // کلیک روی دکمه "تولید کلید"
    const generateKeyButton = this.page.locator('.repo-key__generate-button');
    await expect(generateKeyButton).toBeVisible();
    await generateKeyButton.click();

    await this.page.waitForTimeout(2000);

    const createButton = this.page.locator('.dialog-footer__submit-button');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(createButton).toBeVisible();

    // کلیک روی دکمه "ایجاد"
    await createButton.click();

    await this.page.waitForTimeout(3000);
  }
}
