import { test, expect } from '@playwright/test';
import { RepositoryUtils } from '../utils/Create-repository';
import path from 'path';

test.describe('Repository file upload tests', () => {
  // URL اصلی برنامه - این را با URL واقعی برنامه‌تان جایگزین کنید
  const baseUrl = 'YOUR_APPLICATION_URL';
  
  test('upload picture file when clicking on بارگذاری فایل button', async ({ page }) => {
    // ساختن یک نمونه از کلاس RepositoryUtils
    const repoUtils = new RepositoryUtils(page);
    
    // مسیر کامل فایل تصویر
    const picturePath = path.join(__dirname, '../../picture.jpg');
    
    // رفتن به صفحه اصلی برنامه یا صفحه‌ای که دکمه آپلود در آن قرار دارد
    await page.goto(baseUrl);
    
    // باز کردن فرم ایجاد مخزن جدید
    await repoUtils.createRepositoryWithUniqueName('توضیحات مخزن تست', false);
    
    console.log('کلیک روی دکمه بارگذاری فایل و آپلود تصویر');
    
    // فراخوانی متد آپلود تصویر
    const uploadSuccess = await repoUtils.uploadPictureFile(picturePath);
    
    // بررسی موفقیت‌آمیز بودن آپلود
    expect(uploadSuccess).toBeTruthy();
    
    // ادامه مراحل ایجاد مخزن (اختیاری)
    // پس از آپلود موفق، می‌توانید مراحل بعدی را تکمیل کنید
    console.log('تکمیل مراحل باقیمانده ایجاد مخزن');
    
    // مثال: کلیک روی دکمه ادامه
    await page.locator('button:has-text("ادامه")').click();
    
    // بررسی موفقیت آمیز بودن کل فرآیند
    // این بخش بستگی به رفتار اپلیکیشن شما دارد
    // مثال: بررسی نمایش پیام موفقیت یا هدایت به صفحه بعدی
    await expect(page.locator('.success-message, .next-page-indicator')).toBeVisible();
  });
}); 