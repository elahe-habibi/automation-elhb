import { test } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { RepositoryUtils } from '../../../utils/repository/crudrepo/CreateRepository';
import { DocumentManager } from '../../../utils/document/create/CreateDocumentOrdererror';
import { expect } from '@playwright/test';
import { WaitUtils } from '../../../utils/core/waitutils';

test.describe('Document Creation Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let waitUtils: WaitUtils;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    waitUtils = new WaitUtils(page);

    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('Create New Document', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    await repoUtils.createRepositoryWithUniqueName(
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

    // بررسی موفقیت‌آمیز بودن ایجاد سند
    await waitUtils.waitForPageLoad();

    const warningMessage = page.locator('.warning_text');

    await expect(warningMessage).toBeVisible({ timeout: 10000 });
    await expect(warningMessage).toHaveText(
      'فیلد order از نوع عدد بزرگتر از 0 میباشد',
    );

    // بستن دیالوگ
    await page.keyboard.press('Escape');
  });
});
