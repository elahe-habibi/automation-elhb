import { test, expect } from '@playwright/test';

test('should load the clasor frontend page, login, navigate to dashboard, and click create repository button', async ({ page }) => {
  // Navigate to the website
  await page.goto('https://clasor-new.pod.ir/');

  // Check if the page title contains the expected text
  const initialTitle = await page.title();
  console.log('Page title:', initialTitle);
  expect(initialTitle).toContain('کلاسور');

  // Locate the login button using role and click it
  await page.waitForSelector('button:has-text("ورود")');
  const loginButton = await page.locator('button:has-text("ورود")');
  await loginButton.click();

  // Wait for navigation to the expected URL
  await page.waitForURL('https://accounts.pod.ir/oauth2/authorize/index.html?client_id=19179665x5ff246b9883584261413edbe&response_type=code&redirect_uri=https://clasor-new.pod.ir/signin&scope=profile');

  // Wait for the page to fully load
  await page.waitForLoadState('networkidle');

  // Debugging: Log the HTML content to verify the presence of input fields
  const pageContent = await page.content();
  console.log(pageContent);

  // Locate and fill the username and password fields
  const usernameField = await page.locator('#authIdentity-inp');
  const passwordField = await page.locator('#authPassword-inp');
  await usernameField.fill('e.habibi');
  await passwordField.fill('0936elhb');

  // Click the login button
  const submitButton = await page.locator('#authLoginBtn');
  await submitButton.click();

  // Wait for navigation to the dashboard URL
  await page.waitForURL('https://clasor-new.pod.ir/admin/dashboard');

  // Wait for the page to fully load
  await page.waitForLoadState('networkidle');

  // Locate and click the "ایجاد مخزن جدید" button
  const createRepoButton = await page.locator('button:has-text("ایجاد مخزن جدید")');
  await createRepoButton.click();

  // Debug: Print button state
  console.log('Button state:', await createRepoButton.isVisible(), await createRepoButton.isEnabled());
  // Debug: Take screenshot
  await page.screenshot({ path: 'debug-before-click.png' });

  // Wait for the form to be visible
  await page.waitForSelector('#repo-name');

  // Alternative: More readable unique name
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}-${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}`;
  const uniqueRepoName = `test-repo-${formattedDate}`;

  // Fill in the repository name with unique value
  await page.locator('#repo-name').fill(uniqueRepoName);

  // Fill in the repository description
  await page.locator('textarea[name="description"]').fill('این یک مخزن تستی است');

  // Optional: Add verification
  await expect(page.locator('#repo-name')).toHaveValue(uniqueRepoName);

  // Wait for and click the continue button
  const continueButton = await page.locator('button:has-text("ادامه")');
  await continueButton.waitFor({ state: 'visible' });
  await continueButton.click();

  // Click the cancel button using text content
  const cancelButton = await page.locator('button:has-text("انصراف")');
  await cancelButton.waitFor({ state: 'visible' });
  await cancelButton.click();

  // Optional: Verify that dialog is closed
  await expect(page.locator('div[placeholder="stepper-dialog"]')).not.toBeVisible();

  // Click on "مخزن‌های من" in the sidebar
  const myReposButton = await page.locator('div.myRepoList button');
  await myReposButton.waitFor({ state: 'visible' });
  await myReposButton.click();

  // Wait for and click the first repository row
  const firstRepo = await page.locator('tbody > tr.table-cell-track').first();
  await firstRepo.waitFor({ state: 'visible' });
  await page.waitForTimeout(1000); // اضافه کردن تاخیر کوتاه
  await firstRepo.click({ force: true });

  // پیدا کردن همه دکمه‌ها درون div.repo-info و کلیک روی سومین دکمه
  const thirdButton = await page.locator('div.repo-info button').nth(2); // nth(2) برای سومین دکمه چون ایندکس از 0 شروع می‌شود
  await expect(thirdButton).toBeVisible();
  await thirdButton.click();

  const allButtons = await page.locator('div.repo-info button');
  console.log('تعداد کل دکمه‌ها:', await allButtons.count());

  // انتخاب گزینه "اشتراک گذاری" از منو
  const shareOption = await page.locator('p[placeholder="menu-item-text"]:has-text("اشتراک گذاری")');
  await expect(shareOption).toBeVisible();
  await shareOption.click();

  // پیدا کردن فیلد شناسه پادی و وارد کردن مقدار
  const usernameInput = await page.locator('input#username[placeholder="شناسه پادی"]');
  await expect(usernameInput).toBeVisible();
  await usernameInput.fill('emad.mh');

  // اختیاری: اطمینان از درست وارد شدن مقدار
  await expect(usernameInput).toHaveValue('emad.mh');

  const inviteButton = await page.locator('button p.text__label__button:has-text("دعوت")');
  await expect(inviteButton).toBeVisible();
  await inviteButton.click();

  // Click close button (X) -با force: true و waitForSelector
  await page.waitForSelector('svg.fill-icon-hover.w-6.h-6', { state: 'visible' });
  const closeButton = await page.locator('svg.fill-icon-hover.w-6.h-6').first();
  await closeButton.click({ force: true });

  // Use a different variable name for the logout button
  const profileButton = await page.getByRole('button', { name: 'e.habibi' });
  await profileButton.click();

  // Debug: Take a screenshot before trying to find the logout button
  await page.screenshot({ path: 'debug-before-logout.png' });

  // Click the logout button using a more specific selector
  const logoutButtonElement = await page.locator('button[role="menuitem"]:has-text("خروج از حساب")');
  await expect(logoutButtonElement).toBeVisible();
  await logoutButtonElement.click();

  //await page.pause();

  await page.goto('https://clasor-new.pod.ir/');

  // Check if the page title contains the expected text
  const finalTitle = await page.title();
  console.log('Page title:', finalTitle);
  expect(finalTitle).toContain('کلاسور');

  // Locate the login button using role and click it
  await page.waitForSelector('button:has-text("ورود")');
  const loginButtonAgain = await page.locator('button:has-text("ورود")');
  await loginButtonAgain.click();

  // Wait for navigation to the expected URL
  await page.waitForURL('https://accounts.pod.ir/oauth2/authorize/index.html?client_id=19179665x5ff246b9883584261413edbe&response_type=code&redirect_uri=https://clasor-new.pod.ir/signin&scope=profile');

  // Wait for the page to fully load
  await page.waitForLoadState('networkidle');

  // Debugging: Log the HTML content to verify the presence of input fields
  const pageContentAgain = await page.content();
  console.log(pageContentAgain);

  // Locate and click the "ورود با حساب دیگر" button
  const switchAccountButton = await page.locator('a#authSelAccBtn');
  await expect(switchAccountButton).toBeVisible();
  await switchAccountButton.click();

  // Locate and fill the username and password fields
  const usernameFieldAgain = await page.locator('#authIdentity-inp');
  const passwordFieldAgain = await page.locator('#authPassword-inp');
  await usernameFieldAgain.fill('emad.mh');
  
  await passwordFieldAgain.fill('Em@d8970211');

  // Click the login button
  const submitButtonAgain = await page.locator('#authLoginBtn');
  await submitButtonAgain.click();

  // Wait for navigation to the dashboard URL
  await page.waitForURL('https://clasor-new.pod.ir/admin/dashboard');






  
});

// async function logoutFromAccount(page) {
//   // کمی صبر قبل از شروع
//   await page.waitForTimeout(1000);
//   // Select the first div inside the main tag
//   const firstDiv = await page.locator('main div').first();
//   await expect(firstDiv).toBeVisible();

//   // Find all buttons inside the first div
//   const buttons = await firstDiv.locator('button');
//   const buttonCount = await buttons.count();
//   console.log(`Found ${buttonCount} buttons inside the first div.`);

//   // Click on the third button
//   if (buttonCount >= 3) {
//     const thirdButton = await buttons.nth(2); // nth(2) for the third button since index starts from 0
//     await expect(thirdButton).toBeVisible();
//     await thirdButton.click();
//   } else {
//     console.log('Less than 3 buttons found inside the first div.');
//   }

//   // کلیک روی دکمه پروفایل با selector دقیق‌تر
//   const profileButton = await page.locator('button[aria-haspopup="menu"].userProfile.rounded-full');
//   // یا می‌توانیم از alt تصویر استفاده کنیم
//   // const profileButton = await page.locator('button.userProfile img[alt="e.habibi"]').first();
  
//   await expect(profileButton).toBeVisible();
//   await profileButton.click();

//   // صبر کردن برای دیدن منو
//   await page.waitForTimeout(1000);

//   // کلیک روی دکمه خروج
//   const logoutButton = await page.getByRole('menuitem', { name: 'خروج از حساب' });
//   await expect(logoutButton).toBeVisible();
//   await logoutButton.click();

//   // صبر کردن در انتها
//   await page.waitForTimeout(1000);
//   await page.pause();
// }

// async function navigateToMyRepositories(page) {
//   // Navigate to repositories list
//   const myReposButton = await page.locator('div.myRepoList button');
//   await myReposButton.click();
//   await expect(myReposButton).toHaveClass(/bg-gray-100/);

//   // Wait for page to load completely
//   await page.waitForLoadState('networkidle');
//   await page.waitForTimeout(2000); // اضافه کردن تاخیر بیشتر برای اطمینان از لود کامل

//   // Wait for and click the first repository row
//   const firstRepo = await page.locator('tbody > tr.table-cell-track').first();
//   await expect(firstRepo).toBeVisible({ timeout: 10000 }); // افزایش timeout
//   await firstRepo.click({ force: true });

//    // در انتها، خروج از حساب کاربری
//    await logoutFromAccount(page) 


// }
