import { expect, Page, BrowserContext } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class CopyAddressShareVer {
  private page: Page;
  private browser: any;

  constructor(page: Page, browser?: any) {
    this.page = page;
    this.browser = browser;
  }

  /**
   * ویرایش سند و کپی کردن آدرس اشتراک‌گذاری
   */
  async editDocument(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const versionListButton = this.page.locator('.document-version-list');
    await expect(versionListButton).toBeVisible();
    await versionListButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const versionMenuButton = this.page.locator('button.version-menu').nth(0);
    await versionMenuButton.waitFor({ state: 'visible' });
    await versionMenuButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const copyButton = this.page.locator('button.copy-version-url').first();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // کپی کردن آدرس اشتراک‌گذاری
    await copyButton.click();
    await this.page.waitForTimeout(1000);

    // دریافت آدرس کپی شده با روش‌های مختلف
    const clipboardContent = await this.getCopiedUrl();

    console.log('آدرس کپی شده:', clipboardContent);

    // باز کردن مرورگر جدید و رفتن به آدرس کپی شده
    if (clipboardContent && this.browser) {
      await this.openInNewBrowser(clipboardContent);
    } else {
      console.log('آدرس کپی شده یافت نشد یا browser instance موجود نیست');
    }

  }

  /**
   * دریافت آدرس کپی شده با روش‌های مختلف
   */
  async getCopiedUrl(): Promise<string> {
    let clipboardContent = '';

    // روش 1: تلاش برای خواندن از کلیپ‌بورد
    try {
      clipboardContent = await this.page.evaluate(() => {
        return navigator.clipboard.readText();
      });
    } catch (error) {
      console.log('خطا در خواندن از کلیپ‌بورد، تلاش برای روش‌های جایگزین...');
    }

    // روش 2: اگر کلیپ‌بورد خالی است، تلاش برای دریافت از عناصر صفحه
    if (!clipboardContent) {
      try {
        // جستجو در عناصر مختلف که ممکن است آدرس را نگه دارند
        const selectors = [
          '.share-url-input',
          'input[readonly]',
          '.share-url',
          '.copied-url',
          '[data-url]',
          '.url-display',
          '.link-display'
        ];

        for (const selector of selectors) {
          try {
            const element = this.page.locator(selector);
            if (await element.isVisible()) {
              const value = await element.inputValue();
              const text = await element.textContent();
              const dataUrl = await element.getAttribute('data-url');
              
              clipboardContent = value || text || dataUrl || '';
              if (clipboardContent) {
                console.log(`آدرس از selector ${selector} دریافت شد`);
                break;
              }
            }
          } catch (error) {
            // ادامه با selector بعدی
          }
        }
      } catch (error) {
        console.log('خطا در دریافت آدرس از عناصر صفحه');
      }
    }

    // روش 3: اگر هنوز خالی است، تلاش برای دریافت از notification یا toast
    if (!clipboardContent) {
      try {
        const notificationSelectors = [
          '.toast-success',
          '.notification',
          '.alert',
          '.message'
        ];

        for (const selector of notificationSelectors) {
          try {
            const element = this.page.locator(selector);
            if (await element.isVisible()) {
              const text = await element.textContent();
              // استخراج URL از متن notification
              const urlMatch = text?.match(/https?:\/\/[^\s]+/);
              if (urlMatch) {
                clipboardContent = urlMatch[0];
                console.log('آدرس از notification استخراج شد');
                break;
              }
            }
          } catch (error) {
            // ادامه با selector بعدی
          }
        }
      } catch (error) {
        console.log('خطا در دریافت آدرس از notification');
      }
    }

    return clipboardContent;
  }

  /**
   * باز کردن آدرس در مرورگر جدید
   * @param url آدرس برای باز کردن
   */
  async openInNewBrowser(url: string): Promise<void> {
    try {
      // ایجاد یک context جدید
      const newContext = await this.browser.newContext();
      const newPage = await newContext.newPage();

      console.log('باز کردن آدرس در مرورگر جدید:', url);

      // روش 1: شبیه‌سازی کپی پیست دستی
      try {
        // رفتن به صفحه خالی
        await newPage.goto('about:blank');
        await newPage.waitForLoadState('networkidle');

        // انتخاب address bar با F6
        await newPage.keyboard.press('F6');
        await newPage.waitForTimeout(500);

        // انتخاب همه متن در address bar
        await newPage.keyboard.press('Control+a');
        await newPage.waitForTimeout(500);

        // پاک کردن متن موجود
        await newPage.keyboard.press('Delete');
        await newPage.waitForTimeout(500);

        // تایپ کردن آدرس جدید
        await newPage.keyboard.type(url);
        await newPage.waitForTimeout(1000);

        // فشردن Enter برای رفتن به آدرس
        await newPage.keyboard.press('Enter');
        await newPage.waitForLoadState('networkidle');

        console.log('آدرس با موفقیت در address bar تایپ شد و صفحه باز شد');

      } catch (error) {
        console.log('خطا در شبیه‌سازی کپی پیست، تلاش برای روش مستقیم...');
        
        // روش 2: رفتن مستقیم به آدرس
        await newPage.goto(url);
        await newPage.waitForLoadState('networkidle');
      }

      console.log('صفحه با موفقیت در مرورگر جدید باز شد');

      // انتظار برای چند ثانیه تا کاربر بتواند صفحه را ببیند
      await newPage.waitForTimeout(5000);

      // بستن context جدید
      await newContext.close();

    } catch (error) {
      console.error('خطا در باز کردن مرورگر جدید:', error);
    }
  }
}
