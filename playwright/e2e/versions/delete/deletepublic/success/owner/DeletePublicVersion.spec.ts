import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../../../utils/core/auth';
import { RepositoryUtils } from '../../../../../utils/repository/crudrepo/CreateRepository';
import { EditDocument } from '../../../../../utils/document/publicdoc/PublicVersion';
import { DocumentManager } from '../../../../../utils/document/create/CreateDocument';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let DocumentUtils: EditDocument;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    DocumentUtils = new EditDocument(page);

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

    await page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    // ایجاد یک نمونه از کلاس مدیریت سند
    const documentManager = new DocumentManager(page);

    // رفتن به صفحه داشبورد
    await documentManager.goToDashboard();

    // انتخاب اولین مخزن
    await documentManager.selectFirstRepository();

    // کلیک روی دکمه ایجاد و انجام روند ایجاد سند
    await documentManager.clickCreateButton();
    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    await DocumentUtils.editDocument();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    await DocumentUtils.DeleteDocument();

    // اضافه کردن توقف در انتهای تست
    // await page.pause();
  });
});
