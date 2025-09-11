import { expect, Page } from '@playwright/test';
import { WaitUtils } from '../core/waitutils';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class listversionDocument {
  private page: Page;
  private waitUtils: WaitUtils;

  constructor(page: Page) {
    this.page = page;
    this.waitUtils = new WaitUtils(page);
  }

  /**
   * ویرایش سند
   */
  async listversion(): Promise<void> {
    await this.waitUtils.waitForPageLoad();

    const menuButton = this.page.locator('.document-menu button').first();
    await this.waitUtils.stableClick(menuButton);

    const versionListButton = this.page
      .locator('.document-version-list')
      .first();
    await this.waitUtils.stableClick(versionListButton);

    const versionList = this.page.locator('.version-list').first();
    await this.waitUtils.waitForElementStable(versionList);
  }
}
