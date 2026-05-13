import { test } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { RepositoryUtils } from '../../../utils/repository/crudrepo/CreateRepository';
import { CategoryManager } from '../../../utils/category/create/CreateInvalidorderCategory';

test.describe('Category Invalid Order Tests', () => {
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

  test('should show error for invalid order value (negative number)', async ({ page }) => {
    // ایجاد مخزن تستی
    await repoUtils.createRepositoryWithUniqueName(
      'مخزن تست order نامعتبر',
      true,
    );

    // رفتن به داشبورد و انتخاب مخزن
    await categoryManager.goToDashboard();

    await page.waitForTimeout(6000);

    await categoryManager.selectFirstRepository();

    // ✅ اجرای تست order نامعتبر
    await categoryManager.createCategoryWithInvalidOrder();

    console.log('🎉 تست order نامعتبر با موفقیت انجام شد!');
  });
});