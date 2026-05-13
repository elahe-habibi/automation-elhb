import { test, expect } from '@playwright/test';
import { AuthUtils } from '../utils/core/auth';
import { RepositoryUtils } from '../utils/repository/crudrepo/CreateRepository';
import { EditDocument } from '../utils/editor/EditChange';
import { DocumentManager } from '../utils/document/create/CreateDocument';

test.describe('Media Upload Tests', () => {
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

  test('Upload Image to Editor', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'مخزن تست آپلود عکس',
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

    await DocumentUtils.editDocument();

    await page.waitForTimeout(2000);

    // آپلود تصویر نمونه
    await DocumentUtils.uploadSampleImage();

    await page.waitForTimeout(3000);

    console.log('آپلود تصویر با موفقیت انجام شد!');
  });

  test('Upload Video to Editor', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'مخزن تست آپلود ویدیو',
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

    await DocumentUtils.editDocument();

    await page.waitForTimeout(2000);

    // آپلود ویدیو نمونه
    await DocumentUtils.uploadSampleVideo();

    await page.waitForTimeout(3000);

    console.log('آپلود ویدیو با موفقیت انجام شد!');
  });

  test('Upload Audio to Editor', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'مخزن تست آپلود صدا',
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

    await DocumentUtils.editDocument();

    await page.waitForTimeout(2000);

    // آپلود فایل صوتی نمونه
    await DocumentUtils.uploadSampleAudio();

    await page.waitForTimeout(3000);

    console.log('آپلود فایل صوتی با موفقیت انجام شد!');
  });

  test('Upload All Media Types', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'مخزن تست آپلود همه رسانه',
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

    await DocumentUtils.editDocument();

    await page.waitForTimeout(2000);

    // آپلود همه انواع رسانه
    await DocumentUtils.uploadAllMediaTypes();

    await page.waitForTimeout(5000);

    console.log('آپلود همه انواع رسانه با موفقیت انجام شد!');
  });
});
