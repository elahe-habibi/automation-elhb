import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../utils/core/auth';
import { RepositoryUtils } from '../../utils/repository/CreateRepository';
import { EditDocument } from '../../utils/document/EditDocument';
import { DocumentManager } from '../../utils/document/CreateDocument';
import { BookMarkDocument } from '../../utils/document/BookMarkCancelDocument';

test.describe('Repository Create and Share', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let DocBookUtils: EditDocument;
  let bookmarkUtils: BookMarkDocument;

  test.beforeEach(async ({ page }) => {
    // ایجاد نمونه‌های کلاس‌های کمکی
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    DocBookUtils = new EditDocument(page);
    bookmarkUtils = new BookMarkDocument(page);

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

    await bookmarkUtils.bookmarkDocument();
  });
});
