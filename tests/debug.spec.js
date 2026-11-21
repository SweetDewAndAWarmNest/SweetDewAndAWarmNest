import { test, expect } from 'playwright/test';

test('Soft Dew And A Warm Nest', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('body');
  const title = await page.title();
  console.log('Page title:', title);
});
