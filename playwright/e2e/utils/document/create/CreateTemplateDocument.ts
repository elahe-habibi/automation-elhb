import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../../../constants';
import { WaitUtils } from '../../core/waitutils';

/**
 * کلاس مدیریت دسته‌بندی‌ها در سیستم
 * این کلاس شامل توابع مورد نیاز برای مدیریت دسته‌بندی‌هاست
 */
export class DocumentTemplateManager {
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
   * کلیک روی دکمه ایجاد و ایجاد سند نمونه
   */
  async clickCreateButton(): Promise<void> {
    await this.waitUtils.waitForPageLoad();

    const createButton = this.page.getByRole('button', { name: 'ایجاد' });
    await this.waitUtils.stableClick(createButton);

    const templateButton = this.page.locator('.create-template');
    await this.waitUtils.stableClick(templateButton);

    // انتخاب گزینه "clasor" از لیست (به صورت مقاوم و داخل دیالوگ)
    const dialog = this.page.getByRole('dialog').first();
    await expect(dialog).toBeVisible();

    // تلاش برای پیدا کردن کنترل نوع سند با role/label
    let typeSelect = dialog.getByRole('combobox', { name: /نوع سند/i });

    // در صورت عدم وجود role مناسب، از کلاس/تست‌آیدی استفاده کن
    if ((await typeSelect.count()) === 0) {
      typeSelect = dialog
        .locator('.document-type__select, [data-testid="document-type-select"]')
        .first();
    }

    // اگر کنترل وجود داشت، انتخاب انجام شود؛ در غیر اینصورت ادامه بده (ممکن است پیش‌فرض تنظیم باشد)
    if ((await typeSelect.count()) > 0) {
      await typeSelect.click();

      const clasorOption = dialog
        .getByRole('option', { name: /clasor/i })
        .or(dialog.locator('.select_option__text', { hasText: /clasor/i }).first());
      await expect(clasorOption).toBeVisible();
      await clasorOption.click();
    }

    const continueButton = dialog
      .getByRole('button', { name: 'ادامه' })
      .or(dialog.locator('.dialog-footer__submit-button').first());
    await expect(continueButton).toBeVisible();
    await continueButton.click();

    // مقدار یونیک برای نام سند
    const uniqueDocumentName = `سند-تست-${Date.now()}`;

    // پر کردن فیلد "نام سند"
    const nameField = this.page.locator('.document-info-form__name');
    await expect(nameField).toBeVisible();
    await nameField.fill(uniqueDocumentName);

    // پر کردن فیلد "اولویت سند"
    const orderField = this.page.locator('.document-info-form__order');
    await expect(orderField).toBeVisible();
    await orderField.fill('1');

    // پر کردن فیلد "توضیحات سند"
    const descriptionField = this.page.locator(
      '.document-info-form__description',
    );
    await expect(descriptionField).toBeVisible();
    await descriptionField.fill(
      'این یک سند تستی برای بررسی عملکرد Playwright است.',
    );

    const finalContinueButton = this.page.locator(
      '.dialog-footer__submit-button',
    );
    await expect(finalContinueButton).toBeVisible();
    await finalContinueButton.click();

    // پر کردن اطلاعات نسخه
    const versionField = this.page.locator('.document-version-form__name');
    await expect(versionField).toBeVisible();

    const uniqueVersionNumber = `نسخه-${Date.now()}`;
    await versionField.fill(uniqueVersionNumber);

    const finalCreateButton = this.page.locator(
      '.dialog-footer__submit-button',
    );
    await expect(finalCreateButton).toBeVisible();
    await finalCreateButton.click();

    // انتظار برای تکمیل عملیات و بسته شدن دیالوگ
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(2000);
    
    // بررسی و بستن دیالوگ‌های باز در صورت وجود
    await this.closeOpenDialogs();
    
    // انتظار برای اطمینان از بسته شدن تمام دیالوگ‌ها
    await this.page.waitForTimeout(1000);
  }

  /**
   * بستن دیالوگ‌های باز در صورت وجود
   */
  private async closeOpenDialogs(): Promise<void> {
    // بررسی وجود دکمه بستن دیالوگ
    const closeButton = this.page.locator('button[aria-label="بستن"], button.close-button, button[class*="close"]');
    const closeButtonCount = await closeButton.count();
    
    if (closeButtonCount > 0) {
      try {
        await closeButton.first().click({ timeout: 3000 });
        await this.page.waitForTimeout(500);
      } catch (error) {
        // اگر کلیک نشد، مشکلی نیست
      }
    }
    
    // بررسی وجود دیالوگ‌های backdrop و بستن آنها با کلیک خارج از دیالوگ
    const dialog = this.page.locator('.dialog, [role="dialog"]');
    const dialogCount = await dialog.count();
    
    if (dialogCount > 0) {
      // کلیک خارج از دیالوگ برای بستن آن
      try {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
      } catch (error) {
        // اگر کار نکرد، مشکلی نیست
      }
    }
  }

  /**
   * آماده‌سازی صفحه برای ساخت سند بعدی
   * بررسی می‌کند که در صفحه لیست سندها هستیم و دکمه ایجاد در دسترس است
   */
  async prepareForNextDocument(): Promise<void> {
    // اطمینان از اینکه صفحه کاملاً لود شده
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    
    // بستن دیالوگ‌های باز
    await this.closeOpenDialogs();
    
    // بررسی اینکه دکمه "ایجاد" وجود دارد (یعنی در صفحه لیست سندها هستیم)
    const createButton = this.page.getByRole('button', { name: 'ایجاد' }).first();
    await createButton.waitFor({ state: 'visible', timeout: 10000 }).catch(async () => {
      // اگر دکمه ایجاد پیدا نشد، ممکن است در صفحه دیگری باشیم
      // سعی می‌کنیم به صفحه لیست سندها برگردیم
      await this.selectFirstRepository();
    });
    
    await this.page.waitForTimeout(1000);
  }

  /**
   * انتظار برای نمایش پیام موفقیت‌آمیز
   */
  async waitForSuccessToast(): Promise<void> {
    const toastMessage = this.page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 10000 });
    await expect(toastMessage).toContainText('نسخه مورد نظر با موفقیت ایجاد گردید.', { timeout: 5000 });
  }
}
