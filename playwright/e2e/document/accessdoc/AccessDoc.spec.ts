import { expect, test } from '@playwright/test';
import { AuthUtils } from '../../utils/core/auth';
import { AccessDoc } from '../../utils/access-control/AccessDoc';
import { CategoryManager } from '../../utils/category/create/CreateCategory';
import { EditCategory } from '../../utils/category/edit/EditCategoty';
import { DocumentManager } from '../../utils/document/create/CreateDocument';

import path from 'path';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let accessCat: AccessDoc;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    accessCat = new AccessDoc(page);
    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('should create a repository with custom image upload', async ({
    page,
  }) => {
    // ایجاد مخزن با نام یکتا
    await accessCat.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true,
    );

    // اشتراک‌گذاری مخزن با کاربر دیگر
    await accessCat.shareRepository('emad.mh');

    await authUtils.logout();
    // لاگین قبل از هر تست
    await authUtils.loginWithAnotherAccount('emad.mh', 'Em@d8970211');

    await accessCat.AcceptRequest();

    // ایجاد یک نمونه از کلاس مدیریت سند
    const documentManager = new DocumentManager(page);

    await page.waitForTimeout(3000);

    // کلیک روی دکمه ایجاد و انجام روند ایجاد سند
    await documentManager.clickCreateButton();

    await page.waitForTimeout(3000);

    await authUtils.logout();

    await authUtils.loginWithAnotherAccount('eli69', 'HQ[>684ngg');

    await accessCat.AccessCatUtils();
  });
});
