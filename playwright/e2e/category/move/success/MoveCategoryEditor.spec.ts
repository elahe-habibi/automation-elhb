import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { RepositoryUtils } from '../../../utils/repository/crudrepo/CreateRepository';
import { CategoryManager } from '../../../utils/category/create/CreateCategory';
import { MoveCategory } from '../../../utils/category/move/MoveCategoty';
import { DocumentManager } from '../../../utils/document/create/CreateDocument';
import { EditRepositoryBookMark } from '../../../utils/repository/bookmark/BookmarkRepoEditor';




test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let CategoryUtils: MoveCategory;
  let categoryManager: CategoryManager;
  let editRepoBookMark: EditRepositoryBookMark;



  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    CategoryUtils = new MoveCategory(page);
    categoryManager = new CategoryManager(page);
    editRepoBookMark = new EditRepositoryBookMark(page);




    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('Create Category', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true,
    );


    await page.waitForTimeout(5000);

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

   
    // کلیک روی دکمه ایجاد
    await categoryManager.clickCreateButton();
    const toastMessage1 = page.locator('.Toastify__toast-body').first();
    await expect(toastMessage1).toBeVisible({ timeout: 10000 });
    await expect(toastMessage1).toContainText('با موفقیت ایجاد شد', {
      timeout: 5000,
    });

    // ایجاد دسته‌بندی دوم در همان مخزن
    await categoryManager.clickCreateButton();
    const toastMessage2 = page.locator('.Toastify__toast-body').last();
    await expect(toastMessage2).toBeVisible({ timeout: 10000 });
    await expect(toastMessage2).toContainText('با موفقیت ایجاد شد', {
      timeout: 5000,
    });


    await repoUtils.LogOut();

    // لاگین قبل از هر تست
    await authUtils.loginWithAnotherAccount('emad.mh', 'Em@d8970211');

    await page.waitForTimeout(3000);

    await repoUtils.AcceptRequest();

    await page.waitForTimeout(3000);

    // انتقال دسته‌بندی اول به دسته‌بندی دوم
    await CategoryUtils.moveCategory();

    
 // 5. ✅ بررسی فوری توست بدون هیچ تایم‌اوت اضافی
 const finalToastMessage = page.locator('.Toastify__toast-body').last();
 await expect(finalToastMessage).toBeVisible({ timeout: 8000 });
 await expect(finalToastMessage).toContainText(
   'دسته بندی مورد نظر با موفقیت انتقال یافت',
   { timeout: 5000 }
 );
 
 console.log('✅ انتقال دسته‌بندی با موفقیت تأیید شد');

  });
});
