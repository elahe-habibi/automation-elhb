import { test } from '@playwright/test';
import { AuthUtils } from '../../utils/auth';
import { RepositoryUtils } from '../../utils/Create-Repository';
import { DocumentManager } from '../../utils/Create-Document';
import { expect } from '@playwright/test';
import { WaitUtils } from '../../utils/wait-utils';

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
      true
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

    const toastMessage = page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 10000 });
    await expect(toastMessage).toContainText(
      'نسخه مورد نظر با موفقیت ایجاد گردید.',
      { timeout: 5000 }
    );
  });
});
