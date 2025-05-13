// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

test('file upload with precise selectors', async ({ page }) => {
  // Navigate to your application page
  await page.goto('YOUR_APPLICATION_URL'); // Replace with your actual URL
  
  // The file input element by ID
  const fileInput = page.locator('#file-upload');
  
  // Verify the upload button (label) exists
  const uploadLabel = page.locator('label[for="file-upload"]');
  await expect(uploadLabel).toBeVisible();
  
  // Verify the text on the button
  const uploadText = page.locator('label[for="file-upload"] .upload-file');
  await expect(uploadText).toHaveText('بارگذاری فایل');
  
  // Upload a file
  const filePath = path.join(__dirname, '../picture.jpg');
  await fileInput.setInputFiles(filePath);
  
  // Additional checks after file upload (customize based on your application)
});

test('upload button with exact class structure', async ({ page }) => {
  await page.goto('YOUR_APPLICATION_URL'); // Replace with your actual URL
  
  // Exact class structure from the provided HTML
  // Note: Some special characters in class names need to be escaped in CSS selectors
  
  // The file upload container
  const uploadContainer = page.locator('.file-upload.file-management__upload-file.cls-self-end');
  await expect(uploadContainer).toBeVisible();
  
  // The form
  const uploadForm = page.locator('.upload-file__form');
  await expect(uploadForm).toBeVisible();
  
  // The label with all its classes
  const uploadLabel = page.locator('label.dialog-content__submit.lib-btn.cls-btn.cls-bg-transparent.\\!cls-border-solid.cls-border-\\[1px\\].cls-border-\\[\\#EEF0F2\\].hover\\:cls-bg-transparent');
  await expect(uploadLabel).toBeVisible();
  
  // The file input
  const fileInput = page.locator('#file-upload');
  
  // Upload the file
  const filePath = path.join(__dirname, '../picture.jpg');
  await fileInput.setInputFiles(filePath);
});

// Helper function for file upload that you can reuse across tests
async function uploadFile(page, filePath) {
  // Most reliable way to upload a file with Playwright
  const fileInput = page.locator('#file-upload');
  await fileInput.setInputFiles(filePath);
  
  // If your application requires clicking the label first:
  // await page.locator('label[for="file-upload"]').click();
  // then:
  // await page.setInputFiles('#file-upload', filePath);
} 