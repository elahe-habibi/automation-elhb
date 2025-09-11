import { expect, test } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { RepositoryUtils } from '../../../utils/version/SendReqWriterVertoOwner';
import { DocumentManager } from '../../../utils/document/CreateDocument';
import { EditDocument } from '../../../utils/document/EditContentverDocument';
import { AcceptDraft } from '../../../utils/version/AcceptDraft';
import path from 'path';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let DocumentUtils: EditDocument;
  let AcceptDraftUtils: AcceptDraft;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    DocumentUtils = new EditDocument(page);
    AcceptDraftUtils = new AcceptDraft(page);

    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('should create a repository with custom image upload', async ({
    page,
  }) => {
    // ایجاد مخزن با نام یکتا
    await repoUtils.createRepositoryWithUniqueName(
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

    // کلیک روی دکمه منو
    await repoUtils.clickDropdownButton();

    await repoUtils.LogOut();
    // لاگین قبل از هر تست
    await authUtils.loginWithAnotherAccount('emad.mh', 'Em@d8970211');

    await repoUtils.AcceptRequest();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // کلیک روی دکمه ایجاد و انجام روند ایجاد سند
    await documentManager.clickCreateButton();

    await page.waitForTimeout(3000); // تاخیر ۲ ثانیه‌ای

    await repoUtils.acceptDraft();

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    await repoUtils.LogOut();

    await page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    await repoUtils.loginn('eli69', 'HQ[>684ngg');

    await authUtils.navigateToMyRepositories();

    await page.waitForTimeout(8000); // تاخیر ۲ ثانیه‌ای

    //await repoUtils.SendReqPublicVersion();

    await repoUtils.AcceptReqPublic();
  });
});
