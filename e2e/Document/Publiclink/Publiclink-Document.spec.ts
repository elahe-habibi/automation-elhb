import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../utils/auth';
import { RepositoryUtils } from '../../utils/Create-Repository';
import { EditCategory } from '../../utils/Edit-Categoty';
import { DocumentManager } from '../../utils/Create-Document';
import { PubliclinknDocument }  from  '../../utils/Publiclink-Document'
import path from 'path';

test.describe('Repository Create and Share', () => {
    let authUtils: AuthUtils;
    let repoUtils: RepositoryUtils;
    let PubliclinkDocUtils: PubliclinknDocument;

    test.beforeEach(async ({ page }) => {
        // ایجاد نمونه‌های کلاس‌های کمکی
        authUtils = new AuthUtils(page);
        repoUtils = new RepositoryUtils(page);
        PubliclinkDocUtils = new PubliclinknDocument(page);

        // لاگین قبل از هر تست
        await authUtils.login('eli69', 'HQ[>684ngg');
        await authUtils.navigateToMyRepositories();
    });


    test('Create New Document', async ({ page }) => {
        // ایجاد مخزن با نام یکتا
        const repoName = await repoUtils.createRepositoryWithUniqueName('این یک مخزن تستی است', true);
    
        // ایجاد یک نمونه از کلاس مدیریت سند
        const documentManager = new DocumentManager(page);
    
        // رفتن به صفحه داشبورد
        await documentManager.goToDashboard();
    
        // انتخاب اولین مخزن
        await documentManager.selectFirstRepository();
    
        // کلیک روی دکمه ایجاد و انجام روند ایجاد سند
        await documentManager.clickCreateButton();

        await PubliclinkDocUtils.PubliclinkDoc();

        const toastMessage = page.locator('.Toastify__toast-body');
        await expect(toastMessage).toBeVisible({ timeout: 10000 });
        await expect(toastMessage).toContainText('موفقیت', { timeout: 5000 });



    });
}); 



