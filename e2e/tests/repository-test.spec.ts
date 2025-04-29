import { test, expect } from '@playwright/test';
import { AuthUtils } from '../utils/auth';
import { RepositoryUtils } from '../utils/create-repository';

test.describe('Repository Tests', () => {
    let authUtils: AuthUtils;
    let repoUtils: RepositoryUtils;

    test.beforeEach(async ({ page }) => {
        // ایجاد نمونه‌های کلاس‌های کمکی
        authUtils = new AuthUtils(page);
        repoUtils = new RepositoryUtils(page);
        
        // لاگین قبل از هر تست
        await authUtils.login('e.habibi', '0936elhb');
    });

    test('should create a repository with unique name', async ({ page }) => {
        // ایجاد مخزن با نام یکتا
        const repoName = await repoUtils.createRepositoryWithUniqueName('این یک مخزن تستی است');
        
        // اطمینان از اینکه مخزن ایجاد نشده (چون shouldComplete=false است)
        await expect(page.locator('div[placeholder="stepper-dialog"]')).not.toBeVisible();
    });

    test('should navigate to repositories and share with another user', async ({ page }) => {
        // رفتن به صفحه مخزن‌های من
        await repoUtils.navigateToMyRepositories();
        
        // کلیک روی اولین مخزن
        await repoUtils.clickOnFirstRepository();
        
        // اشتراک‌گذاری مخزن با کاربر دیگر
        await repoUtils.shareRepository('emad.mh');
        
        // خروج از حساب کاربری
        await authUtils.logout();
    });

    test('should login with another account and create repository', async ({ page }) => {
        // خروج از حساب کاربری فعلی
        await authUtils.logout();
        
        // لاگین با حساب دیگر
        await authUtils.loginWithAnotherAccount('emad.mh', 'Em@d8970211');
        
        // ایجاد مخزن با نام یکتا
        await repoUtils.createRepositoryWithUniqueName('مخزن تستی از حساب دیگر');
        
        // خروج از حساب کاربری
        await authUtils.logout();
    });
}); 