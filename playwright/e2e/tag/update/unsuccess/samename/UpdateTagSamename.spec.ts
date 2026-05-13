import { test } from '@playwright/test';
import { AuthUtils } from '../../../../utils/core/auth';
import { RepositoryUtils } from '../../../../utils/repository/crudrepo/CreateRepository';
import { EditRepository } from '../../../../utils/repository/crudrepo/EditRepository';
import { CreateTag } from '../../../../utils/tag/UpdateTagSamename';

test.describe('Tag Duplicate Name Tests', () => {
  let authUtils: AuthUtils;
  let repoUtils: RepositoryUtils;
  let editRepo: EditRepository;
  let tagUtils: CreateTag;

  test.beforeEach(async ({ page }) => {
    authUtils = new AuthUtils(page);
    repoUtils = new RepositoryUtils(page);
    editRepo = new EditRepository(page);
    tagUtils = new CreateTag(page);
    
    await authUtils.login('eli69', 'HQ[>684ngg');
    await authUtils.navigateToMyRepositories();
  });

  test('should show error when editing tag to duplicate name', async ({ page }) => {
    // 1. ایجاد مخزن تستی
    const repoName = await repoUtils.createRepositoryWithUniqueName(
      'مخزن تست تگ تکراری',
      true,
    );

    // 2. رفتن به داشبورد و انتخاب مخزن
    await editRepo.goToDashboard();
    await editRepo.selectFirstRepository();

    // 3. ایجاد دو تگ مجزا
    await tagUtils.createTag('تگ-اول');
    await tagUtils.createTag('تگ-دوم');

    // 4. ویرایش تگ دوم به نام تگ اول (ایجاد تکراری)
    await tagUtils.editTagToDuplicateName(1, 'تگ-اول'); // ایندکس 1 = تگ دوم

    // ✅ تست با موفقیت خطا را تأیید کرد
    console.log('🎉 تست تکراری تگ با موفقیت انجام شد!');
  });
});