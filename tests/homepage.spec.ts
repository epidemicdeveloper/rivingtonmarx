import { test, expect } from '@playwright/test';
import source from '../src/content/site.json';
test('editorial homepage preserves client content and interactions', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.wordmark img')).toHaveAttribute('src','/images/original-logo.png');
  for (const text of source.home.paragraphs.slice(7)) {
    await expect(page.locator('main')).toContainText(text);
  }
  await expect(page.locator('.caption-project')).toHaveText('Tailored In Stone');
  await page.getByRole('button',{name:'Next featured image'}).click();
  await expect(page.locator('.caption-project')).toHaveText('Parlors & Power');
  await page.getByRole('button',{name:'Previous featured image'}).click();
  await expect(page.locator('.caption-project')).toHaveText('Tailored In Stone');
  await page.getByText('Specialized Workflow Systems',{exact:true}).click();
  await expect(page.getByText('Control costs without compromising quality',{exact:true})).toBeVisible();
  await page.getByText('Integrated Design + Construction',{exact:true}).click();
  await expect(page.getByText('Greater budget transparency',{exact:true})).toBeVisible();
  for (const width of [375,390,600,768,1024,1101,1440]) {
    await page.setViewportSize({width,height:892});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  }
});
