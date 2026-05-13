import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { RepositoryUtils } from '../../../utils/repository/crudrepo/CreateRepository';
import { CategoryManager } from '../../../utils/category/create/CreateCategoryAdmin';
import { DocumentManager } from '../../../utils/document/create/CreateDocument';
import { EditRepositoryBookMark } from '../../../utils/repository/bookmark/BookmarkRepoEditor';


test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let categoryManager: CategoryManager;
  let editRepoBookMark: EditRepositoryBookMark;
  

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    categoryManager = new CategoryManager(page);
    editRepoBookMark = new EditRepositoryBookMark(page);
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
    await editRepoBookMark.shareRepository('emad.mh');

    // رفتن به صفحه داشبورد
    await documentManager.goToDashboard();

    // انتخاب اولین مخزن
    await documentManager.selectFirstRepository();

    // کلیک روی دکمه منو
    await repoUtils.clickDropdownButton();


    await repoUtils.LogOut();

    // لاگین قبل از هر تست
    await authUtils.loginWithAnotherAccount('emad.mh', 'Em@d8970211');

    await page.waitForTimeout(3000);

    await repoUtils.AcceptRequest();

    await page.waitForTimeout(3000);

    // کلیک روی دکمه ایجاد
    await categoryManager.clickCreateButton(); //

    const toastMessage = page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 10000 });
    await expect(toastMessage).toContainText('دسته بندی با موفقیت ایجاد شد.', { timeout: 5000 });
  });
});
