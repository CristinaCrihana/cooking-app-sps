import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Go to login page
  await page.goto('http://localhost:3000/login');
  
  // Ensure we're on the login form
  await expect(page.getByText('Welcome Back')).toBeVisible();
  
  // Fill in login form
  await page.getByLabel('Email Address').fill('meow@gmail.com');
  await page.getByLabel('Password').fill('meow');
  
  // Click the login button and wait for navigation
  await Promise.all([
    page.waitForURL('http://localhost:3000'),  // Wait for navigation to home page
    page.getByRole('button', { name: 'Log In' }).click()
  ]);
  
  // Store authentication state
  await page.context().storageState({ path: authFile });
});