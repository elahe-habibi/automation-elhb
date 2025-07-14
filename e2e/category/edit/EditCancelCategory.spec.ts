import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../utils/auth';
import { RepositoryUtils } from '../../utils/CreateRepository';
import { CategoryManager } from '../../utils/CreateCategory';
import { EditCategory } from '../../utils/EditCancelCategoty';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let CategoryUtils: EditCategory;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    CategoryUtils = new EditCategory(page);

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

    await CategoryUtils.editCategory();
    
  });
});
