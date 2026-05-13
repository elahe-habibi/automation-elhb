import { expect, test } from '@playwright/test';
import { AuthUtils } from '../../../../../utils/core/auth';
import { RepositoryUtils } from '../../../../../utils/user/AddUserReposWriter';
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
    console.log('║ تست اشتراک‌گذاری با نقش writer');
    console.log('╚════════════════════════════════════════════════════════');

    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'مخزن تست برای نقش writer',
      true,
    );
    console.log(`✅ مخزن ایجاد شد: ${repoName}`);

          // اشتراک‌گذاری با کاربر با نقش writer
          await repoUtils.shareRepository('e.habibi', 'writer');
          console.log('✅ مخزن با کاربر e.habibi با نقش writer به اشتراک گذاشته شد');

          // رفتن به صفحه داشبورد
          await documentManager.goToDashboard();

          // انتخاب اولین مخزن
          await documentManager.selectFirstRepository();

          // کلیک روی دکمه منو
          await repoUtils.clickDropdownButton();

          await page.waitForTimeout(5000);

          // لاگ‌آوت
          await repoUtils.LogOut();

          // لاگین با حساب کاربر writer
          await authUtils.loginWithAnotherAccount('e.habibi','0936elhb#');

          // پذیرش درخواست
          await repoUtils.AcceptRequest();

          console.log('╔════════════════════════════════════════════════════════');
          console.log('║ ✅ تست writer موفقیت‌آمیز بود');
          console.log('╚════════════════════════════════════════════════════════');
        });
      });
