import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../../utils/core/auth';
import { RepositoryUtils } from '../../../../utils/repository/crudrepo/CreateRepository';
import { EditRepository } from '../../../../utils/repository/crudrepo/EditRepository';
import { FilemanageRepository } from '../../../../utils/file-management/delete/DeleteFilemanagmentRepo';
import path from 'path';

test.describe('Repository Edit Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let editRepo: EditRepository;
  let filemanageRepo: FilemanageRepository;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    editRepo = new EditRepository(page);
    filemanageRepo = new FilemanageRepository(page);

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

    // رفتن به صفحه داشبورد
    await editRepo.goToDashboard();

    // انتخاب اولین مخزن
    await editRepo.selectFirstRepository();

    // کلیک روی دکمه "کلیدهای مخزن"
    await filemanageRepo.clickDropdownButton();

    const imagePath = path.join(process.cwd(), 'assets/picture.jpg');
    await filemanageRepo.uploadCustomRepository(imagePath);
    
  });
});
