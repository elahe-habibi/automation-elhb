import { test, expect } from '@playwright/test';
import { URLs, getFullUrl } from './constants';

test('example test using centralized URLs', async ({ page }) => {
  // Navigate to login page
  await page.goto(getFullUrl(URLs.LOGIN));

  // Navigate to dashboard
  await page.goto(getFullUrl(URLs.DASHBOARD));

  // Navigate to repository management
  await page.goto(getFullUrl(URLs.REPOSITORY_MANAGEMENT));
});
