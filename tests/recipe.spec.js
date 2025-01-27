import { test, expect } from '@playwright/test';

test.describe('Recipe Application E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('homepage shows featured recipes', async ({ page }) => {
    await expect(page.getByText('Featured Recipes')).toBeVisible();
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Vegetarian' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Vegan' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gluten-Free' })).toBeVisible();
  });

  test('create-recipe flow', async ({ page }) => {
    await page.goto('http://localhost:3000/create-recipe');
    await page.getByLabel('Recipe Title').fill('Test Recipe');
    await page.getByLabel('Description').fill('A test recipe description');
    await page.getByLabel('Cooking Time (minutes)').fill('30');
    await page.getByLabel('Servings').fill('4');
    await page.locator('#cuisine-select').click();
await page.getByRole('option', { name: 'Italian' }).click();
    
    // Fill in ingredients
    await page.getByLabel('Ingredient').first().fill('Test ingredient');
    await page.getByLabel('Amount').first().fill('2');
    await page.getByLabel('Unit').first().fill('g');
    
    // Fill in steps
    await page.getByLabel('Step 1').fill('Test cooking step');
    
    // Set dietary info
    await page.getByLabel('Vegetarian').check();
    
    await page.getByRole('button', { name: 'Create Recipe' }).click();

    await page.waitForFunction(() => window.alert !== undefined);
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Recipe created successfully!');
      await dialog.accept();
    });
  });
}); 
