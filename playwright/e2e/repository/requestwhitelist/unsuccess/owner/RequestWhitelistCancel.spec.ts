import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../../utils/core/auth';
import { RepositoryUtils } from '../../../../utils/repository/crudrepo/CreateRepository';
import { EditRepository } from '../../../../utils/repository/crudrepo/EditRepository';
import { EditRepositoryShareLink } from '../../../../utils/repository/requestaccesstodoc/unsuccess/owner/RequestWhitelistCancel';
import { DocumentManager } from '../../../../utils/document/create/CreateDocument';
import { WaitUtils } from '../../../../utils/core/waitutils';
import { LimitAccessDocument } from '../../../../utils/access-control/LimitAccessDocument';


test.describe('Repository Edit Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let editRepo: EditRepository;
  let editRepoShareLink: EditRepositoryShareLink;
  let waitUtils: WaitUtils;
  let LimitAccessonDocument: LimitAccessDocument;



  
  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    editRepo = new EditRepository(page);
    editRepoShareLink = new EditRepositoryShareLink(page);
    waitUtils = new WaitUtils(page);
    LimitAccessonDocument = new LimitAccessDocument(page);


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

    // رفتن به صفحه داشبورد
    await documentManager.goToDashboard();

    // انتخاب اولین مخزن
    await documentManager.selectFirstRepository();

    // کلیک روی دکمه ایجاد و انجام روند ایجاد سند
    await documentManager.clickCreateButton();

    await LimitAccessonDocument.LimitAccessDocument();

    // کلیک روی دکمه منو
    await editRepoShareLink.createPublishLink();

    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');

    await editRepoShareLink.AcceptRequestWhitelist();



  // // ✅ باز کردن همان صفحه در یک تب جدید
  // const newPage = await editRepoShareLink.openCurrentPublishLinkInNewPage();
  
  // // حالا می‌توانید روی newPage کار کنید
  // await expect(newPage.locator('body')).toBeVisible();
  // console.log('✅ تست در پنجره جدید انجام شد');
  
  // // پاکسازی (اختیاری)
  // await newPage.close();



    // // انتظار برای نمایش پیام موفقیت‌آمیز
    //await editRepo.waitForSuccessToast();
  });
});
