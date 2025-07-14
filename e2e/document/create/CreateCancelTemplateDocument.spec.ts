import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../utils/auth';
import { RepositoryUtils } from '../../utils/CreateRepository';
import { DocumentTemplateManager } from '../../utils/CreateCancelTemplateDocument';

test.describe('Document Creation Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let templateManager: DocumentTemplateManager;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    templateManager = new DocumentTemplateManager(page);

    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('Create New Template Document', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true
    );

    // رفتن به صفحه داشبورد
    await templateManager.goToDashboard();

    // انتخاب اولین مخزن
    await templateManager.selectFirstRepository();

    // کلیک روی دکمه ایجاد و انجام روند ایجاد سند
    await templateManager.clickCreateButton();

  });
});
