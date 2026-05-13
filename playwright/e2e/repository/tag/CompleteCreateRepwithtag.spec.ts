import { expect, test } from '@playwright/test';
import { AuthUtils } from '../../../e2e/utils/core/auth';
import { RepositoryUtils } from '../../utils/repository/crudrepo/CreateRepositorywithtag';
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
    // ایجاد مخزن با نام یکتا
    await repoUtils.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true,
    );

    // اشتراک‌گذاری مخزن با کاربر دیگر
    await repoUtils.shareRepository('emad.mh');

    // افزودن یک تگ
    await repoUtils.addTag('تگ_تست');

    // افزودن چندین تگ
    await repoUtils.addMultipleTags(['تگ1', 'تگ2', 'تگ3']);


    
  // ⚠️ این خط جدید: رفتن به مرحله بعد (آپلود تصویر)
  await repoUtils.continueToNextStep();
    
  const imagePath = path.resolve(process.cwd(), 'e2e/assets/picture.jpg');
  await repoUtils.uploadCustomRepositoryImage(imagePath); // ✅ مسیر کامل

   
    //  حذف import path و استفاده مستقیم از URL
    // const imagePath = new URL('../../../e2e/assets/picture.jpg')
    //   .pathname;
    // await repoUtils.uploadCustomRepositoryImage(imagePath);
    // بررسی موفقیت‌آمیز بودن ایجاد لینک


    const successMessage = page.locator('.toast-success');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('مخزن با موفقیت ایجاد شد');
  });
});
