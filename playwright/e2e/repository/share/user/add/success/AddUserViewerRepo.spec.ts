import { expect, test } from '@playwright/test';
import { AuthUtils } from '../../../../../utils/core/auth';
import { RepositoryUtils } from '../../../../../utils/user/AddUserReposViewer';
import { DocumentManager } from '../../../../../utils/document/create/CreateDocument';
//import path from 'path';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let documentManager: DocumentManager;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    documentManager = new DocumentManager(page);

    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('should create a repository with custom image upload', async ({
    page,
  }) => {
    console.log('╔════════════════════════════════════════════════════════');
    console.log('║ تست اشتراک‌گذاری با نقش viewer');
    console.log('╚════════════════════════════════════════════════════════');

    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'مخزن تست برای نقش viewer',
      true,
    );
    console.log(`✅ مخزن ایجاد شد: ${repoName}`);

          // اشتراک‌گذاری با کاربر با نقش viewer
          await repoUtils.shareRepository('e.habibi', 'viewer');
          console.log('✅ مخزن با کاربر e.habibi با نقش viewer به اشتراک گذاشته شد');

          // رفتن به صفحه داشبورد
          await documentManager.goToDashboard();

          // انتخاب اولین مخزن
          await documentManager.selectFirstRepository();

          // کلیک روی دکمه منو
          await repoUtils.clickDropdownButton();

          await page.waitForTimeout(5000);

          // لاگ‌آوت
          await repoUtils.LogOut();

          // لاگین با حساب کاربر viewer
          await authUtils.loginWithAnotherAccount('e.habibi','0936elhb#');

          // پذیرش درخواست
          await repoUtils.AcceptRequest();

          console.log('╔════════════════════════════════════════════════════════');
          console.log('║ ✅ تست viewer موفقیت‌آمیز بود');
          console.log('╚════════════════════════════════════════════════════════');
        });
      });
