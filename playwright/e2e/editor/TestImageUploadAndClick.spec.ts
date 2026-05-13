import { test, expect } from '@playwright/test';
import { AuthUtils } from '../utils/core/auth';
import { RepositoryUtils } from '../utils/repository/crudrepo/CreateRepository';
import { EditDocument } from '../utils/editor/EditChange';
import { DocumentManager } from '../utils/document/create/CreateDocument';

test.describe('Image Upload and First Row Click Test', () => {
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

  test('Upload Image and Click First Row', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'تست کلیک روی ردیف اول',
      true,
    );

    await page.waitForTimeout(2000);

    // ایجاد یک نمونه از کلاس مدیریت سند
    const documentManager = new DocumentManager(page);

    // رفتن به صفحه داشبورد
    await documentManager.goToDashboard();

    // انتخاب اولین مخزن
    await documentManager.selectFirstRepository();

    // کلیک روی دکمه ایجاد و انجام روند ایجاد سند
    await documentManager.clickCreateButton();

    await page.waitForTimeout(2000);

    // شروع ویرایش سند
    await DocumentUtils.editDocument();

    await page.waitForTimeout(2000);

    // آپلود تصویر - این تابع حالا به طور خودکار روی اولین ردیف کلیک می‌کند
    console.log('شروع آپلود تصویر...');
    await DocumentUtils.uploadSampleImage();
    console.log('آپلود تصویر و کلیک روی ردیف اول تکمیل شد');

    await page.waitForTimeout(3000);

    // توقف برای بررسی نتیجه
    // await page.pause();
  });
});

