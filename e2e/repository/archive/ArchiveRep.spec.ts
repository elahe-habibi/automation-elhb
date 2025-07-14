import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../utils/auth';
import { RepositoryUtils } from '../../utils/CreateRepository';
import { EditRepository } from '../../utils/EditRepository';
import { ArchiveRepository } from '../../utils/ArchiveRepo';
import { WaitUtils } from '../../utils/waitutils';


test.describe('Repository Edit Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let editRepo: EditRepository;
  let archiveRepo: ArchiveRepository;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    editRepo = new EditRepository(page);
    archiveRepo = new ArchiveRepository(page);

    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('should edit repository', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true
    );

    // رفتن به صفحه داشبورد
    await editRepo.goToDashboard();

    // انتخاب اولین مخزن
    await editRepo.selectFirstRepository();

    // کلیک روی دکمه "کلیدهای مخزن"
    await archiveRepo.clickDropdownButton();
  });
});
