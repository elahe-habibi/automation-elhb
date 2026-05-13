import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { AccessCat } from '../../../utils/access-control/AccessCat';
import { CategoryManager } from '../../../utils/category/create/CreateCategory';
import { EditCategory } from '../../../utils/category/edit/EditCategoty';
import path from 'path';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let accessCat: AccessCat;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    accessCat = new AccessCat(page);
    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg', 'admin');
    await authUtils.navigateToMyRepositories();
  });

  test('should create a repository with custom image upload', async ({
    page,
  }) => {
    // ایجاد مخزن با نام یکتا
    await accessCat.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true,
    );

    // اشتراک‌گذاری مخزن با کاربر دیگر
    await accessCat.shareRepository('emad.mh');

    await authUtils.logout();
    // لاگین با حساب دیگر و بررسی شرطی دکمه پنل ادمین
    await authUtils.loginWithAnotherAccount(
      'emad.mh',
      'Em@d8970211',
    );

    await accessCat.AcceptRequest(); /**
     * تست‌های مربوط به ایجاد دسته‌بندی در سیستم
     */
    // ایجاد یک نمونه از کلاس مدیریت دسته‌بندی
    const categoryManager = new CategoryManager(page);

    // رفتن به صفحه داشبورد
    await categoryManager.goToDashboard();

    // انتخاب اولین مخزن
    await categoryManager.selectFirstRepository();

    // کلیک روی دکمه ایجاد
    await categoryManager.clickCreateButton();

    await authUtils.logout();

    await authUtils.loginWithAnotherAccount(
      'eli69',
      'HQ[>684ngg',
    );

    await accessCat.AccessCatUtils();
  });
});
