import { expect, test } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { RepositoryUtils } from '../../../utils/repository/crudrepo/CreateRepository';
import path from 'path';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);

    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('should create a repository with custom image upload', async ({
    page,
  }) => {
    // ایجاد مخزن با نام یکتا
    await repoUtils.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true,
    );

    // اشتراک‌گذاری مخزن با کاربر دیگر
    await repoUtils.shareRepository('emad.mh');

    // آپلود تصویر سفارشی
    const imagePath = path.join(__dirname, '../../assets/picture.jpg');
    await repoUtils.uploadCustomRepositoryImage(imagePath);

    // بررسی موفقیت‌آمیز بودن ایجاد لینک
    const successMessage = page.locator('.toast-success');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('مخزن با موفقیت ایجاد شد');
  });
});
