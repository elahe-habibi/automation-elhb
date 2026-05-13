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

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // تغییر اندازه فونت به صورت رندوم
    await DocumentUtils.changeFontSizeRandom();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // تغییر فونت به ایران نستعلیق
    await DocumentUtils.changeToIranNastaliq();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // تغییر رنگ پس زمینه فونت به صورت رندوم
    await DocumentUtils.changeBackgroundColorRandom();
    
    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // تغییر رنگ فونت (متن) به صورت رندوم
    await DocumentUtils.changeTextColorRandom();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // تنظیم رنگ فونت روی زرد
    await DocumentUtils.changeTextColorByName('زرد');

    // اعمال خط خورده
    await DocumentUtils.toggleStrikethrough();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // اعمال خط زیر
    await DocumentUtils.toggleUnderline();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // اعمال کج
    await DocumentUtils.toggleItalic();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // اعمال درشت
    await DocumentUtils.toggleBold();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // تغییر تراز متن به وسط چین
    await DocumentUtils.alignCenter();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // درج خط افقی
    await DocumentUtils.insertHorizontalRule();

    await DocumentUtils.uploadExcelFile();
    // تغییر فونت به B Nazanin
    await DocumentUtils.changeToBNazanin();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // اضافه کردن توقف در انتهای تست
    // await page.pause();
  });
});
