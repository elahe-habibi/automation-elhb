import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../../../utils/core/auth';
import { RepositoryUtils } from '../../../../../utils/repository/crudrepo/CreateRepository';
import { DocumentManager } from '../../../../../utils/document/create/CreateDocument';
import { DirectAccessDocument } from '../../../../../utils/document/directaccess/DirectAccesstoDoc';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let DirectaccessUtils: DirectAccessDocument;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    DirectaccessUtils = new DirectAccessDocument(page);

    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('Create New Document', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true,
    );

    // ایجاد یک نمونه از کلاس مدیریت سند
    const documentManager = new DocumentManager(page);

    // رفتن به صفحه داشبورد
    await documentManager.goToDashboard();

    // انتخاب اولین مخزن
    await documentManager.selectFirstRepository();

    // کلیک روی دکمه ایجاد و انجام روند ایجاد سند
    await documentManager.clickCreateButton();

    await DirectaccessUtils.directaccessviewer();

    // const toastMessage = page.locator('.Toastify__toast-body');
    // await expect(toastMessage).toBeVisible({ timeout: 10000 });
    // await expect(toastMessage).toContainText('دسترسی کاربر به سند انجام شد.', { timeout: 5000 });

    await repoUtils.LogOut();

    // لاگین قبل از هر تست
    await authUtils.loginWithAnotherAccount('hbrs', 'HQ[>684ngg');

    await page.waitForTimeout(3000);

    await DirectaccessUtils.shareDoc();

    await page.waitForTimeout(5000);



  });
});
