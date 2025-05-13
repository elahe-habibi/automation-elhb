// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

test('file upload button interaction', async ({ page }) => {
  // Navigate to the page containing the upload button
  await page.goto('YOUR_APPLICATION_URL'); // Replace with your actual URL

  // Locate the file upload input using its ID
  const fileInput = page.locator('input#file-upload');
  
  // Verify the upload button is visible (via the label)
  await expect(page.locator('label[for="file-upload"]')).toBeVisible();
  
  // Example: Upload a file (replace 'example.jpg' with your test file)
  const filePath = path.join(__dirname, '../picture.jpg');
  await fileInput.setInputFiles(filePath);
  
  // Additional assertions based on your application's behavior after upload
  // For example, check if a success message appears or the file name is displayed
  // await expect(page.locator('.success-message')).toBeVisible();
});

test('file upload button locators', async ({ page }) => {
  await page.goto('YOUR_APPLICATION_URL'); // Replace with your actual URL

  // Different ways to locate the upload button:
  
  // By ID
  const byId = page.locator('#file-upload');
  
  // By class
  const byClass = page.locator('.file-upload');
  
  // By type and attributes
  const byType = page.locator('input[type="file"]');
  
  // By containing text (on the label)
  const byText = page.locator('label:has-text("بارگذاری فایل")');
  
  // Verify the element exists
  await expect(byId).toBeVisible();
}); 