import { expect, Page } from '@playwright/test';
import { WaitUtils } from '../../core/waitutils';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class EditRepository {
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
    await this.page.goto('https://clasor.pod.ir/admin/dashboard');
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
    await this.page.waitForTimeout(5000);
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

    const editButton = this.page.locator('.repo-menu__item--edit');

    // بررسی اینکه دکمه قابل مشاهده است
    await expect(editButton).toBeVisible();

    // کلیک روی دکمه "ویرایش"
    await editButton.click();
  }

  /**
   * ویرایش نام مخزن
   */
  async editRepositoryName(newName: string): Promise<void> {
    const nameInput = this.page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();

    // خواندن نام فعلی مخزن (همان نام اولیه که موقع ایجاد وارد شده)
    const originalName = await nameInput.inputValue();
    console.log('نام اولیه مخزن:', originalName);

    // پاک کردن فیلد
    await nameInput.clear();

    // وارد کردن مجدد همان نام اولیه
    await nameInput.fill(originalName);
    console.log('نام اولیه مجدد وارد شد:', originalName);
  }

  async editRepositoryPic(): Promise<void> {
    const imageRadioButton = this.page.locator(
      '.repo-attach-default-image__radio',
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
  async editRepositoryDescription(newDescription: string): Promise<void> {
    const descriptionInput = this.page.locator('textarea[name="description"]');
    await expect(descriptionInput).toBeVisible();
    await descriptionInput.fill(newDescription);
  }

  /**
   * ذخیره تغییرات
   */
  async saveChanges(): Promise<void> {
    const saveButton = this.page.locator('.dialog-footer__submit-button');

    // ۱. انتظار برای نمایش و فعال بودن دکمه
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(saveButton).toBeEnabled({ timeout: 10000 });
  
    // ۲. تریگر کردن ولیدیشن (برای شبیه‌سازی تعامل کاربر)
    const nameInput = this.page.locator('input[name="name"]');
    if (await nameInput.isVisible()) {
      await nameInput.focus();
      await this.page.keyboard.press('Tab');
    }
    await this.page.waitForTimeout(500);
  
    console.log('شروع به کلیک ۴ باره روی دکمه ذخیره...');
  
    // ۳. ✅ ۴ بار کلیک متوالی با انتظار بین هر کلیک
    for (let i = 1; i <= 4; i++) {
      console.log(`کلیک ${i} از ۴...`);
      
      // بررسی مجدد فعال بودن دکمه قبل از هر کلیک
      if (await saveButton.isEnabled()) {
        await saveButton.click();
      } else {
        console.log(`⚠️ دکمه در کلیک ${i} غیرفعال شده، ادامه کلیک‌ها متوقف شد`);
        break;
      }
      
      // انتظار کوتاه بین کلیک‌ها برای پاسخ UI
      await this.page.waitForTimeout(800);
    }
  
    // ۴. انتظار برای پایدار شدن وضعیت نهایی
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  /**
   * انتظار برای نمایش پیام موفقیت‌آمیز
   */
  async waitForSuccessToast(): Promise<void> {
    try {
      // اضافه کردن انتظار اولیه برای ظهور توست
      await this.page.waitForTimeout(1000);

      // سلکتورهای موفقیت و خطا
      const toastSelectors = [
        // موفقیت
        '.toast-success',
        '.Toastify__toast--success',
        '.success-toast',
        '[data-testid="success-toast"]',

        // خطا
        '.toast-error',
        '.Toastify__toast--error',
        '.error-toast',
        '[data-testid="error-toast"]',

        // عمومی
        '.Toastify__toast',
        '[role="alert"]',
        '.notification',
      ];

      console.log('در حال جستجوی توست...');

      // جستجوی توست با همه سلکتورها
      for (const selector of toastSelectors) {
        try {
          const toast = this.page.locator(selector);
          if (await toast.isVisible({ timeout: 3000 })) {
            const toastText = await toast.textContent();
            console.log(`✅ توست پیدا شد با سلکتور: ${selector}`);
            console.log(`متن توست: ${toastText}`);

            // اگر توست خطا بود، خطا را لاگ کن
            if (selector.includes('error') || selector.includes('-error')) {
              console.error('⚠️ توست خطا نمایش داده شد:', toastText);
            }

            // انتظار کوتاه برای نمایش کامل توست
            await this.page.waitForTimeout(2000);
            return;
          }
        } catch (e) {
          // ادامه با سلکتور بعدی
          continue;
        }
      }

      // اگر توست پیدا نشد، اسکرین‌شات و لاگ بگیر
      console.log('❌ هیچ توستی پیدا نشد. بررسی صفحه...');

      // اسکرین‌شات برای دیباگ
      await this.page.screenshot({
        path: 'debug-toast-not-found.png',
        fullPage: true
      });

      // لاگ کردن تمام المان‌های مرئی
      const visibleElements = await this.page.locator('*').all();
      console.log(`تعداد المان‌های مرئی: ${visibleElements.length}`);

      // جستجوی المان‌های مرتبط با نوتیفیکیشن
      const notifications = await this.page.locator('[class*="toast"], [class*="notif"], [class*="alert"]').all();
      console.log(`المان‌های نوتیفیکیشن پیدا شده: ${notifications.length}`);

      const consoleMessages: string[] = []; // ✅ نوع آرایه مشخص شد
      this.page.on('console', msg => consoleMessages.push(msg.text()));
      console.log('پیام‌های کنسول:', consoleMessages);
      throw new Error('هیچ توستی پس از عملیات ذخیره نمایش داده نشد');

    } catch (error) {
      console.error('❌ خطا در waitForSuccessToast:', error);
      throw error;
    }
  }

  async editRepository(): Promise<void> {
    await this.waitUtils.waitForPageLoad();

    const menuButton = this.page.locator('.repository-menu button').first();
    await this.waitUtils.stableClick(menuButton);

    const editButton = this.page.locator('.edit-repository').first();
    await this.waitUtils.stableClick(editButton);

    // ... rest of the code with waitUtils ...
  }
}
