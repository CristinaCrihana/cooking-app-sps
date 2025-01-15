import { test, expect } from '@playwright/test';

test.describe('E2E test ', () => {
  

  test('create-recipe', async ({ page }) => {
    await page.goto('http://localhost:3000/create-recipe');
    await page.getByLabel('Recipe Title').fill('Test Recipe');
    await page.getByLabel('Description').fill('A test recipe description');
    
    await page.getByLabel('Ingredient').first().fill('Test i');
    await page.getByLabel('Amount').first().fill('2');
    await page.getByLabel('Unit').first().fill('g');
    await page.getByLabel('Step 1').fill('Test c');
    await page.getByLabel('Vegetarian').check();
    
    await page.getByRole('button', { name: 'Create Recipe' }).click();

    await page.waitForFunction(() => {
        return window.alert !== undefined;
      });
      page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Recipe created successfully!');
        await dialog.accept();
      });

  });
}); 