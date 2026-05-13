import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../../../utils/core/auth';
import { RepositoryUtils } from '../../../../../utils/repository/crudrepo/CreateRepository';
import { DocumentManager } from '../../../../../utils/document/create/CreateDocument';
import { PasswordDocument } from '../../../../../utils/document/password/PasswordonDocument';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let PasswordonDocument: PasswordDocument;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    PasswordonDocument = new PasswordDocument(page);
    // لاگین قبل از هر تست
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('Create New Document', async ({ page }) => {
    // ایجاد مخزن با نام یکتا
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'این یک مخزن تستی است',
      true,
    );

    // ایجاد یک نمونه از کلاس مدیریت سند
    const documentManager = new DocumentManager(page);

    // رفتن به صفحه داشبورد
    await documentManager.goToDashboard();

    // انتخاب اولین مخزن
    await documentManager.selectFirstRepository();

    // کلیک روی دکمه ایجاد و انجام روند ایجاد سند
    await documentManager.clickCreateButton();

    await PasswordonDocument.PasswordDocumentEditCancel();

    
  });
});
