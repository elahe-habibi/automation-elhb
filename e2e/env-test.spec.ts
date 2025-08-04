import { test, expect } from '@playwright/test';
import { ENV_CONFIG, getFullUrl } from '../env.config';

test('test environment configuration', async ({ page }) => {
  // Test that environment variables are loaded
  expect(ENV_CONFIG.BASE_URL).toBe('https://clasor-frontend.sandpod.ir');
  expect(ENV_CONFIG.LOGIN).toBe('/');
  
  // Test getFullUrl function
  const loginUrl = getFullUrl(ENV_CONFIG.LOGIN);
  expect(loginUrl).toBe('https://clasor-frontend.sandpod.ir/');
  
  // Navigate to login page
  await page.goto(loginUrl);
  
  // Verify we're on the correct page
  await expect(page).toHaveURL(loginUrl);
}); 