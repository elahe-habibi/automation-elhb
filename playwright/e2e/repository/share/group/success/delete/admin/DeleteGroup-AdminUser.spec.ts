import { expect, test } from '@playwright/test';
import { AuthUtils } from '../../../../../../utils/core/auth';
import { RepositoryUtils } from '../../../../../../utils/user/DeleteGroup-Adminuser';
import { DocumentManager } from '../../../../../../utils/document/create/CreateDocument';
import path from 'path';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);

    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('should create a repository with custom image upload', async ({
    page,
  }) => {
    // ایجاد مخزن با نام یکتا
    await repoUtils.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true,
    );

    // ایجاد یک نمونه از کلاس مدیریت سند
    const documentManager = new DocumentManager(page);

    // اشتراک‌گذاری مخزن با کاربر دیگر
    await repoUtils.shareRepository('emad.mh');

    // رفتن به صفحه داشبورد
    await documentManager.goToDashboard();

    // انتخاب اولین مخزن
    await documentManager.selectFirstRepository();

    // کلیک روی دکمه منو
    await repoUtils.clickDropdownButton();


    await repoUtils.LogOut();

    // لاگین قبل از هر تست
    await authUtils.loginWithAnotherAccount('emad.mh', 'Em@d8970211');

    await page.waitForTimeout(3000);

    await repoUtils.AcceptRequest();

    await repoUtils.clickDroopdownButton();

    await page.waitForTimeout(3000);


    await repoUtils.sharreeRepository('mmohsen');

  });
});
