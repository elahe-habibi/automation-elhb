import { expect, Page } from '@playwright/test';
import { URLs, getFullUrl } from '../../../constants';
import { WaitUtils } from '../../core/waitutils';

/**
 * کلاس مدیریت دسته‌بندی‌ها در سیستم
 * این کلاس شامل توابع مورد نیاز برای مدیریت دسته‌بندی‌هاست
 */
export class DocumentManager {
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
    await this.waitUtils.waitForPageLoad();
  }

  /**
   * انتخاب اولین مخزن در لیست
   */
  async selectFirstRepository(): Promise<void> {
    console.log('⏳ در انتظار نمایش مخازن...');

    // ✅ حذف کامل waitForLoadState (علت اصلی خطا)
    // به جای آن: مستقیماً منتظر ظهور مخازن بمان

    const repoCards = this.page.locator('.repo-card');

    // انتظار هوشمند برای ظهور حداقل یک مخزن (تا 30 ثانیه)
    await repoCards.first().waitFor({
      state: 'visible',
      timeout: 30000,
    });

    // تأیید تعداد مخازن
    const repoCount = await repoCards.count();
    console.log(`✅ تعداد مخازن بارگذاری شده: ${repoCount}`);

    if (repoCount === 0) {
      throw new Error(
        'هیچ مخزنی در لیست یافت نشد! ممکن است نیاز به رفرش صفحه باشد.',
      );
    }

    // کلیک ایمن روی اولین مخزن
    await this.waitUtils.stableClick(repoCards.first());

    // انتظار برای بارگذاری صفحه جزئیات
    await this.waitUtils.waitForPageLoad();
    await this.page.waitForTimeout(1000);

    console.log('✅ اولین مخزن با موفقیت انتخاب شد');
  }

  /**
   * کلیک روی دکمه ایجاد و ایجاد سند جدید
   */
  async clickCreateButton(): Promise<void> {
    // Wait for the document table to be ready
    await this.waitUtils.waitForPageLoad();

    // Wait for page to fully stabilize after previous operations
    await this.page
      .waitForLoadState('networkidle', { timeout: 10000 })
      .catch(() => {});
    await this.page.waitForTimeout(2000);

    // بستن دیالوگ‌های باز در صورت وجود
    await this.closeOpenDialogs();

    // Wait for the create button with more specific selector
    const createButton = this.page
      .getByRole('button', { name: 'ایجاد' })
      .first();

    // Ensure button is visible and enabled
    //await expect(createButton).toBeVisible({ timeout: 15000 });
    await expect(createButton).toBeEnabled({ timeout: 5000 });

    await this.waitUtils.stableClick(createButton);

    // Wait for the dropdown/menu to appear after clicking "ایجاد"
    await this.page.waitForTimeout(1500);

    // Wait for the new document button to appear in the dropdown
    // بررسی چندگانه برای پیدا کردن دکمه
    let newDocumentButton = this.page.locator('.create-document');

    // اگر پیدا نشد، با text search کنیم
    if ((await newDocumentButton.count()) === 0) {
      newDocumentButton = this.page
        .getByRole('button')
        .filter({ hasText: /سند|document/i });
    }

    // اگر هنوز پیدا نشد، منتظر می‌مانیم و دوباره تلاش می‌کنیم
    let attempts = 0;
    while ((await newDocumentButton.count()) === 0 && attempts < 5) {
      await this.page.waitForTimeout(500);
      newDocumentButton = this.page.locator('.create-document');
      attempts++;
    }

    // More robust waiting for the dropdown item
    await expect(newDocumentButton.first()).toBeVisible({ timeout: 20000 });
    await newDocumentButton
      .first()
      .waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForTimeout(500); // Wait for any animations

    await this.waitUtils.stableClick(newDocumentButton.first());

    // دیالوگ را پیدا کن و همه کوئری‌ها را به آن scope کن
    const dialog = this.page.getByRole('dialog').first();
    await expect(dialog).toBeVisible();

    // کنترل نوع سند را با role/label پیدا کن؛ در غیر اینصورت fallback
    let typeSelect = dialog.getByRole('combobox', { name: /نوع سند/i });
    if ((await typeSelect.count()) === 0) {
      typeSelect = dialog
        .locator('.document-type__select, [data-testid="document-type-select"]')
        .first();
    }

    if ((await typeSelect.count()) > 0) {
      await typeSelect.click();

      // اسکرول در لیست انتخاب در صورت وجود
      const dropdownList = dialog.locator('.shadow-menu');
      if ((await dropdownList.count()) > 0) {
        await dropdownList.first().evaluate(el => el.scrollIntoView());
      }

      // انتخاب گزینه "clasor" به شکل مقاوم
      const clasorOption = dialog
        .getByRole('option', { name: /clasor/i })
        .or(
          dialog
            .locator('.select_option__text', { hasText: /clasor/i })
            .first(),
        );
      await expect(clasorOption).toBeVisible();
      await clasorOption.click();
    }

    const continueButton = dialog
      .getByRole('button', { name: 'ادامه' })
      .or(dialog.locator('.dialog-footer__submit-button').first());
    await expect(continueButton).toBeVisible();
    await continueButton.click();

    // مقدار نام سند با کاراکتر غیرمجاز
    const invalidDocumentName = `سند***////${Date.now()}`;

    // پر کردن فیلد "نام سند"
    const nameField = this.page.locator('.document-info-form__name');
    await expect(nameField).toBeVisible();
    await nameField.fill(invalidDocumentName);

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

    // // ارسال فرم
    // const confirmButton = this.page.locator('.dialog-footer__submit-button');
    // await expect(confirmButton).toBeVisible();
    // await confirmButton.click();


    // const finalSaveButton = this.page.locator('.dialog-footer__submit-button');
    // await expect(finalSaveButton).toBeVisible();
    // await finalSaveButton.click();

    // const lastContinueButton = this.page.locator(
    //   '.dialog-footer__submit-button',
    // );
    // await expect(lastContinueButton).toBeVisible();
    // await lastContinueButton.click();

    // // پر کردن اطلاعات نسخه
    // const versionField = this.page.locator('.document-version-form__name');
    // await expect(versionField).toBeVisible();

    // const uniqueVersionName = `نسخه-${Date.now()}`;
    // await versionField.fill(uniqueVersionName);

    // const createButtonfinal = this.page.locator(
    //   '.dialog-footer__submit-button',
    // );
    // await expect(createButtonfinal).toBeVisible();
    // await createButtonfinal.click();

    // await this.page.waitForTimeout(5000);

    // // انتظار برای تکمیل عملیات
    // await this.waitUtils.waitForPageLoad();
  }

  /**
   * بررسی نمایش فرم دسته‌بندی
   * @returns آیا فرم دسته‌بندی نمایش داده می‌شود
   */
  async isDocumentFormVisible(): Promise<boolean> {
    const documentForm = this.page.locator('form').filter({ hasText: 'سند' });
    return await documentForm.isVisible();
  }

  /**
   * بستن دیالوگ‌های باز در صورت وجود
   */
  private async closeOpenDialogs(): Promise<void> {
    // بررسی وجود دکمه بستن دیالوگ
    const closeButton = this.page.locator(
      'button[aria-label="بستن"], button.close-button, button[class*="close"]',
    );
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
}
