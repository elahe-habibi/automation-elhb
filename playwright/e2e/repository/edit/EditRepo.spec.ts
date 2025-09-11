import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../utils/core/auth';
import { RepositoryUtils } from '../../utils/repository/CreateRepository';
import { EditRepository } from '../../utils/repository/EditRepository';

test.describe('Repository Edit Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let editRepo: EditRepository;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    editRepo = new EditRepository(page);

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

    // کلیک روی دکمه منو
    await editRepo.clickDropdownButton();

    // ویرایش نام مخزن
    const newName = `مخزن-ویرایش-شده-${Date.now()}`;
    await editRepo.editRepositoryName(newName);

    // ویرایش توضیحات مخزن
    await editRepo.editRepositoryDescription('این مخزن ویرایش شده است');

    await editRepo.editRepositoryPic();

    // // ذخیره تغییرات
    await editRepo.saveChanges();

    // // انتظار برای نمایش پیام موفقیت‌آمیز
    await editRepo.waitForSuccessToast();
  });
});
