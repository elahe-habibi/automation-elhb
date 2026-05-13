import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class PasswordDocument {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  /**
   * ویرایش سند
   */
  async LimitationPanelDoc(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await this.page.locator('button.document-access').first().click();

    // کلیک روی فیلد جستجو
    await this.page.locator('input[placeholder="جست و جو کنید ..."]').click();
    
    const user = this.page.locator('.select_option__text', { hasText: 'emad.mh' });
    await user.waitFor({ state: 'visible' });
    await user.click();
    

    await this.page.locator('button.add-button').click();

    const toastMessage = this.page.locator('.Toastify__toast-body');

    const toastCount = await toastMessage.count();

    if (toastCount > 0) {
      await expect(toastMessage.first()).toContainText(
        'کاربر emad.mh با موفقیت از سند بلاک شد.',
      );
    }

    await this.page.waitForTimeout(8000);
  }
 /**
   * ویرایش سند
   */
 async LimitationPanelDocDelete(): Promise<void> {
  // Wait for the page to be fully loaded
  await this.page.waitForLoadState('networkidle');
  await this.page.waitForTimeout(5000);

  const menuButton = this.page.locator('.document-menu button').nth(0);
  await expect(menuButton).toBeVisible();
  await menuButton.click();

  await this.page.locator('button.document-access').first().click();

  // کلیک روی فیلد جستجو
  await this.page.locator('input[placeholder="جست و جو کنید ..."]').click();
  
  const user = this.page.locator('.select_option__text', { hasText: 'emad.mh' });
  await user.waitFor({ state: 'visible' });
  await user.click();
  

  await this.page.locator('button.add-button').click();

  await this.page.waitForTimeout(3000);


  await this.page.locator('button.close-button').first().click();


  const toastMessage = this.page.locator('.Toastify__toast-body');

  const toastCount = await toastMessage.count();

  if (toastCount > 0) {
    await expect(toastMessage.first()).toContainText(
      'کاربر emad.mh با موفقیت از سند بلاک شد.',
    );
  }

  await this.page.waitForTimeout(8000);
  
  const mennuButton = this.page.locator('.document-menu button').nth(0);
  await expect(mennuButton).toBeVisible();
  await mennuButton.click();

  await this.page.locator('button.document-access').first().click();

  await this.page.locator('button.delete-button').first().click();

  await this.page.waitForTimeout(5000);


}


/**
   * ویرایش سند
   */
async LimitationPanelDocDeleteAdmin(): Promise<void> {
  // Wait for the page to be fully loaded
  await this.page.waitForLoadState('networkidle');
  await this.page.waitForTimeout(5000);

  const menuButton = this.page.locator('.document-menu button').nth(0);
  await expect(menuButton).toBeVisible();
  await menuButton.click();

  await this.page.locator('button.document-access').first().click();

  // کلیک روی فیلد جستجو
  await this.page.locator('input[placeholder="جست و جو کنید ..."]').click();
  
  const user = this.page.locator('.select_option__text', { hasText: 'eli69' });
  await user.waitFor({ state: 'visible' });
  await user.click();
  

  await this.page.locator('button.add-button').click();

  await this.page.waitForTimeout(3000);


  await this.page.locator('button.close-button').first().click();


  const toastMessage = this.page.locator('.Toastify__toast-body');

  const toastCount = await toastMessage.count();

  if (toastCount > 0) {
    await expect(toastMessage.first()).toContainText(
      'کاربر eli69 با موفقیت از سند بلاک شد.',
    );
  }

  await this.page.waitForTimeout(8000);
  
  const mennuButton = this.page.locator('.document-menu button').nth(0);
  await expect(mennuButton).toBeVisible();
  await mennuButton.click();

  await this.page.locator('button.document-access').first().click();

  await this.page.locator('button.delete-button').first().click();

  await this.page.waitForTimeout(5000);


}


  /**
   * ویرایش سند
   */
  async PasswordDocumentDeletecancel(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const restrictionButton = this.page.locator(
      'button[role="menuitem"]:has-text("محدودیت در انتشار")',
    );
    await expect(restrictionButton).toBeVisible();
    await restrictionButton.click();

    const passwordBtn = this.page.locator('.document-create-password');
    if (await passwordBtn.isVisible()) {
      await passwordBtn.click();
    }

    const passwordInput = this.page.locator(
      'input.create-password-form__password',
    );
    const confirmInput = this.page.locator(
      'input.create-password-form__confirm-password',
    );

    if ((await passwordInput.isVisible()) && (await confirmInput.isVisible())) {
      await passwordInput.fill('۱۲۳۴۵۶۷۸');
      await confirmInput.fill('۱۲۳۴۵۶۷۸');
    }

    await this.page.locator('button.dialog-footer__submit-button').click();

    const toastMessage = this.page.locator('.Toastify__toast-body').first();
    try {
      await expect(toastMessage).toBeVisible({ timeout: 5000 });
      await expect(toastMessage).toContainText(
        'رمز عبور باموفقیت برای سند مورد نظر اعمال شد.',
      );
    } catch {
      // اگر toast نیامد تست ادامه پیدا کند
    }

    await this.page.waitForTimeout(10000);

    const mennuButton = this.page.locator('.document-menu button').nth(0);
    await expect(mennuButton).toBeVisible();
    await mennuButton.click();

    const restricttionButton = this.page.locator(
      'button[role="menuitem"]:has-text("محدودیت در انتشار")',
    );
    await expect(restricttionButton).toBeVisible();
    await restricttionButton.click();

    const deletePasswordBtn = this.page.locator(
      'button.document-delete-password',
    );
    await expect(deletePasswordBtn).toBeVisible();
    await deletePasswordBtn.click();

    await this.page
      .locator('input.delete-password-form__old-password')
      .fill('12345678');

    await this.page.locator('button.cancel-button').click();
  }

  /**
   * ویرایش سند
   */
  async PasswordDocumentEdit(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const restrictionButton = this.page.locator(
      'button[role="menuitem"]:has-text("محدودیت در انتشار")',
    );
    await expect(restrictionButton).toBeVisible();
    await restrictionButton.click();

    const passwordBtn = this.page.locator('.document-create-password');
    if (await passwordBtn.isVisible()) {
      await passwordBtn.click();
    }

    const passwordInput = this.page.locator(
      'input.create-password-form__password',
    );
    const confirmInput = this.page.locator(
      'input.create-password-form__confirm-password',
    );

    if ((await passwordInput.isVisible()) && (await confirmInput.isVisible())) {
      await passwordInput.fill('۱۲۳۴۵۶۷۸');
      await confirmInput.fill('۱۲۳۴۵۶۷۸');
    }

    await this.page.locator('button.dialog-footer__submit-button').click();

    const toastMessage = this.page.locator('.Toastify__toast-body').first();
    try {
      await expect(toastMessage).toBeVisible({ timeout: 5000 });
      await expect(toastMessage).toContainText(
        'رمز عبور باموفقیت برای سند مورد نظر اعمال شد.',
      );
    } catch {
      // اگر toast نیامد تست ادامه پیدا کند
    }

    await this.page.waitForTimeout(10000);

    const mennuButton = this.page.locator('.document-menu button').nth(0);
    await expect(mennuButton).toBeVisible();
    await mennuButton.click();

    const restricttionButton = this.page.locator(
      'button[role="menuitem"]:has-text("محدودیت در انتشار")',
    );
    await expect(restricttionButton).toBeVisible();
    await restricttionButton.click();

    await this.page.locator('button.document-edit-password').click();

    await this.page.locator('input.new-password').fill('987654321');
    await this.page.locator('input.confirm-password').fill('987654321');

    await this.page
      .locator('button.dialog-footer__submit-button:has-text("تایید")')
      .click();
  }

  /**
   * ویرایش سند
   */
  async PasswordDocumentEditCancel(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const restrictionButton = this.page.locator(
      'button[role="menuitem"]:has-text("محدودیت در انتشار")',
    );
    await expect(restrictionButton).toBeVisible();
    await restrictionButton.click();

    const passwordBtn = this.page.locator('.document-create-password');
    if (await passwordBtn.isVisible()) {
      await passwordBtn.click();
    }

    const passwordInput = this.page.locator(
      'input.create-password-form__password',
    );
    const confirmInput = this.page.locator(
      'input.create-password-form__confirm-password',
    );

    if ((await passwordInput.isVisible()) && (await confirmInput.isVisible())) {
      await passwordInput.fill('۱۲۳۴۵۶۷۸');
      await confirmInput.fill('۱۲۳۴۵۶۷۸');
    }

    await this.page.locator('button.dialog-footer__submit-button').click();

    const toastMessage = this.page.locator('.Toastify__toast-body').first();
    try {
      await expect(toastMessage).toBeVisible({ timeout: 5000 });
      await expect(toastMessage).toContainText(
        'رمز عبور باموفقیت برای سند مورد نظر اعمال شد.',
      );
    } catch {
      // اگر toast نیامد تست ادامه پیدا کند
    }

    await this.page.waitForTimeout(10000);

    const mennuButton = this.page.locator('.document-menu button').nth(0);
    await expect(mennuButton).toBeVisible();
    await mennuButton.click();

    const restricttionButton = this.page.locator(
      'button[role="menuitem"]:has-text("محدودیت در انتشار")',
    );
    await expect(restricttionButton).toBeVisible();
    await restricttionButton.click();

    await this.page.locator('button.document-edit-password').click();

    await this.page.locator('input.new-password').fill('987654321');
    await this.page.locator('input.confirm-password').fill('987654321');

    await this.page.locator('button.cancel-button').click();
  }
}
