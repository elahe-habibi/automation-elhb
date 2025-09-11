import { expect, Page } from '@playwright/test';
import { WaitUtils } from '../core/waitutils';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class CreatePrivateFeedsRepository {
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
   * کلیک روی دکمه منو
   */
  async clickDropdownButton(): Promise<void> {
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const shareButton = this.page.locator('.repo-menu__item--share');
    await expect(shareButton).toBeVisible();
    await shareButton.click();

    const publishTab = this.page.locator('[role="tab"][data-value="انتشار"]');
    await expect(publishTab).toBeVisible();
    await publishTab.click();

    await this.page.waitForTimeout(3000);

    const createButton = this.page.locator(
      '.repo-create-publish-link__create-button',
    );
    await expect(createButton).toBeVisible();
    await createButton.click();

    await this.page.locator('button.close-button svg').click();
  }

  async createPrivateNewsletter(
    title: string,
    content: string,
    link: string,
  ): Promise<void> {
    await this.page.waitForTimeout(3000);

    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const privateFeedButton = this.page.locator(
      '.repo-menu__item--private-feed',
    );
    await expect(privateFeedButton).toBeVisible();
    await privateFeedButton.click();

    // پر کردن فیلد عنوان
    const titleInput = this.page.locator('input[name="name"]');
    await expect(titleInput).toBeVisible();
    await titleInput.fill(title);

    // پر کردن فیلد متن خبرنامه
    const contentInput = this.page.locator('textarea[name="content"]');
    await expect(contentInput).toBeVisible();
    await contentInput.fill(content);

    // وارد کردن لینک
    const linkInput = this.page.locator('input[name="link"]');
    await expect(linkInput).toBeVisible();
    await linkInput.fill(link);

    await this.page.waitForTimeout(4000);

    const newsletterImageButton = this.page
      .locator('button img[alt="repo-image"]')
      .first();
    await expect(newsletterImageButton).toBeVisible();
    await newsletterImageButton.click();

    // کلیک روی دکمه ثبت/ذخیره خبرنامه
    const submitButton = this.page.locator('.dialog-footer__submit-button'); // اگر ساختار مشابه متد قبلی‌ات باشه
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // صبر برای درخواست‌ها و نمایش toast موفقیت‌آمیز
    await this.page.waitForLoadState('networkidle');
    await this.waitForSuccessToast();
  }
  /**
   * انتظار برای نمایش پیام موفقیت‌آمیز
   */
  async waitForSuccessToast(): Promise<void> {
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

  // async editRepository(): Promise<void> {
  //   await this.waitUtils.waitForPageLoad();

  //   const menuButton = this.page.locator('.repository-menu button').first();
  //   await this.waitUtils.stableClick(menuButton);

  //   const editButton = this.page.locator('.edit-repository').first();
  //   await this.waitUtils.stableClick(editButton);

  //   // ... rest of the code with waitUtils ...
  // }
}
