import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class PubliclastversionDocument {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * ویرایش سند
     */
    async Publiclastversion() {
        // Wait for the page to be fully loaded
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);

        const menuButton = this.page.locator('.document-menu button').nth(0);
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        const publicVersionButton = this.page.locator('.document-public-version').nth(0);
        await expect(publicVersionButton).toBeVisible();
        await publicVersionButton.click();



        const confirmButton = this.page.locator('.dialog-footer__submit-button');
        // بررسی اینکه دکمه قابل مشاهده است
        await expect(confirmButton).toBeVisible();
        // کلیک روی دکمه "تایید"
        await confirmButton.click();



        const menuuButton = this.page.locator('.document-menu button').nth(0);
        await expect(menuuButton).toBeVisible();
        await menuuButton.click();

        const versionListButton = this.page.locator('.document-version-list').nth(0);
        await expect(versionListButton).toBeVisible();
        await versionListButton.click();



        await this.page.waitForTimeout(10000);


    }
}
