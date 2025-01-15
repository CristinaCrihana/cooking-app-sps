import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('http://localhost:3000/login');
  await page.getByPlaceholder('Email').fill('meow@gmail.com');
  await page.getByPlaceholder('Password').fill('meow');
  await page.getByRole('button', { name: 'Log in' }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  //await page.waitForURL('http://localhost:3000/login');
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.locator('p', { hasText: 'Login successful!' })).toBeVisible();
  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});