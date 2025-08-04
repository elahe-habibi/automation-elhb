import { Page, expect } from '@playwright/test';
import { URLs, getFullUrl } from '../constants';
import { WaitUtils } from './waitutils';

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
    afterLoginAction: 'admin' | 'newsletter' | null = null
  ): Promise<void> {
    // رفتن به صفحه لاگین
    await this.page.goto(getFullUrl(URLs.LOGIN));
    await this.waitUtils.waitForPageLoad();

    // کلیک روی دکمه ورود
    const loginButton = this.page.getByRole('button', { name: 'ورود' });
    await loginButton.click();

    // انتظار برای بارگذاری فرم
    await this.page.waitForSelector('#authIdentity-inp', { state: 'visible' });

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
      const adminPanelButton = this.page.locator('a[title="پنل ادمین"] button.bg-tertiary');
      if (await adminPanelButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await adminPanelButton.click();
        await this.page.waitForLoadState('domcontentloaded');
      }
    } else if (afterLoginAction === 'newsletter') {
      const newsletterButton = this.page.locator('button.bg-tertiary').nth(1); // فرض: دومی خبرنامه است
      if (await newsletterButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await newsletterButton.click();
        await this.page.waitForLoadState('domcontentloaded');
      }
    }
    // اگر هیچکدام نبود، فقط لاگین انجام می‌شود و وارد داشبورد می‌شود
  }

  async navigateToMyRepositories(): Promise<void> {
    await this.page.waitForTimeout(5000);

    // Wait for navigation to the dashboard URL to ensure page is loaded
    await this.page.waitForURL(getFullUrl(URLs.DASHBOARD));

    // Wait for the page to fully load
    await this.page.waitForLoadState('domcontentloaded');

    // Click on the "Repository Management" link (مدیریت مخزن‌ها)
    const repoManagementButton = this.page.locator(
      'button.flex.items-center.w-full.py-4.flex-row-reverse:has(.title_t4:has-text("مدیریت مخزن‌ها"))'
    );
    await expect(repoManagementButton).toBeVisible();
    await repoManagementButton.click();

    // Wait for the page to load
    await this.page.waitForLoadState('domcontentloaded');

    const myReposButton = this.page.locator(
      'a[href="/admin/myRepoList"] >> button'
    );
    await expect(myReposButton).toBeVisible();
    await myReposButton.click();

    // // Click on the "My Repositories" button using specific class selectors
    // const myRepositoriesButton = this.page.locator(
    //   'button.align-middle.select-none.font-sans.font-bold.text-center.uppercase.text-xs.py-3.rounded-lg:has(.title_t3:has-text("مخزن‌های من"))'
    // );
    // await expect(myRepositoriesButton).toBeVisible();
    // await myRepositoriesButton.click();
    // // Wait for the page to load
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * لاگین با حساب دیگر و امکان انجام اکشن بعد از ورود (پنل ادمین، خبرنامه یا هیچکدام)
   */
  async loginWithAnotherAccount(
    username: string,
    password: string,
    afterLoginAction: 'admin' | 'newsletter' | null = null
  ): Promise<void> {
    // Navigate to the website
    await this.page.goto(getFullUrl(URLs.LOGIN));

    // Locate the login button using role and click it
    const loginButton = this.page.locator('button:has-text("ورود")');
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.waitFor({ state: 'attached' });
    await loginButton.click();

    // Locate and click the "ورود با حساب دیگر" button
    const switchAccountButton = this.page.locator('a#authSelAccBtn');
    await expect(switchAccountButton).toBeVisible();
    await switchAccountButton.click();

    // Locate and fill the username and password fields
    const usernameField = this.page.locator('#authIdentity-inp');
    const passwordField = this.page.locator('#authPassword-inp');
    await usernameField.fill(username);
    await passwordField.fill(password);

    // Click the login button
    const submitButton = this.page.locator('#authLoginBtn');
    await this.waitUtils.stableClick(submitButton);

    // صبر برای لود کامل صفحه
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);

    // اکشن بعد از لاگین
    if (afterLoginAction === 'admin') {
      const adminPanelButton = this.page.locator('button.bg-tertiary').nth(0); // انتخاب سومین دکمه
      if (await adminPanelButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await adminPanelButton.click();
        await this.page.waitForLoadState('domcontentloaded');
      }
    } else if (afterLoginAction === 'newsletter') {
      const newsletterButton = this.page.locator('button.bg-tertiary').nth(1); // فرض: دومی خبرنامه است
      if (await newsletterButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await newsletterButton.click();
        await this.page.waitForLoadState('domcontentloaded');
      }
    }
    // اگر هیچکدام نبود، فقط لاگین انجام می‌شود و وارد داشبورد می‌شود
  }

  //   async logout(): Promise<void> {
  //     await this.page.waitForTimeout(3000);8

  //     // // Click on profile button
  //     // const profileButton = this.page.getByRole('button', { name: /.*/ });
  //     // await profileButton.click();
  //     const profileBtn = this.page.locator('.userProfile');
  //     if (await profileBtn.isVisible()) {
  //       await profileBtn.click();
  //     }

  //     // // Click the logout button
  //     // this.page.waitForTimeout(10000); //
  //     // const logoutButton = this.page.locator(
  //     //   'button[role="menuitem"]:has-text("خروج از حساب")'
  //     // );
  //     // await this.page.locator('text=خروج از حساب').waitFor({ state: 'visible', timeout: 15000 });

  //     // await logoutButton.waitFor({ state: 'visible', timeout: 10000 });
  //     // await logoutButton.click();

  //     // Ideally trigger the menu containing the logout button
  //     // const menuTrigger = this.page.locator('selector-for-menu-button');
  //     // await menuTrigger.click(); // if needed

  //     const logoutButton = this.page.getByRole('menuitem', {
  //       name: /خروج از حساب/,
  //     });
  //     await expect(logoutButton).toBeVisible({ timeout: 10000 });
  //     await logoutButton.click();

  //     // Optional: confirm redirection or state change
  //     // await this.page.waitForURL('expected-post-logout-url', { timeout: 15000 }); // Removed placeholder

  //     // Wait for navigation back to the home page
  //     await this.page.waitForURL(url => url.toString().includes('/login'), {
  //       timeout: 15000,
  //     });
  //  }

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
        'Profile button is not visible, user may already be logged out.'
      );
      return; // Exit logout gracefully
    }

    await this.page.waitForTimeout(1000);
    console.log(await this.page.content());

    const logoutButton = this.page.locator('button:has-text("خروج از حساب")');

    //await expect(logoutButton).toBeVisible({ timeout: 10000 });
    //await logoutButton.click();

    // لاگ برای بررسی مسیر واقعی
    await this.page.waitForTimeout(1000);
    const currentUrl = await this.page.url();
    console.log('🧭 Current URL after logout:', currentUrl);

    // بررسی انعطاف‌پذیر مسیر نهایی
    await this.page.waitForURL(
      url =>
        url.pathname === '/' ||
      
        url.pathname.includes('/login') ||
        url.pathname.includes('/home') ||
        url.pathname.includes('/auth'),
      { timeout: 15000 }
    );
  }
}
