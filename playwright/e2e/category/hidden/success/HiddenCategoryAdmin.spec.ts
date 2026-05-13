import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { RepositoryUtils } from '../../../utils/repository/crudrepo/CreateRepository';
import { CategoryManager } from '../../../utils/category/create/CreateCategory';
import { DeleteCategory } from '../../../utils/category/delete/DeleteCategotyAdmin';
import { DocumentManager } from '../../../utils/document/create/CreateDocument';
import { EditCategory } from '../../../utils/category/edit/EditCategoty';
import { HiddenCategory } from '../../../utils/category/HiddenCategoty';




test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let CategoryUtils: DeleteCategory;
  let categoryManager: CategoryManager;
  let CategooryUtils: EditCategory;
  let HiddenCategoryUtils: HiddenCategory;




  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    CategoryUtils = new DeleteCategory(page);
    categoryManager = new CategoryManager(page);
    CategooryUtils = new EditCategory(page);
    HiddenCategoryUtils = new HiddenCategory(page);




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

    // کلیک روی دکمه منو
    await repoUtils.clickDropdownButton();

    await categoryManager.clickCreateButton();

    await repoUtils.LogOut();

    // لاگین قبل از هر تست
    await authUtils.loginWithAnotherAccount('emad.mh', 'Em@d8970211');

    await page.waitForTimeout(3000);

    await repoUtils.AcceptRequest();

    await page.waitForTimeout(3000);

  
    await HiddenCategoryUtils.hiddenCategory();

    const toastMessage = page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 10000 });
    await expect(toastMessage).toContainText('مخفی شد', { timeout: 5000 });

    await page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای
  });
});
