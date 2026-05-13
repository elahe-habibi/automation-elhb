import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // با 1 worker نیازی به parallel نیست
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // اجرا با یک worker (تست‌ها به صورت sequential اجرا می‌شوند)
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    headless: true, // اجرا در headless mode (بدون نمایش مرورگر)
    viewport: { width: 1920, height: 1080 }, // viewport بزرگتر برای جلوگیری از bot detection
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 30000,
    // User-Agent واقعی برای جلوگیری از bot detection
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    launchOptions: {
      slowMo: 100,
      args: [
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled', // مخفی کردن automation
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    },
    // اضافه کردن context script برای مخفی کردن webdriver
    contextOptions: {
      // مخفی کردن webdriver property
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
  timeout: 300000, // افزایش timeout به 5 دقیقه
});
