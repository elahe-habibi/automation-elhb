import { test, expect } from '@playwright/test';
import { AuthUtils } from '../utils/auth';
import { RepositoryUtils } from '../utils/create-repository';

test.describe('Repository Creation Tests', () => {
    let authUtils: AuthUtils;
    let repoUtils: RepositoryUtils;

    test.beforeEach(async ({ page }) => {
        // ایجاد نمونه‌های کلاس‌های کمکی
        authUtils = new AuthUtils(page);
        repoUtils = new RepositoryUtils(page);
        
        // لاگین قبل از هر تست
        await authUtils.login('e.habibi', '0936elhb');
    });

    test('should create repository and enter pod ID', async ({ page }) => {
        // ایجاد مخزن با نام یکتا
        const repoName = await repoUtils.createRepositoryWithUniqueName('این یک مخزن تستی است');
        
        // اطمینان از اینکه مخزن ایجاد نشده (چون shouldComplete=false است)
        await expect(page.locator('div[placeholder="stepper-dialog"]')).not.toBeVisible();
        
        // رفتن به صفحه مخزن‌های من
        await repoUtils.navigateToMyRepositories();
        
        // کلیک روی اولین مخزن
        await repoUtils.clickOnFirstRepository();
        
        // اشتراک‌گذاری مخزن با کاربر دیگر
        await repoUtils.shareRepository('emad.mh');
        
        // وارد کردن شناسه پادی
        await repoUtils.enterPodId('test-user');
        
        // کلیک روی دکمه دعوت
        const inviteButton = await page.locator('button p.text__label__button:has-text("دعوت")');
        await expect(inviteButton).toBeVisible();
        await inviteButton.click();
        
        // بستن دیالوگ
        await page.waitForSelector('svg.fill-icon-hover.w-6.h-6', { state: 'visible' });
        const closeButton = await page.locator('svg.fill-icon-hover.w-6.h-6').first();
        await closeButton.click({ force: true });
        
        // خروج از حساب کاربری
        await authUtils.logout();
    });
}); 