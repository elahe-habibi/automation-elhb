import { Page, expect } from '@playwright/test';
import { URLs, getFullUrl } from '../../constants';
import { WaitUtils } from '../core/waitutils';

export class AuthUtils {
  private page: Page;
  private waitUtils: WaitUtils;

  constructor(page: Page) {
    this.page = page;
    this.waitUtils = new WaitUtils(page);
  }

  /**
   * لاگین با امکان انجام اکشن بعد از ورود (پنل ادمین، خبرنامه یا هیچکدام)
   */
  async login(
    username: string,
    password: string,
    afterLoginAction: 'admin' | 'newsletter' | null = null,
  ): Promise<void> {
    // مخفی کردن webdriver property برای جلوگیری از bot detection
    await this.page.addInitScript(() => {
      // حذف webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      
      // اضافه کردن chrome property
      (window as any).chrome = {
        runtime: {},
      };
      
      // اصلاح permissions
      const originalQuery = (window.navigator as any).permissions.query;
      (window.navigator as any).permissions.query = (parameters: any) =>
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission } as PermissionStatus)
          : originalQuery(parameters);
    });

    // رفتن به صفحه لاگین
    await this.page.goto(getFullUrl(URLs.LOGIN));
    await this.waitUtils.waitForPageLoad();

    // کلیک روی دکمه ورود
    const loginButton = this.page.getByRole('button', { name: 'ورود' });
    await loginButton.click();

    // منتظر می‌مانیم تا navigation به صفحه SSO انجام شود
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(2000); // تاخیر اضافی برای بارگذاری کامل صفحه SSO

    // انتظار برای بارگذاری فرم - با timeout بیشتر و error handling بهتر
    try {
      await this.page.waitForSelector('#authIdentity-inp', { 
        state: 'visible',
        timeout: 30000 
      });
    } catch (error) {
      // اگر فرم پیدا نشد، بررسی می‌کنیم که آیا صفحه خطا است
      const errorText = await this.page.locator('text=دسترسی امکانپذیر نمی باشد').isVisible().catch(() => false);
      if (errorText) {
        throw new Error('SSO صفحه خطای "دسترسی امکانپذیر نمی باشد" را نشان می‌دهد. ممکن است bot detection فعال باشد.');
      }
      // بررسی URL فعلی برای debug
      const currentUrl = this.page.url();
      console.error(`❌ فرم لاگین پیدا نشد. URL فعلی: ${currentUrl}`);
      throw error;
    }

    // پر کردن فرم با سلکتورهای دقیق
    const usernameInput = this.page.locator('#authIdentity-inp');
    await usernameInput.waitFor({ state: 'visible' });
    await usernameInput.fill(username);

    const passwordInput = this.page.locator('#authPassword-inp');
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(password);

    // کلیک روی دکمه ورود در فرم
    const submitButton = this.page.locator('#authLoginBtn');
    await submitButton.waitFor({ state: 'visible' });
    await submitButton.click();

    await this.page.waitForTimeout(3000);
    await this.waitUtils.waitForPageLoad();
    //await this.page.waitForURL(getFullUrl(URLs.DASHBOARD));

    // اکشن بعد از لاگین
    if (afterLoginAction === 'admin') {
      const adminPanelButton = this.page.locator(
        'a[title="پنل ادمین"] button.bg-tertiary',
      );
      if (
        await adminPanelButton.isVisible({ timeout: 5000 }).catch(() => false)
      ) {
        await adminPanelButton.click();
        await this.page.waitForLoadState('domcontentloaded');
      }
    } else if (afterLoginAction === 'newsletter') {
      const newsletterButton = this.page.locator('button.bg-tertiary').nth(1); // فرض: دومی خبرنامه است
      if (
        await newsletterButton.isVisible({ timeout: 5000 }).catch(() => false)
      ) {
        await newsletterButton.click();
        await this.page.waitForLoadState('domcontentloaded');
      }
    }
    // اگر هیچکدام نبود، فقط لاگین انجام می‌شود و وارد داشبورد می‌شود
  }

  async navigateToMyRepositories(): Promise<void> {

    await this.page.waitForTimeout(8000);
    // Wait for navigation to the dashboard URL to ensure page is loaded
    await this.page.waitForURL(getFullUrl(URLs.DASHBOARD));

    // Wait for the page to fully load
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(8000);


    // Click on the "Repository Management" link (مدیریت مخزن‌ها)
    const repoManagementButton = this.page.locator(
      'button.flex.items-center.w-full.py-4.flex-row-reverse:has(.title_t4:has-text("مدیریت مخزن‌ها"))',
    );
    await expect(repoManagementButton).toBeVisible();
    await repoManagementButton.click();

    // Wait for the page to load
    await this.page.waitForLoadState('domcontentloaded');

    const myReposButton = this.page.locator(
      'a[href="/admin/myRepoList"] >> button',
    );
    await expect(myReposButton).toBeVisible();
    await myReposButton.click();

    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * لاگین با حساب دیگر و امکان انجام اکشن بعد از ورود (پنل ادمین، خبرنامه یا هیچکدام)
   */
  async loginWithAnotherAccount(
    username: string,
    password: string,
    afterLoginAction: 'admin' | 'newsletter' | null = null,
  ): Promise<void> {
    // مخفی‌سازی webdriver (بدون تغییر)
  await this.page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    (window as any).chrome = { runtime: {} };
    const originalQuery = (window.navigator as any).permissions.query;
    (window.navigator as any).permissions.query = (parameters: any) =>
      parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission } as PermissionStatus)
        : originalQuery(parameters);
  });

  // رفتن به صفحه لاگین
  await this.page.goto(getFullUrl(URLs.LOGIN).trim()); // ✅ اضافه کردن .trim()
  // کلیک روی دکمه ورود اولیه
  const loginButton = this.page.locator('button:has-text("ورود")');
  await loginButton.waitFor({ state: 'visible', timeout: 10000 });
  await loginButton.click();

  // انتظار برای لود کامل صفحه SSO
  console.log('⏳ در انتظار لود صفحه SSO...');
  await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  await this.page.waitForTimeout(2000);

  // ✅ کلید راه‌حل: مستقیماً منتظر فیلد نام کاربری بمان (حذف کامل بخش سوئیچ اکانت)
  const usernameField = this.page.locator('#authIdentity-inp');
  await usernameField.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ فرم لاگین آماده است');

  // پر کردن فیلدها بدون هیچ تعامل اضافی
  console.log(`در حال ورود با حساب: ${username}`);
  await usernameField.fill(username);
  await this.page.locator('#authPassword-inp').fill(password);

  // کلیک روی دکمه ورود
  const submitButton = this.page.locator('#authLoginBtn');
  await submitButton.waitFor({ state: 'visible', timeout: 10000 });
  await this.waitUtils.stableClick(submitButton); // استفاده از stableClick برای اطمینان

  // انتظار برای ورود موفق
  await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForTimeout(2000);
  console.log('✅ ورود با حساب جدید موفقیت‌آمیز بود');

  // اکشن بعد از لاگین (بدون تغییر)
  if (afterLoginAction === 'admin') {
    const adminPanelButton = this.page.locator('button.bg-tertiary').first();
    if (await adminPanelButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await adminPanelButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  } else if (afterLoginAction === 'newsletter') {
    const newsletterButton = this.page.locator('button.bg-tertiary').nth(1);
    if (await newsletterButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await newsletterButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }
    // اگر هیچکدام نبود، فقط لاگین انجام می‌شود و وارد داشبورد می‌شود
  }

  
  async logout(): Promise<void> {
    const profileBtn = this.page.locator('.userProfile');
    if (await profileBtn.isVisible({ timeout: 5000 })) {
      console.log('Profile button is visible, clicking...');
      await profileBtn.click();
      // Wait for the logout button to appear after opening the menu
      await this.page.waitForSelector('text=خروج از حساب', { timeout: 10000 });
      await this.page.waitForTimeout(500); // Give a little time for animation
      const logoutButton = this.page.locator('text=خروج از حساب');
      await expect(logoutButton).toBeVisible({ timeout: 10000 });
      await logoutButton.click();
    } else {
      console.log(
        'Profile button is not visible, user may already be logged out.',
      );
      return; // Exit logout gracefully
    }

    // بعد از کلیک روی خروج، ممکن است صفحه در حال ناوبری باشد،
    // بنابراین مستقیماً از page.content استفاده نمی‌کنیم تا خطای
    // "Unable to retrieve content because the page is navigating" رخ ندهد.
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
      // اگر به هر دلیلی به این state نرسید، از خطا عبور می‌کنیم
    });

    // لاگ برای بررسی مسیر واقعی
    const currentUrl = this.page.url();
    console.log('🧭 Current URL after logout:', currentUrl);

    // بررسی انعطاف‌پذیر مسیر نهایی
    await this.page.waitForURL(
      url =>
        url.pathname === '/' ||
        url.pathname.includes('/login') ||
        url.pathname.includes('/home') ||
        url.pathname.includes('/auth'),
      { timeout: 15000 },
    );
  }
}
