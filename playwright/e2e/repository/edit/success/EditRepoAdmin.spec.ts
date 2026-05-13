import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { AccessCat } from '../../../utils/access-control/AccessCat';
import { RepositoryUtils } from '../../../utils/repository/crudrepo/CreateRepository';
import { EditRepository } from '../../../utils/repository/crudrepo/EditRepositoryAdmin';

test.describe('Repository Edit Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let editRepo: EditRepository;
  let accessCat: AccessCat;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    editRepo = new EditRepository(page);
    accessCat = new AccessCat(page);

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

    // اشتراک‌گذاری مخزن با کاربر دیگر
    await accessCat.shareRepository('e.habibi');


    await authUtils.logout();

    // لاگین با حساب دیگر و بررسی شرطی دکمه پنل ادمین
    await authUtils.loginWithAnotherAccount(
      'e.habibi',
      '0936elhb',
    );

    await accessCat.AcceptRequest(); /**
 * تست‌های مربوط به ایجاد دسته‌بندی در سیستم
 */

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
