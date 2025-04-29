import { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class AuthUtils {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async login(username: string, password: string) {
        // Navigate to the website
        await this.page.goto('https://clasor-frontend.sandpod.ir/');

        // Locate the login button using role and click it
        await this.page.waitForSelector('button:has-text("ورود")');
        const loginButton = await this.page.locator('button:has-text("ورود")');
        await loginButton.click();

        // Wait for navigation to the expected URL
        await this.page.waitForURL('https://sso-sandbox.sandpod.ir/oauth2/authorize/index.html?client_id=18682629g64434d74b0004e8ecb3d3be1&response_type=code&redirect_uri=https://clasor-frontend.sandpod.ir/signin&scope=profile');

        // Wait for the page to fully load
        await this.page.waitForLoadState('networkidle');

        // Locate and fill the username and password fields
        const usernameField = await this.page.locator('#authIdentity-inp');
        const passwordField = await this.page.locator('#authPassword-inp');
        await usernameField.fill(username);
        await passwordField.fill(password);

        // Click the login button
        const submitButton = await this.page.locator('#authLoginBtn');
        await submitButton.click();

        // Wait for navigation to the dashboard URL
        await this.page.waitForURL('https://clasor-frontend.sandpod.ir/admin/dashboard');
    }

    async loginWithAnotherAccount(username: string, password: string) {
        // Navigate to the website
        await this.page.goto('https://clasor-frontend.sandpod.ir/');

        // Locate the login button using role and click it
        await this.page.waitForSelector('button:has-text("ورود")');
        const loginButton = await this.page.locator('button:has-text("ورود")');
        await loginButton.click();

        // Wait for navigation to the expected URL
        await this.page.waitForURL('https://sso-sandbox.sandpod.ir/oauth2/authorize/index.html?client_id=18682629g64434d74b0004e8ecb3d3be1&response_type=code&redirect_uri=https://clasor-frontend.sandpod.ir/signin&scope=profile');

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
        await this.page.waitForURL('https://clasor-frontend.sandpod.ir/admin/dashboard');
    }

    async logout() {
        // Click on profile button
        const profileButton = await this.page.getByRole('button', { name: /.*/ });
        await profileButton.click();

        // Click the logout button
        const logoutButtonElement = await this.page.locator('button[role="menuitem"]:has-text("خروج از حساب")');
        await expect(logoutButtonElement).toBeVisible();
        await logoutButtonElement.click();

        // Wait for navigation back to the home page
        await this.page.waitForURL('https://clasor-frontend.sandpod.ir/');
    }
} 