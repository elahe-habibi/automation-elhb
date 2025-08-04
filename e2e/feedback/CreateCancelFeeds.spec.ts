import { expect, test } from '@playwright/test';
import { AuthUtils } from '../utils/auth';
import { CreateFeeds } from '../utils/CreateCancelFeeds';
import path from 'path';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let feeds: CreateFeeds;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    feeds = new CreateFeeds(page);
    // لاگین با بررسی شرطی دکمه پنل ادمین
    await authUtils.loginWithConditionalAdminPanel('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('login and go to create feedback page', async ({ page }) => {
    // لاگین انجام می‌شود در beforeEach
    // حالا متد ایجاد فیدبک را صدا می‌زنیم
    await feeds.createfeeds();
    // می‌توانید یک انتظار ساده هم اضافه کنید که مطمئن شوید صفحه درست لود شده
    await expect(page).toHaveURL('https://clasor-frontend.sandpod.ir/admin/dashboard');
  });

});
