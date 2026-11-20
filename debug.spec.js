describe('Soft Dew And A Warm Nest', () => {
  it('loads the homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('body');
    const title = await page.title();
    console.log('Page title:', title);
  });
});
