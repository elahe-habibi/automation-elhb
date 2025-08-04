/**
 * مثال استفاده از متدهای جدید لاگین
 * 
 * این فایل نشان می‌دهد که چطور از متدهای جدید لاگین استفاده کنید
 */

// مثال 1: لاگین معمولی با بررسی شرطی دکمه پنل ادمین
async function example1() {
  const authUtils = new AuthUtils(page);
  
  // این متد ابتدا لاگین می‌کند، سپس بررسی می‌کند که آیا دکمه پنل ادمین موجود است
  // اگر موجود باشد، روی آن کلیک می‌کند
  await authUtils.loginWithConditionalAdminPanel('eli69', 'HQ[>684ngg');
}

// مثال 2: لاگین با حساب دیگر و بررسی شرطی دکمه پنل ادمین
async function example2() {
  const authUtils = new AuthUtils(page);
  
  // این متد ابتدا لاگین با حساب دیگر انجام می‌دهد، سپس بررسی می‌کند که آیا دکمه پنل ادمین موجود است
  // اگر موجود باشد، روی آن کلیک می‌کند
  await authUtils.loginWithAnotherAccountAndConditionalAdminPanel('emad.mh', 'Em@d8970211');
}

// مثال 3: استفاده در فایل‌های تست
async function example3() {
  test.describe('Repository Tests', () => {
    let authUtils: AuthUtils;

    test.beforeEach(async ({ page }) => {
      authUtils = new AuthUtils(page);
      
      // به جای این:
      // await authUtils.login('eli69', 'HQ[>684ngg');
      
      // از این استفاده کنید:
      await authUtils.loginWithConditionalAdminPanel('eli69', 'HQ[>684ngg');
    });

    test('should work with both login types', async ({ page }) => {
      // تست شما اینجا
    });
  });
}

// مثال 4: استفاده در سناریوهای چند مرحله‌ای
async function example4() {
  const authUtils = new AuthUtils(page);
  
  // مرحله 1: لاگین با کاربر اول
  await authUtils.loginWithConditionalAdminPanel('eli69', 'HQ[>684ngg');
  
  // انجام عملیات با کاربر اول
  // ...
  
  // مرحله 2: لاگین با کاربر دوم
  await authUtils.logout();
  await authUtils.loginWithAnotherAccountAndConditionalAdminPanel('emad.mh', 'Em@d8970211');
  
  // انجام عملیات با کاربر دوم
  // ...
  
  // مرحله 3: بازگشت به کاربر اول
  await authUtils.logout();
  await authUtils.loginWithConditionalAdminPanel('eli69', 'HQ[>684ngg');
}

console.log(`
📋 راهنمای استفاده از متدهای جدید لاگین:

✅ متدهای جدید:
1. loginWithConditionalAdminPanel(username, password)
2. loginWithAnotherAccountAndConditionalAdminPanel(username, password)

✅ مزایا:
- به طور خودکار دکمه پنل ادمین را بررسی می‌کند
- اگر دکمه موجود باشد، روی آن کلیک می‌کند
- اگر دکمه موجود نباشد، ادامه می‌دهد
- با هر دو نوع لاگین کار می‌کند

✅ نحوه استفاده:
- در فایل‌های تست، به جای login() از loginWithConditionalAdminPanel() استفاده کنید
- در سناریوهای چند کاربری، از loginWithAnotherAccountAndConditionalAdminPanel() استفاده کنید

✅ تغییرات انجام شده:
- فایل auth.ts: اضافه شدن دو متد جدید
- فایل‌های تست: به‌روزرسانی متدهای لاگین
`); 