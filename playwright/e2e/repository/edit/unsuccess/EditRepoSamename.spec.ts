import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../utils/core/auth';
import { RepositoryUtils } from '../../../utils/repository/crudrepo/CreateRepository';
import { EditRepository } from '../../../utils/repository/crudrepo/EditRepositorySamenamewithotherrepo';

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
  
    // ═════════════════════════════════════════════════════════
    // مرحله ۱: ایجاد مخزن اول و ذخیره نام آن
    // ═════════════════════════════════════════════════════════
    console.log('╔════════════════════════════════════════════════════════');
    console.log('║ مرحله ۱: ایجاد مخزن اول');
    console.log('╚════════════════════════════════════════════════════════');
    
    const firstRepoName = await repoUtils.createRepositoryWithUniqueName(
      'توضیحات مخزن اول برای تست هم‌نامی',
      true,
    );
    
    console.log(`✅ نام مخزن اول ذخیره شد: ${firstRepoName}`);
    
    // ✅ انتظار برای بارگذاری کامل و ثبات صفحه
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // تاخیر اضافی برای اطمینان

    // ═════════════════════════════════════════════════════════
    // مرحله ۲: رفتن به لیست مخازن
    // ═════════════════════════════════════════════════════════
    console.log('╔════════════════════════════════════════════════════════');
    console.log('║ مرحله ۲: رفتن به لیست مخازن');
    console.log('╚════════════════════════════════════════════════════════');
    
    await page.goto('https://clasor.pod.ir/admin/myRepoList');
    await page.waitForLoadState('networkidle');
    
    // ✅ انتظار برای ظهور حداقل یک مخزن در لیست
    await page.waitForSelector('.repo-card', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // ═════════════════════════════════════════════════════════
    // مرحله ۳: ایجاد مخزن دوم
    // ═════════════════════════════════════════════════════════
    console.log('╔════════════════════════════════════════════════════════');
    console.log('║ مرحله ۳: ایجاد مخزن دوم');
    console.log('╚════════════════════════════════════════════════════════');
    
    const secondRepoName = await repoUtils.createRepositoryWithUniqueName(
      'توضیحات مخزن دوم برای تست هم‌نامی',
      true,
    );
    
    console.log(`✅ مخزن دوم ایجاد شد: ${secondRepoName}`);
    
    // ✅ انتظار برای بارگذاری کامل
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // ═════════════════════════════════════════════════════════
    // مرحله ۴: رفتن به صفحه مخزن دوم برای ویرایش
    // ═════════════════════════════════════════════════════════
    console.log('╔════════════════════════════════════════════════════════');
    console.log('║ مرحله ۴: رفتن به صفحه مخزن دوم');
    console.log('╚════════════════════════════════════════════════════════');
    
    await page.goto('https://clasor.pod.ir/admin/myRepoList');
    await page.waitForLoadState('networkidle');
    
    // ✅ انتظار هوشمند برای ظهور حداقل 2 مخزن
    await page.waitForFunction(
      () => document.querySelectorAll('.repo-card').length >= 2,
      { timeout: 15000 }
    );
    
    const repoCards = page.locator('.repo-card');
    const repoCount = await repoCards.count();
    console.log(`تعداد مخازن در لیست: ${repoCount}`);
    expect(repoCount).toBeGreaterThanOrEqual(2);

    // ═════════════════════════════════════════════════════════
    // مرحله ۵: انتخاب مخزن دوم (جدیدترین)
    // ═════════════════════════════════════════════════════════
    console.log('╔════════════════════════════════════════════════════════');
    console.log('║ مرحله ۵: انتخاب مخزن دوم (جدیدترین)');
    console.log('╚════════════════════════════════════════════════════════');
    
    // ✅ انتظار برای قابل کلیک بودن مخزن
    const secondRepoCard = repoCards.last();
    await secondRepoCard.waitFor({ state: 'visible', timeout: 10000 });
    await expect(secondRepoCard).toBeEnabled({ timeout: 5000 });
    
    await secondRepoCard.click();
    
    // ✅ انتظار برای بارگذاری کامل صفحه جزئیات مخزن
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // تاخیر اضافی برای اطمینان
    
    // ✅ تأیید ورود به صفحه جزئیات مخزن
    await page.waitForSelector('.repoInformationTab', { timeout: 10000 });

    // ═════════════════════════════════════════════════════════
    // مرحله ۶: باز کردن منوی ویرایش
    // ═════════════════════════════════════════════════════════
    console.log('╔════════════════════════════════════════════════════════');
    console.log('║ مرحله ۶: باز کردن منوی ویرایش');
    console.log('╚════════════════════════════════════════════════════════');
    
    // ✅ انتظار برای ظهور دکمه منو
    const menuButton = page.locator('.repoInformationTab.repoActions button').first();
    await menuButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(menuButton).toBeEnabled({ timeout: 5000 });
    
    await menuButton.click();
    
    // ✅ انتظار برای باز شدن منو (انیمیشن)
    await page.waitForTimeout(1000);
    
    // ✅ انتظار برای ظهور دکمه ویرایش در منوی باز شده
    const editButton = page.locator('.repo-menu__item--edit, button:has-text("ویرایش")').first();
    await editButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(editButton).toBeEnabled({ timeout: 5000 });
    
    await editButton.click();
    
    // ✅ انتظار برای باز شدن دیالوگ ویرایش
    await page.waitForTimeout(1500);
    
    // ✅ تأیید باز شدن دیالوگ ویرایش
    await page.waitForSelector('text="ویرایش مخزن"', { timeout: 10000 });
    
    console.log('✅ منوی ویرایش باز شد');

    // ═════════════════════════════════════════════════════════
    // مرحله ۷: ویرایش نام مخزن دوم به نام مخزن اول
    // ═════════════════════════════════════════════════════════
    console.log('╔════════════════════════════════════════════════════════');
    console.log('║ مرحله ۷: ویرایش نام مخزن دوم به نام مخزن اول');
    console.log('╚════════════════════════════════════════════════════════');
    console.log(`   نام مخزن اول (ذخیره شده): ${firstRepoName}`);
    console.log(`   نام فعلی مخزن دوم: ${secondRepoName}`);
    
    // ✅ استفاده از نام ذخیره شده از مخزن اول
    await editRepo.editRepositoryName(firstRepoName);
    
    console.log(`✅ نام مخزن دوم به "${firstRepoName}" تغییر کرد`);

    // ═════════════════════════════════════════════════════════
    // مرحله ۸: ذخیره تغییرات
    // ═════════════════════════════════════════════════════════
    console.log('╔════════════════════════════════════════════════════════');
    console.log('║ مرحله ۸: ذخیره تغییرات');
    console.log('╚════════════════════════════════════════════════════════');
    
    // ✅ انتظار برای ظهور دکمه ذخیره
    const saveButton = page.locator('.dialog-footer__submit-button');
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    
    await saveButton.click();
    
    // ✅ انتظار برای پاسخ سرور
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // ═════════════════════════════════════════════════════════
    // مرحله ۹: بررسی پیام خطا برای هم‌نامی
    // ═════════════════════════════════════════════════════════
    console.log('╔════════════════════════════════════════════════════════');
    console.log('║ مرحله ۹: بررسی پیام خطا');
    console.log('╚════════════════════════════════════════════════════════');
    
    // ✅ انتظار هوشمند برای ظهور توست خطا
    const errorToast = page.locator('.Toastify__toast--error, .toast-error, .Toastify__toast');
    await errorToast.waitFor({ state: 'visible', timeout: 15000 });
    
    const errorText = await errorToast.textContent() || '';
    console.log(`متن خطا: "${errorText}"`);
    
    // بررسی متن خطا
    await expect(errorToast).toContainText(/نام مخزن تکراری|مخزنی با این نام|تکراری|تکرار شده/);
    
    console.log('╔════════════════════════════════════════════════════════');
    console.log('║ ✅ تست موفق:');
    console.log('║   سیستم به درستی از ایجاد مخزن هم‌نام جلوگیری کرد');
    console.log('╚════════════════════════════════════════════════════════');
  });
});
