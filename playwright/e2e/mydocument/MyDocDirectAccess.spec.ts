import { test, expect } from '@playwright/test';
import { AuthUtils } from '../utils/core/auth';
import { RepositoryUtils } from '../utils/repository/crudrepo/CreateRepository';
import { DocumentManager } from '../utils/document/create/CreateDocument';
import { DirectAccessDocument } from '../utils/document/MyDocument';


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

    await page.waitForTimeout(3000);


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

    await page.waitForTimeout(3000);

    // رفتن به صفحه داشبورد
    await documentManager.goToDashboard();

    await page.waitForTimeout(3000);

    // انتخاب اولین مخزن
    await documentManager.selectFirstRepository();

    await page.waitForTimeout(3000);

    // کلیک روی دکمه ایجاد و انجام روند ایجاد سند
    await documentManager.clickCreateButton();

    await page.waitForTimeout(3000);

    await DirectaccessUtils.directaccess();

    await page.waitForTimeout(3000);

    await DirectaccessUtils.LogOut();

    await page.waitForTimeout(3000);

    await authUtils.loginWithAnotherAccount('emad.mh', 'Em@d8970211');

    await page.waitForTimeout(3000);

    await authUtils.navigateToMyRepositories();

    await page.waitForTimeout(3000);

    await DirectaccessUtils.editdirectaccessdoc();


  });
});
