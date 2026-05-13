import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../utils/core/auth';
import { RepositoryUtils } from '../../utils/repository/crudrepo/CreateRepository';
import { CreatePrivateFeedsRepository } from '../../utils/repository/crudrepo/CreatePrivateFeedsRepository';
import { EditRepository } from '../../utils/repository/crudrepo/EditRepository';

test.describe('Repository Edit Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let feedsRepo: CreatePrivateFeedsRepository;
  let editRepo: EditRepository;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    feedsRepo = new CreatePrivateFeedsRepository(page);
    editRepo = new EditRepository(page);

    // لاگین با بررسی شرطی دکمه پنل ادمین
    await authUtils.login('eli69', 'HQ[>684ngg', 'admin');
    await authUtils.navigateToMyRepositories();
  });

  test('should edit repository', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true,
    );

    await page.waitForLoadState('load'); // یا 'domcontentloaded', یا 'networkidle'

    await page.waitForTimeout(5000);

    // رفتن به صفحه داشبورد
    await editRepo.goToDashboard();

    // انتخاب اولین مخزن
    await editRepo.selectFirstRepository();

    await feedsRepo.clickDropdownButton();

    // ایجاد خبرنامه خصوصی
    await feedsRepo.createPrivateNewsletter(
      'عنوان خبرنامه',
      'متن خبرنامه',
      'https://example.com',
    );
  });
});
