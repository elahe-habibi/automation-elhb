import { test } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { RepositoryUtils } from '../../../utils/repository/crudrepo/CreateRepository';
import { DocumentManager } from '../../../utils/document/create/CreateDocumentSamename';
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

  test('Create Document With Duplicate Name Should Fail', async ({ page }) => {

    await repoUtils.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true,
    );
  
    const documentManager = new DocumentManager(page);

    await documentManager.goToDashboard();
    await documentManager.selectFirstRepository();
  
    // ✅ ساخت سند اول و گرفتن نام آن
    const documentName = await documentManager.clickCreateButton();

    
    const successToast = page.locator('.Toastify__toast-body');

    try {
      await expect(successToast).toContainText(
        'نسخه مورد نظر با موفقیت ایجاد گردید.',
        { timeout: 10000 },
      );
    } catch (e) {
      console.log('Toast پیدا نشد، ادامه تست...');
    }
    
  
    // ✅ تلاش برای ساخت سند دوم با همان نام
    await documentManager.createDocumentWithName(documentName);
  
    const errorToast = page.locator('.Toastify__toast-body');
    await expect(errorToast).toBeVisible({ timeout: 10000 });
    await expect(errorToast).toContainText('عنوان نمی تواند تکراری باشد');

  });
  
  
});
