import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { URLs, getFullUrl, getSSOUrl } from '../constants';

export class AuthUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async login(username: string, password: string) {
    // Navigate to the website
    await this.page.goto(getFullUrl(URLs.LOGIN));

    // Locate the login button using role and click it
    await this.page.waitForSelector('button:has-text("ورود")');
    const loginButton = await this.page.locator('button:has-text("ورود")');
    await loginButton.click();

    // Wait for any navigation to complete
    console.log('Waiting for navigation...');
    await this.page.waitForLoadState('networkidle');
    console.log('Navigation complete');

    // Locate and fill the username and password fields
    console.log('Looking for username field...');
    const usernameField = await this.page.locator('#authIdentity-inp');
    await expect(usernameField).toBeVisible({ timeout: 10000 });
    console.log('Username field found');
    const passwordField = await this.page.locator('#authPassword-inp');
    await usernameField.fill(username);
    await passwordField.fill(password);

    // Click the login button
    const submitButton = await this.page.locator('#authLoginBtn');
    await submitButton.click();

    // Wait for navigation to the dashboard URL
    await this.page.waitForURL(getFullUrl(URLs.DASHBOARD));
  }

  async navigateToMyRepositories() {
    // Wait for navigation to the dashboard URL to ensure page is loaded
    await this.page.waitForURL(getFullUrl(URLs.DASHBOARD));

    // Wait for the page to fully load
    await this.page.waitForLoadState('networkidle');

    // Click on the "Repository Management" link (مدیریت مخزن‌ها)
    const repoManagementButton = await this.page.locator(
      'button.flex.items-center.w-full.py-4.flex-row-reverse:has(.title_t4:has-text("مدیریت مخزن‌ها"))'
    );
    await expect(repoManagementButton).toBeVisible();
    await repoManagementButton.click();

    // Wait for the page to load
    await this.page.waitForLoadState('networkidle');

    // Click on the "My Repositories" button using specific class selectors
    const myRepositoriesButton = await this.page.locator(
      'button.align-middle.select-none.font-sans.font-bold.text-center.uppercase.text-xs.py-3.rounded-lg:has(.title_t3:has-text("مخزن‌های من"))'
    );
    await expect(myRepositoriesButton).toBeVisible();
    await myRepositoriesButton.click();
    // Wait for the page to load
    await this.page.waitForLoadState('networkidle');
  }

  async loginWithAnotherAccount(username: string, password: string) {
    // Navigate to the website
    await this.page.goto(getFullUrl(URLs.LOGIN));

    // Locate the login button using role and click it
    await this.page.waitForSelector('button:has-text("ورود")');
    const loginButton = await this.page.locator('button:has-text("ورود")');
    await loginButton.click();

    // Wait for navigation to the expected URL
    await this.page.waitForURL(
      url => url.toString().includes('sso.sandpod.ir'),
      { timeout: 30000 }
    );

    // Wait for the page to fully load
    await this.page.waitForLoadState('networkidle');

    // Locate and click the "ورود با حساب دیگر" button
    const switchAccountButton = await this.page.locator('a#authSelAccBtn');
    await expect(switchAccountButton).toBeVisible();
    await switchAccountButton.click();

    // Locate and fill the username and password fields
    const usernameField = await this.page.locator('#authIdentity-inp');
    const passwordField = await this.page.locator('#authPassword-inp');
    await usernameField.fill(username);
    await passwordField.fill(password);

    // Click the login button
    const submitButton = await this.page.locator('#authLoginBtn');
    await submitButton.click();

    // Wait for navigation to the dashboard URL
    await this.page.waitForURL(getFullUrl(URLs.DASHBOARD));
  }

  async logout() {
    // Click on profile button
    const profileButton = await this.page.getByRole('button', { name: /.*/ });
    await profileButton.click();

    // Click the logout button
    const logoutButtonElement = await this.page.locator(
      'button[role="menuitem"]:has-text("خروج از حساب")'
    );
    await expect(logoutButtonElement).toBeVisible();
    await logoutButtonElement.click();

    // Wait for navigation back to the home page
    await this.page.waitForURL(getFullUrl(URLs.LOGIN));
  }
}
