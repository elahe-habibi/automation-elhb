// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

test('upload file button test', async ({ page }) => {
  // Navigate to the page containing the upload button
  await page.goto('YOUR_APPLICATION_URL'); // Replace with your actual URL
  
  // Locate the file upload input using multiple selectors
  // By ID
  const fileInput = page.locator('input#file-upload');
  
  // Alternative locators based on the provided HTML structure
  const fileInputAlt1 = page.locator('.file-upload input[type="file"]');
  const fileInputAlt2 = page.locator('.file-management__upload-file input[type="file"]');
  const fileInputAlt3 = page.locator('.upload-file__form input[type="file"]');
  
  // Check if the button (label) is visible
  await expect(page.locator('label.dialog-content__submit')).toBeVisible();
  
  // Check if the button contains the correct text
  await expect(page.locator('label .upload-file')).toHaveText('بارگذاری فایل');
  
  // Upload a file
  const filePath = path.join(__dirname, '../picture.jpg');
  await fileInput.setInputFiles(filePath);
  
  // Wait for any potential form submission or UI change
  // This depends on your application's behavior after file selection
  // await page.waitForResponse(response => response.url().includes('/your-upload-endpoint'));
  
  // You might want to check if the file was successfully uploaded
  // For example, check for a success message or the file name being displayed
  // await expect(page.locator('.success-indicator')).toBeVisible();
});

// Function to handle file upload using the specific class structure from the HTML
test('upload file using class selectors', async ({ page }) => {
  await page.goto('YOUR_APPLICATION_URL'); // Replace with your actual URL
  
  // Using the complex CSS class structure from the provided HTML
  const uploadButton = page.locator('label.cls-btn.cls-bg-transparent.cls-border-\\[1px\\]');
  const fileInput = page.locator('#file-upload');
  
  // Verify the button is visible
  await expect(uploadButton).toBeVisible();
  
  // Click the label first (optional, depends on your app's behavior)
  // await uploadButton.click();
  
  // Set file to upload
  const filePath = path.join(__dirname, '../picture.jpg');
  await fileInput.setInputFiles(filePath);
  
  // Add assertions based on your application's behavior after upload
}); 