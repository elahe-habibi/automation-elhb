import { test, expect } from '@playwright/test';
import { AuthUtils } from '../utils/auth';
import { RepositoryUtils } from '../utils/create-repository';

test.describe('Clasor Tests', () => {
    let authUtils: AuthUtils;
    let repoUtils: RepositoryUtils;

    test.beforeEach(async ({ page }) => {
        // ایجاد یک نمونه از AuthUtils برای هر تست
        authUtils = new AuthUtils(page);
        repoUtils = new RepositoryUtils(page);
    });

    test('should login and create a repository', async ({ page }) => {
        // استفاده از متد login برای ورود به سیستم
        await authUtils.login('e.habibi', '0936elhb');
        
        // اطمینان از اینکه به داشبورد هدایت شدیم
        await expect(page).toHaveURL('https://clasor-frontend.sandpod.ir/admin/dashboard');
        
        // ایجاد مخزن با نام یکتا
        await repoUtils.createRepositoryWithUniqueName('این یک مخزن تستی است');
        
        // خروج از حساب کاربری
        await authUtils.logout();
    });

    test('should login with another account', async ({ page }) => {
        // استفاده از متد loginWithAnotherAccount برای ورود با حساب دیگر
        await authUtils.loginWithAnotherAccount('emad.mh', 'Em@d8970211');
        
        // اطمینان از اینکه به داشبورد هدایت شدیم
        await expect(page).toHaveURL('https://clasor-frontend.sandpod.ir/admin/dashboard');
        
        // خروج از حساب کاربری
        await authUtils.logout();
    });
}); 