import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { RepositoryUtils } from '../../../utils/repository/crudrepo/CreateRepository';
import { EditRepository } from '../../../utils/repository/crudrepo/EditRepositorySamename';

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
    await authUtils.login('hamid.ahmadnejad.b', 'hamid123');
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
    //await editRepo.editRepositoryDescription('این مخزن ویرایش شده است');

    //await editRepo.editRepositoryPic();

    // // ذخیره تغییرات
    await editRepo.saveChanges();

    // // انتظار برای نمایش پیام موفقیت‌آمیز
    await editRepo.waitForSuccessToast();


  // ✅ استفاده از لوکیتور دقیق برای توست خطا
  const errorMessage = page.locator('.Toastify__toast--error, .toast-error');
  await expect(errorMessage).toBeVisible({ timeout: 5000 });
  
  // ✅ تأیید متن دقیق خطا
  await expect(errorMessage).toContainText('تغییری در مخزن وجود ندارد');
  
  console.log('✅ تست موفق: پیام خطا به درستی نمایش داده شد');
    // // بررسی موفقیت‌آمیز بودن ایجاد لینک
    // const successMessage = page.locator('.toast-success');
    // await expect(successMessage).toBeVisible();
    // await expect(successMessage).toContainText(
    //  'تغییری در مخزن وجود ندارد',
    // );

   
  });
});
