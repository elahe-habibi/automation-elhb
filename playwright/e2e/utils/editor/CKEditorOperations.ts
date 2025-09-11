import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت عملیات CKEditor
 * این کلاس شامل توابع مورد نیاز برای کار با CKEditor است
 */
export class CKEditorOperations {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * دریافت frame و editor CKEditor
   */
  private async getEditor() {
    const frame = this.page.frameLocator('iframe');
    const editor = frame.locator('[contenteditable="true"]');
    return { frame, editor };
  }

  /**
   * تایپ متن در ادیتور
   */
  async typeText(text: string): Promise<void> {
    const { editor } = await this.getEditor();
    await editor.click();
    await editor.fill(text);
    await this.page.waitForTimeout(1000);
  }

  /**
   * انتخاب متن در ادیتور
   */
  async selectText(startText: string, endText?: string): Promise<void> {
    const { editor } = await this.getEditor();
    await editor.click();
    
    if (endText) {
      // انتخاب متن بین دو کلمه
      await editor.press('Control+a');
    } else {
      // انتخاب کلمه خاص
      await editor.press('Control+f');
      await this.page.keyboard.type(startText);
      await this.page.keyboard.press('Escape');
      await editor.press('Control+a');
    }
    
    await this.page.waitForTimeout(500);
  }

  /**
   * تغییر فونت متن
   */
  async changeFont(fontName: string): Promise<void> {
    const { frame } = await this.getEditor();
    
    // کلیک روی دکمه فونت
    const fontButton = frame.locator('[data-command="font"]').first();
    await fontButton.click();
    await this.page.waitForTimeout(500);

    // انتخاب فونت
    const fontOption = frame.locator(`[data-value="${fontName}"]`).first();
    await fontOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * تغییر سایز فونت
   */
  async changeFontSize(size: string): Promise<void> {
    const { frame } = await this.getEditor();
    
    // کلیک روی دکمه سایز
    const sizeButton = frame.locator('[data-command="fontSize"]').first();
    await sizeButton.click();
    await this.page.waitForTimeout(500);

    // انتخاب سایز
    const sizeOption = frame.locator(`[data-value="${size}"]`).first();
    await sizeOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * تغییر رنگ متن
   */
  async changeTextColor(color: string): Promise<void> {
    const { frame } = await this.getEditor();
    
    // کلیک روی دکمه رنگ متن
    const colorButton = frame.locator('[data-command="textColor"]').first();
    await colorButton.click();
    await this.page.waitForTimeout(500);

    // انتخاب رنگ
    const colorOption = frame.locator(`[data-value="${color}"]`).first();
    await colorOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * تغییر رنگ پس‌زمینه
   */
  async changeBackgroundColor(color: string): Promise<void> {
    const { frame } = await this.getEditor();
    
    // کلیک روی دکمه رنگ پس‌زمینه
    const bgColorButton = frame.locator('[data-command="bgColor"]').first();
    await bgColorButton.click();
    await this.page.waitForTimeout(500);

    // انتخاب رنگ
    const colorOption = frame.locator(`[data-value="${color}"]`).first();
    await colorOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * اعمال Bold
   */
  async makeBold(): Promise<void> {
    const { frame } = await this.getEditor();
    const boldButton = frame.locator('[data-command="bold"]').first();
    await boldButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * اعمال Italic
   */
  async makeItalic(): Promise<void> {
    const { frame } = await this.getEditor();
    const italicButton = frame.locator('[data-command="italic"]').first();
    await italicButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * اعمال Underline
   */
  async makeUnderline(): Promise<void> {
    const { frame } = await this.getEditor();
    const underlineButton = frame.locator('[data-command="underline"]').first();
    await underlineButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * اعمال Strike Through
   */
  async makeStrikeThrough(): Promise<void> {
    const { frame } = await this.getEditor();
    const strikeButton = frame.locator('[data-command="strike"]').first();
    await strikeButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * تراز کردن متن (راست، چپ، وسط)
   */
  async alignText(alignment: 'left' | 'center' | 'right' | 'justify'): Promise<void> {
    const { frame } = await this.getEditor();
    const alignButton = frame.locator(`[data-command="justify${alignment.charAt(0).toUpperCase() + alignment.slice(1)}"]`).first();
    await alignButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * ایجاد لیست شماره‌دار
   */
  async createNumberedList(): Promise<void> {
    const { frame } = await this.getEditor();
    const listButton = frame.locator('[data-command="numberedList"]').first();
    await listButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * ایجاد لیست نقطه‌ای
   */
  async createBulletList(): Promise<void> {
    const { frame } = await this.getEditor();
    const listButton = frame.locator('[data-command="bulletedList"]').first();
    await listButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * ایجاد لینک
   */
  async createLink(url: string, text?: string): Promise<void> {
    const { frame } = await this.getEditor();
    
    // کلیک روی دکمه لینک
    const linkButton = frame.locator('[data-command="link"]').first();
    await linkButton.click();
    await this.page.waitForTimeout(500);

    // پر کردن URL
    const urlInput = frame.locator('input[placeholder*="URL"]').first();
    await urlInput.fill(url);
    
    // پر کردن متن لینک (اختیاری)
    if (text) {
      const textInput = frame.locator('input[placeholder*="متن"]').first();
      await textInput.fill(text);
    }

    // کلیک روی OK
    const okButton = frame.locator('button:has-text("تایید")').first();
    await okButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * درج تصویر
   */
  async insertImage(imageUrl: string): Promise<void> {
    const { frame } = await this.getEditor();
    
    // کلیک روی دکمه تصویر
    const imageButton = frame.locator('[data-command="image"]').first();
    await imageButton.click();
    await this.page.waitForTimeout(500);

    // پر کردن URL تصویر
    const urlInput = frame.locator('input[placeholder*="URL"]').first();
    await urlInput.fill(imageUrl);

    // کلیک روی OK
    const okButton = frame.locator('button:has-text("تایید")').first();
    await okButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * ایجاد جدول
   */
  async createTable(rows: number, columns: number): Promise<void> {
    const { frame } = await this.getEditor();
    
    // کلیک روی دکمه جدول
    const tableButton = frame.locator('[data-command="insertTable"]').first();
    await tableButton.click();
    await this.page.waitForTimeout(500);

    // انتخاب اندازه جدول
    const tableGrid = frame.locator('.ck-table-grid');
    const targetCell = tableGrid.locator(`[data-row="${rows-1}"][data-column="${columns-1}"]`).first();
    await targetCell.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * ذخیره تغییرات
   */
  async saveChanges(): Promise<void> {
    const saveBtn = this.page.locator('button.editor-footer__save-button').filter({ visible: true });
    await saveBtn.waitFor({ state: 'visible' });
    await saveBtn.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * بررسی پیام موفقیت
   */
  async verifySuccessMessage(): Promise<void> {
    const toastMessage = this.page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 3000 });
    await expect(toastMessage).toContainText('تغییرات با موفقیت ذخیره شد.', { timeout: 3000 });
  }

  /**
   * بستن ادیتور
   */
  async closeEditor(): Promise<void> {
    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
