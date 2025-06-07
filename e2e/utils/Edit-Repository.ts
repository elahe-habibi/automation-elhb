import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class EditRepository {
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

    const editButton = this.page.locator('.repo-menu__item--edit');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(editButton).toBeVisible();

    // کلیک روی دکمه "ویرایش"
    await editButton.click();
  }

  /**
   * ویرایش نام مخزن
   */
  async editRepositoryName(newName: string) {
    const nameInput = this.page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(newName);
  }

  async editRepositoryPic() {
    const imageRadioButton = this.page.locator(
      '.repo-attach-default-image__radio'
    );
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(imageRadioButton).toBeVisible();
    // کلیک روی دکمه تصویر سفارشی
    await imageRadioButton.click();

    const imageButton = this.page
      .locator('.repo-attach-default-image-item')
      .first(); // یا .nth(x) بسته به گزینه مورد نظر

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(imageButton).toBeVisible();

    // کلیک روی دکمه انتخاب‌شده
    await imageButton.click();
  }

  /**
   * ویرایش توضیحات مخزن
   */
  async editRepositoryDescription(newDescription: string) {
    const descriptionInput = this.page.locator('textarea[name="description"]');
    await expect(descriptionInput).toBeVisible();
    await descriptionInput.fill(newDescription);
  }

  /**
   * ذخیره تغییرات
   */
  async saveChanges() {
    const saveButton = this.page.locator('.dialog-footer__submit-button');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(saveButton).toBeVisible();

    // کلیک روی دکمه "ذخیره"
    await saveButton.click();

    // Wait for network requests to complete
    await this.page.waitForLoadState('networkidle');

    // Wait a bit for any animations to complete
    await this.page.waitForTimeout(1000);
  }

  /**
   * انتظار برای نمایش پیام موفقیت‌آمیز
   */
  async waitForSuccessToast() {
    try {
      // Try different possible toast selectors
      const toastSelectors = [
        '.Toastify__toast',
        '.toast-success',
        '.success-toast',
        '[role="alert"]',
        '.notification',
      ];

      // Wait for any of the possible toast elements
      for (const selector of toastSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
          console.log(`Found toast with selector: ${selector}`);
          return;
        } catch (e) {
          continue;
        }
      }

      // If we get here, no toast was found
      console.log('No toast notification found. Checking page content:');
      const pageContent = await this.page.content();
      console.log(pageContent.substring(0, 500)); // Log first 500 chars of page content

      throw new Error('No toast notification appeared after save operation');
    } catch (error) {
      console.error('Error in waitForSuccessToast:', error);
      throw error;
    }
  }
}
