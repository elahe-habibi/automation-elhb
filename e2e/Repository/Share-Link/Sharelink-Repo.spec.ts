import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../utils/auth';
import { RepositoryUtils } from '../../utils/Create-Repository';
import { EditRepository } from '../../utils/Edit-Repository';
import { EditRepositoryShareLink } from '../../utils/ShareLink-Repo';

test.describe('Repository Edit Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let editRepo: EditRepository;
  let editRepoShareLink: EditRepositoryShareLink;
  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    editRepo = new EditRepository(page);
    editRepoShareLink = new EditRepositoryShareLink(page);
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

    // کلیک روی دکمه منو
    await editRepoShareLink.clickDropdownButton();

    // // انتظار برای نمایش پیام موفقیت‌آمیز
    //await editRepo.waitForSuccessToast();
  });
});

// test.describe('Repository Share Link Tests', () => {
//   let authUtils: AuthUtils;
//   let repoUtils: RepositoryUtils;
//   let editRepo: EditRepository;
//   let editRepoShareLink: EditRepositoryShareLink;

//   test.beforeEach(async ({ page }) => {
//     // ایجاد نمونه‌های کلاس‌های کمکی
//     authUtils = new AuthUtils(page);
//     repoUtils = new RepositoryUtils(page);
//     editRepo = new EditRepository(page);
//     editRepoShareLink = new EditRepositoryShareLink(page);

//     // لاگین قبل از هر تست
//     await authUtils.login('eli69', 'HQ[>684ngg');
//     await authUtils.navigateToMyRepositories();
//   });

//   // تست برای هر نقش
//   for (let roleIndex = 0; roleIndex < 4; roleIndex++) {
//     test(`should create share link with role index ${roleIndex}`, async ({
//       page,
//     }) => {
//       // ایجاد مخزن با نام یکتا
//       const repoName = await repoUtils.createRepositoryWithUniqueName(
//         'این یک مخزن تستی است',
//         true
//       );

//       // رفتن به صفحه داشبورد
//       await editRepo.goToDashboard();

//       // انتخاب اولین مخزن
//       await editRepo.selectFirstRepository();

//       // ایجاد لینک اشتراک‌گذاری با نقش مشخص
//       await editRepoShareLink.createShareLinkWithRole(roleIndex);

//       // بررسی موفقیت‌آمیز بودن ایجاد لینک
//       const successMessage = page.locator('.toast-success');
//       await expect(successMessage).toBeVisible();
//       await expect(successMessage).toContainText('لینک با موفقیت ایجاد شد');
//     });
 // }
//});
