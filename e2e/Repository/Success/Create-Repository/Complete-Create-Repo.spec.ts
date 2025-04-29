import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../utils/auth';
import { RepositoryUtils } from '../../../utils/Create-repository';

test.describe('Repository Create and Share', () => {
    let authUtils: AuthUtils;
    let repoUtils: RepositoryUtils;

    test.beforeEach(async ({ page }) => {
        // ایجاد نمونه‌های کلاس‌های کمکی
        authUtils = new AuthUtils(page);
        repoUtils = new RepositoryUtils(page);
        
        // لاگین قبل از هر تست
        await authUtils.login('eli69', 'HQ[>684ngg');
    });

    test('should create a repository, add tags and share with user', async ({ page }) => {
        // ایجاد مخزن با نام یکتا
        const repoName = await repoUtils.createRepositoryWithUniqueName('این یک مخزن تستی است', true);
        
        // اشتراک‌گذاری مخزن با کاربر دیگر
        await repoUtils.shareRepository('emad.mh');
        
        // ایجاد تگ‌ها
        await repoUtils.createTag('تست');
        await repoUtils.createTag('مخزن');
        





        // اضافه کردن تاخیر برای اطمینان از اشتراک‌گذاری
        await page.waitForTimeout(2000);
    });
}); 