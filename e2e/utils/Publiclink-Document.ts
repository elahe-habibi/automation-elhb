import { expect, Page } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class PubliclinknDocument {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * ویرایش سند
     */
    async PubliclinkDoc() {
        // Wait for the page to be fully loaded
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);

        const menuButton = this.page.locator('.document-menu button').nth(0);
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        const publishLinkButton = this.page.locator('.document-create-publish-link').nth(0);
        await expect(publishLinkButton).toBeVisible();
        await publishLinkButton.click();




        const checkbox = this.page.locator('.expire-time__checkbox');
        // بررسی اینکه چک‌باکس قابل مشاهده است
        await expect(checkbox).toBeVisible();
        // انتخاب و فعال کردن چک‌باکس
        await checkbox.check();


        // ابتدا روی فیلد تاریخ کلیک کن تا پنجره انتخاب تاریخ باز شود
        const dateField = this.page.locator('.datePicker__input');
        await expect(dateField).toBeVisible();
        await dateField.click();

        // دریافت تاریخ فعلی
        const today = new Date();
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + 1); // تاریخ روز بعد

        // تبدیل عدد روز ماه به متن (مثلاً "۹" برای انتخاب)
        const nextDayFormatted = nextDay.getDate().toString();
        // انتخاب دکمه روز موردنظر بر اساس `data-value`
        const nextDayButton = this.page.locator(`button[data-value*="${nextDayFormatted}"]`);
        await expect(nextDayButton).toBeVisible();
        await nextDayButton.click();



        const confirmButton = this.page.locator('.dialog-footer__submit-button');
        // بررسی اینکه دکمه قابل مشاهده است
        await expect(confirmButton).toBeVisible();
        // کلیک روی دکمه "تایید"
        await confirmButton.click();


        await this.page.waitForTimeout(5000);

        const publishedDocumentButton = this.page.locator('.text__label__button').nth(0);
        await expect(publishedDocumentButton).toBeVisible();
        await publishedDocumentButton.click();


        await this.page.waitForTimeout(10000);

    }
}
