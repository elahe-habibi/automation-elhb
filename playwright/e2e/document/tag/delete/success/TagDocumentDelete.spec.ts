import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../../utils/core/auth';
import { RepositoryUtils } from '../../../../utils/repository/crudrepo/CreateRepository';
import { TagDocument } from '../../../../utils/document/tag/TagonDocumentDelete';
import { DocumentManager } from '../../../../utils/document/create/CreateDocument';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let DocumentUtils: TagDocument;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    DocumentUtils = new TagDocument(page);

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
    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // افزودن یک تگ
    await DocumentUtils.addTag('tagName');

    // افزودن چندین تگ
    await DocumentUtils.addMultipleTags(['تگ1', 'تگ2', 'تگ3']);


    await DocumentUtils.editDocument();

    // const toastMessage = page.locator('.Toastify__toast-body');
    // await expect(toastMessage).toBeVisible({ timeout: 8000 });
    // await expect(toastMessage).toContainText(
    //   'تگ‌ها با موفقیت به سند اضافه شدند.',
    //   { timeout: 5000 },
    // );


    await DocumentUtils.Deletetag();


    // اضافه کردن توقف در انتهای تست
    // await page.pause();
  });
});
