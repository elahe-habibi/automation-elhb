import { test, expect } from '@playwright/test';
import { AuthUtils } from '../utils/core/auth';
import { RepositoryUtils } from '../utils/repository/crudrepo/CreateRepository';
import { EditDocument } from '../utils/editor/EditChange';
import { DocumentManager } from '../utils/document/create/CreateDocument';

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

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

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

    // انتخاب متن
    await DocumentUtils.selectText('الی ناز دار خوشگل');

    await DocumentUtils.clickRightAlignToolbarButton();

    await DocumentUtils.toggleSuperscript();

    // تغییر فونت به ایران نستعلیق
    await DocumentUtils.changeToIranNastaliq();

    // اعمال پایین نویس
    await DocumentUtils.toggleSubscript();

    // تغییر فونت به B Nazanin
    await DocumentUtils.changeToBNazanin();

    // درج نمودار
    await DocumentUtils.insertChart();

    // آپلود فایل Word نمونه
    await DocumentUtils.uploadSampleDocx();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // آپلود تصویر نمونه
    await DocumentUtils.uploadSampleImage();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // آپلود ویدیو نمونه
    //await DocumentUtils.uploadSampleVideo();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // آپلود فایل صوتی نمونه
    //await DocumentUtils.uploadSampleAudio();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // اضافه کردن کاراکتر ویژه
    await DocumentUtils.insertSpecialCharacter();

    await page.waitForTimeout(1000); // تاخیر ۱ ثانیه‌ای

    await DocumentUtils.clickSwaggerButton();

    await page.waitForTimeout(1000); // تاخیر ۱ ثانیه‌ای

    await DocumentUtils.clickBlockQuote();

    await page.waitForTimeout(1000); // تاخیر ۱ ثانیه‌ای
    // اضافه کردن بلوک کد
    await DocumentUtils.insertCodeBlock();

    await page.waitForTimeout(1000); // تاخیر ۱ ثانیه‌ای

    // انتخاب متن مورد نظر
    await DocumentUtils.selectText('الی ناز دار خوشگل');

    await page.waitForTimeout(1000); // تاخیر ۱ ثانیه‌ای

    // کلیک روی دکمه انتخاب همه
    await DocumentUtils.clickSelectAllButton();

    await page.waitForTimeout(1000); // تاخیر ۱ ثانیه‌ای

    await DocumentUtils.uploadAttachedFile();

    await page.waitForTimeout(1000); // تاخیر ۱ ثانیه‌ای

    // کلیک روی دکمه برش صفحه
    await DocumentUtils.clickPageBreakButton();

    await page.waitForTimeout(1000); // تاخیر ۱ ثانیه‌ای

    // کلیک روی دکمه فعال کردن ویرایش
    await DocumentUtils.clickEnableEditButton();

    await page.waitForTimeout(1000); // تاخیر ۱ ثانیه‌ای
 // تاخیر ۱ ثانیه‌ای
    await DocumentUtils.manageClasorContents();

    await page.waitForTimeout(1000); // تاخیر ۱ ثانیه‌ای

    // کلیک روی دکمه بازگردانی
    await DocumentUtils.clickUndoButton();

    await page.waitForTimeout(1000);

    // کلیک روی دکمه Source
    await DocumentUtils.clickSourceButton();

    await page.waitForTimeout(1000);
    
    await DocumentUtils.clickLinkButton();

    await page.waitForTimeout(1000);

    // اضافه کردن توقف در انتهای تست
    // await page.pause();
  });
});
