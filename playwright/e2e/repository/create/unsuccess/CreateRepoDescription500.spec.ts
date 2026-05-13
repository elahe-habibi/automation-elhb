import { expect, test } from '@playwright/test';
import { AuthUtils } from '../../../../e2e/utils/core/auth';
import { RepositoryUtils } from '../../../utils/repository/crudrepo/CreateRepository500charachter';
import path from 'path';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);

    // لاگین قبل از هر تست
    await authUtils.login('hamid.ahmadnejad.b', 'hamid123');
    await authUtils.navigateToMyRepositories();
  });

  test('should create a repository with custom image upload', async ({
    page,
  }) => {
  
    const longDesc = 'تست '.repeat(220);
    await repoUtils.createRepositoryWithUniqueName(longDesc, true);
    //await page.waitForTimeout(3000);

    // اشتراک‌گذاری مخزن با کاربر دیگر
    //await repoUtils.shareRepository('emad.mh');

    // // آپلود تصویر سفارشی
    // const imagePath = path.join(__dirname, '../../assets/picture.jpg');
    // await repoUtils.uploadCustomRepositoryImage(imagePath);

    // بررسی موفقیت‌آمیز بودن ایجاد لینک
    const successMessage = page.locator('.toast-success');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText(
     ' توضیحات نمیتواند بیشتر از 500 کاراکتر باش - cl-20',
    );
  });
});
