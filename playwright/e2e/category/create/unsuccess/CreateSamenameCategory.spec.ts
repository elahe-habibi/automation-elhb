import { test } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { RepositoryUtils } from '../../../utils/repository/crudrepo/CreateRepository';
import { CategoryManager } from '../../../utils/category/create/CreateSamenameCategory';

test.describe('Category Duplicate Name Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let categoryManager: CategoryManager;

  test.beforeEach(async ({ page }) => {
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    categoryManager = new CategoryManager(page);

    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('should show error when creating duplicate category name', async ({ page }) => {
    // 1. ایجاد مخزن تستی
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'مخزن تست دسته‌بندی تکراری',
      true,
    );

    // 2. رفتن به داشبورد و انتخاب مخزن
    await categoryManager.goToDashboard();

    await page.waitForTimeout(6000);

    await categoryManager.selectFirstRepository();

    // 3. ایجاد دسته‌بندی اول (موفقیت‌آمیز)
    const categoryName = 'دسته‌بندی-تکراری';
    await categoryManager.createCategory(categoryName);

    // 4. تلاش برای ایجاد دسته‌بندی دوم با همان نام (باید خطا بدهد)
    await categoryManager.createDuplicateCategoryAndVerifyError(categoryName);

    console.log('🎉 تست دسته‌بندی تکراری با موفقیت انجام شد!');
  });
});