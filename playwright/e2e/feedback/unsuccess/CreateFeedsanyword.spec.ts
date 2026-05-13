import { expect, test } from '@playwright/test';
import { AuthUtils } from '../../utils/core/auth';
import { CreateFeeds } from '../../utils/feedback/feedbackanyword';
import path from 'path';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let feeds: CreateFeeds;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    feeds = new CreateFeeds(page);
    // لاگین با بررسی شرطی دکمه پنل ادمین
    await authUtils.login('eli69','HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('should show validation error for empty feedback', async ({ page }) => {
    const feeds = new CreateFeeds(page);
    
    // ورود به سیستم و رفتن به داشبورد (قبل از تست)
    await authUtils.login('eli69', 'HQ[>684ngg');
    
    // اجرای سناریوی تست خطا
    await feeds.submitEmptyFeedback();
    
    // ✅ تست با موفقیت خطا رو تأیید کرد
  });
});
