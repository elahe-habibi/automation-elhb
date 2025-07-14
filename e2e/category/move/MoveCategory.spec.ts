import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../utils/auth';
import { RepositoryUtils } from '../../utils/CreateRepository';
import { CategoryManager } from '../../utils/CreateCategory';
import { MoveCategory } from '../../utils/MoveCategoty';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let CategoryUtils: MoveCategory;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    CategoryUtils = new MoveCategory(page);

    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('Create Category', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true
    );

    /**
     * تست‌های مربوط به ایجاد دسته‌بندی در سیستم
     */
    // ایجاد یک نمونه از کلاس مدیریت دسته‌بندی
    const categoryManager = new CategoryManager(page);

    // رفتن به صفحه داشبورد
    await categoryManager.goToDashboard();

    // انتخاب اولین مخزن
    await categoryManager.selectFirstRepository();

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

    // انتقال دسته‌بندی اول به دسته‌بندی دوم
    await CategoryUtils.moveCategory();

    const finalToastMessage = page.locator('.Toastify__toast-body').last();
    await expect(finalToastMessage).toBeVisible({ timeout: 10000 });
    await expect(finalToastMessage).toContainText('موفقیت انتقال یافت', {
      timeout: 5000,
    });
  });
});
