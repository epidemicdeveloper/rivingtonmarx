import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import content from '../src/content/site.json';

const paths = [...new Set(['/', ...content.pages.map(page => `/${page.slug.replace(/^\/+|\/+$/g, '')}/`)])];
const widths = [375, 390, 600, 768, 1024, 1200, 1440];

for (const path of paths) {
  test(`route, links, images and responsive layout: ${path}`, async ({ page, request }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize({ width: 1440, height: 1000 });
    const response = await page.goto(path, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toBeVisible();
    expect((await page.title()).trim().length).toBeGreaterThan(10);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

    const links = await page.locator('a[href^="/"]').evaluateAll(elements => [...new Set(elements.map(element => element.getAttribute('href')!))]);
    for (const href of links) {
      const linked = await request.get(href);
      expect(linked.status(), `${path} links to ${href}`).toBe(200);
    }

    await page.locator('img').evaluateAll(elements => (elements as HTMLImageElement[]).forEach(image => { image.loading = 'eager'; }));
    await expect.poll(() => page.locator('img').evaluateAll(elements => (elements as HTMLImageElement[]).filter(image => !image.complete || !image.naturalWidth).map(image => image.src)), { timeout: 30_000 }).toEqual([]);
    expect(await page.locator('img:not([alt])').count()).toBe(0);

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) <= window.innerWidth + 1), { message: `${path} overflows at ${width}px` }).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test('mobile navigation closes on Escape and after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const button = page.getByRole('button', { name: /Menu/ });
  await button.click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toBeFocused();
  await button.click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Portfolio' }).click();
  await expect(page).toHaveURL(/\/portfolio\//);
  await expect(page.getByRole('button', { name: /Menu/ })).toHaveAttribute('aria-expanded', 'false');
});

test('contact preview validates input and clearly reports no submission', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto('/contact/');
  await expect(page.getByText('Preview form — submissions are not sent.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Preview inquiry' }).click();
  await expect(page.getByRole('status')).toHaveCount(0);
  await page.getByLabel('Name', { exact: true }).fill('Preview reviewer');
  await page.getByLabel('Email address', { exact: true }).fill('reviewer@example.com');
  await page.getByLabel('How did you hear about us?').selectOption('Other');
  await page.getByLabel('Tell us about your project').fill('Preview interaction test.');
  await page.getByRole('button', { name: 'Preview inquiry' }).click();
  await expect(page.getByRole('status')).toContainText('Nothing has been sent or saved');
  expect(posts).toEqual([]);
});

test('capture review screenshots', async ({ page }) => {
  await mkdir('docs/screenshots', { recursive: true });
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]] as const) {
    await page.setViewportSize({ width, height });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('img').evaluateAll(elements => (elements as HTMLImageElement[]).forEach(image => { image.loading = 'eager'; }));
    await expect.poll(() => page.locator('img').evaluateAll(elements => (elements as HTMLImageElement[]).every(image => image.complete && image.naturalWidth > 0))).toBe(true);
    await page.screenshot({ path: `docs/screenshots/home-${name}.png`, fullPage: true });
  }
});



