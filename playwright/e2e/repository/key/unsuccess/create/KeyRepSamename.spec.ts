import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../../utils/core/auth';
import { RepositoryUtils } from '../../../../utils/repository/crudrepo/CreateRepository';
import { EditRepository } from '../../../../utils/repository/crudrepo/EditRepository';
import { KeyRepository } from '../../../../utils/repository/key/KeyRepoSamename';

test.describe('Repository Edit Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let editRepo: EditRepository;
  let keyRepo: KeyRepository;
  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    editRepo = new EditRepository(page);
    keyRepo = new KeyRepository(page);

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
    await keyRepo.openKeysDialog();

    
    // 4. ایجاد کلید اول (موفقیت‌آمیز)
    await keyRepo.createRepositoryKey('کلید-تکراری');

    // 5. تلاش برای ایجاد کلید دوم با همان نام (باید خطا بدهد)
    await keyRepo.createDuplicateKeyAndVerifyError('کلید-تکراری');

    console.log('🎉 تست کلید تکراری با موفقیت انجام شد!');
  });
});
