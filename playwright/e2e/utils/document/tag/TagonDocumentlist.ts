import { expect, Page } from '@playwright/test';
import path from 'path';
import { URLs, getFullUrl } from '../../../constants';
import { Locator } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class TagDocument {
  private page: Page;
  // تعریف لوکیتورهای تگ
  private tagInput: Locator;
  private addButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // مقداردهی لوکیتورهای تگ در کانستراکتور
    this.tagInput = page.locator('input[placeholder="عنوان تگ"]');
    this.addButton = page.locator('button:has-text("افزودن")');
  }

  /**
   * پر کردن فیلد تگ
   * @param tagName نام تگ مورد نظر
   */
  async fillTag(tagName: string): Promise<void> {
    await expect(this.tagInput).toBeVisible();
    await this.tagInput.click();
    await this.tagInput.fill(tagName);
  }

  /**
   * کلیک روی دکمه افزودن تگ
   */
  async clickAddTagButton(): Promise<void> {
    await this.addButton.click();
  }

  /**
   * افزودن یک تگ به مخزن
   * @param tagName نام تگ مورد نظر
   */
  async addTag(tagName: string): Promise<void> {
    try {
      const uniqueTag = `${tagName}_${Date.now()}`;

      const addTagButton = this.page.locator(
        '.createTag:has-text("افزودن تگ")',
      );
      await addTagButton.click();

      const tagNameInput = this.page.locator('input.tag-create-dialog__name');
      await expect(tagNameInput).toBeVisible();
      await tagNameInput.click();
      await tagNameInput.fill(uniqueTag);

      const createButton = this.page.locator(
        'button.dialog-footer__submit-button',
      );
      await expect(createButton).toBeVisible();
      await createButton.click();

      await this.page.waitForTimeout(500);
    } catch (error) {
      console.error('خطا در افزودن تگ:', error);
      throw error;
    }
  }

  /**
   * افزودن چندین تگ به مخزن
   * @param tags آرایه‌ای از تگ‌ها
   */
  async addMultipleTags(tags: string[]): Promise<void> {
    try {
      for (const tag of tags) {
        await this.addTag(tag);
        // اختیاری: تاخیر بین افزودن تگ‌ها
        // await this.page.waitForTimeout(300);
      }
    } catch (error) {
      console.error('خطا در افزودن چندین تگ:', error);
      throw error;
    }
  }

  /**
   * پاک کردن فیلد تگ
   */
  async clearTagInput(): Promise<void> {
    await this.tagInput.clear();
  }

  /**
   * بررسی اینکه فیلد تگ خالی است یا نه
   */
  async isTagInputEmpty(): Promise<boolean> {
    const value = await this.tagInput.inputValue();
    return value.trim() === '';
  }

  /**
   * ویرایش سند
   */
  async editDocument(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const editButton = this.page.locator('button[role="menuitem"]').nth(0);
    await expect(editButton).toBeVisible();
    await editButton.click();

    const tagButton = this.page.locator('button.document-edit-tags');
    if (await tagButton.isVisible()) {
      await tagButton.click();
    }

    for (let i = 0; i < 3; i++) {
      // کلیک روی فیلد جستجو
      await this.page.locator('input[placeholder="جست و جو کنید ..."]').click();

      // منتظر ظاهر شدن لیست محدودشده
      const options = this.page.locator(
        '.dialog-body ul li p.select_option__text',
      );
      await options.first().waitFor();

      // انتخاب آیتم i‌ام
      const item = options.nth(i);
      if (await item.isVisible()) {
        await item.click();
      }

      // صبر کوتاه برای بسته شدن dropdown
      await this.page.waitForTimeout(300);
    }

    await this.page.locator('button.dialog-footer__submit-button').click();


    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();


    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);

    const mennuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await mennuButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const editBuutton = this.page.locator('button[role="menuitem"]').nth(0);
    await expect(editButton).toBeVisible();
    await editBuutton.click();

    const tagBuutton = this.page.locator('button.document-edit-tags');
    if (await tagBuutton.isVisible()) {
      await tagBuutton.click();
    }

    const closeeButton = this.page.locator('button.close-button');
    await expect(closeeButton).toBeVisible();
    await closeeButton.click();

  }
}
