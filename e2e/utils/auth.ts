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

  async login(username: string, password: string): Promise<void> {
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

    // انتظار برای بارگذاری صفحه
    await this.waitUtils.waitForPageLoad();

    // اطمینان از ورود موفق
    await this.page.waitForURL(getFullUrl(URLs.DASHBOARD));
  }

  async navigateToMyRepositories(): Promise<void> {
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

    const myReposButton = this.page.locator('a[href="/admin/myRepoList"] >> button');
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

  async loginWithAnotherAccount(
    username: string,
    password: string
  ): Promise<void> {
    // Navigate to the website
    await this.page.goto(getFullUrl(URLs.LOGIN));

    // Locate the login button using role and click it
    const loginButton = this.page.locator('button:has-text("ورود")');
    await this.waitUtils.waitForElementStable(loginButton);
    await loginButton.click();

    // // Wait for navigation to the expected URL
    // await this.page.waitForURL(
    //   url => url.toString().includes('sso.sandpod.ir'),
    //   {
    //     timeout: 30000,
    //   }
    // );

    // // Wait for the page to fully load
    // await this.page.waitForLoadState('domcontentloaded');

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

    //Wait for navigation to the dashboard URL
    await this.page.waitForURL(getFullUrl(URLs.DASHBOARD));

    await this.page.waitForTimeout(3000);

    const dashboardButton = this.page.locator('.sidebar-button-active');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(dashboardButton).toBeVisible();
    // کلیک روی دکمه "داشبورد"
    await dashboardButton.click();
    
  }

  async logout(): Promise<void> {
    // // Click on profile button
    // const profileButton = this.page.getByRole('button', { name: /.*/ });
    // await profileButton.click();
    const profileBtn = this.page.locator('.userProfile');
    if (await profileBtn.isVisible()) {
      await profileBtn.click();
    }
    
    // Click the logout button
    const logoutButtonElement = this.page.locator(
      'button[role="menuitem"]:has-text("خروج از حساب")'
    );
    await expect(logoutButtonElement).toBeVisible();
    await logoutButtonElement.click();

    // Wait for navigation back to the home page
    await this.page.waitForURL(getFullUrl(URLs.LOGIN));
  }
}
