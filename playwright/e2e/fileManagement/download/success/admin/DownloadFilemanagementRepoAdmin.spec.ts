import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../../utils/core/auth';
import { RepositoryUtils } from '../../../../utils/repository/crudrepo/CreateRepository';
import { EditRepository } from '../../../../utils/repository/crudrepo/EditRepository';
import { FilemanageRepository } from '../../../../utils/file-management/DownloadFilemanagement-Repo';
import { DocumentManager } from '../../../../utils/document/create/CreateDocument';
import path from 'path';

test.describe('Repository Edit Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let editRepo: EditRepository;
  let filemanageRepo: FilemanageRepository;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    editRepo = new EditRepository(page);
    filemanageRepo = new FilemanageRepository(page);

    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('should edit repository', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
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

    // کلیک روی دکمه ایجاد و انجام روند ایجاد سند
    //await documentManager.clickCreateButton();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    //await DocumentUtils.editDocument();
    // کلیک روی دکمه منو
    await repoUtils.clickDropdownButton();

     // کلیک روی دکمه "کلیدهای مخزن"
     await filemanageRepo.clickDropdownButton();

     // آپلود تصویر سفارشی
     const imagePath = path.join(process.cwd(), 'assets/picture.jpg');
     await filemanageRepo.uploadCustomRepository(imagePath);

     await page.getByRole('dialog').locator('button.close-button').click();


    await repoUtils.LogOut();

    // لاگین قبل از هر تست
    await authUtils.loginWithAnotherAccount('emad.mh', 'Em@d8970211');

    await page.waitForTimeout(3000);

    await repoUtils.AcceptRequest();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

     // کلیک روی دکمه "کلیدهای مخزن"
    await filemanageRepo.clickDropdownButton();

    await filemanageRepo.manageFiles();
  });
});
