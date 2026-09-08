import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Third-party player availability is outside local UI regression coverage.
  await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body style="background:#2e1c10;color:white">Video player</body></html>' }));
});

test('public pages fit phone, tablet and desktop widths in both languages', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 375, 390, 412, 768, 1024, 1366, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const lang of ['en', 'mr']) {
      await page.goto('/');
      await page.evaluate(value => localStorage.setItem('lang', value), lang);
      for (const route of ['/', '/about', '/project', '/progress', '/news', '/transparency', '/donate']) {
        await page.goto(route);
        await expect(page.locator('main h1').first()).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        const overflowing = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          page: document.documentElement.scrollWidth,
          offenders: Array.from(document.querySelectorAll('body *')).filter(e => {
            const r = e.getBoundingClientRect();
            return r.width > 0 && r.right > document.documentElement.clientWidth + 1 && getComputedStyle(e).position !== 'fixed';
          }).slice(0, 8).map(e => `${e.tagName}.${e.className}`),
        }));
        expect(overflowing.page, `${width}px ${lang} ${route}: ${overflowing.offenders.join(', ')}`).toBeLessThanOrEqual(overflowing.viewport + 1);
      }
    }
  }
  expect(errors).toEqual([]);
});

test('drawer supports keyboard, language, routes and login without horizontal menu scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.locator('.drawer-trigger').click();
  await expect(page.locator('#mobile-drawer')).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await page.locator('.drawer-tools .language-button').click();
  await expect(page.locator('.campaign-hero h1')).toContainText('A Grand Statue');
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-drawer')).not.toBeVisible();
  await expect(page.locator('.drawer-trigger')).toBeFocused();
  await page.locator('.drawer-trigger').click();
  await page.locator('.drawer-panel nav').getByRole('link', { name: 'Donate', exact: true }).click();
  await expect(page).toHaveURL(/\/donate$/);
  await expect(page.locator('#mobile-drawer')).not.toBeVisible();
  await expect(page.locator('.mobile-donation-bar')).toHaveCount(0);
  await page.locator('.drawer-trigger').click();
  await page.locator('.drawer-tools .header-admin').click();
  await expect(page.locator('.admin-login-modal')).toBeVisible();
  await page.locator('.admin-login-modal input[name=email]').fill('invalid');
  await page.locator('.admin-login-modal input[name=password]').fill('invalid');
  await page.locator('.admin-modal-form button').click();
  await expect(page.locator('.admin-modal-error')).toContainText('Please check');
  await page.keyboard.press('Escape');
  await expect(page.locator('.admin-login-modal')).toHaveCount(0);
  await page.locator('.drawer-trigger').click();
  await page.locator('.drawer-tools .header-admin').click();
  await page.locator('.admin-login-modal input[name=email]').fill('Prashant');
  await page.locator('.admin-login-modal input[name=password]').fill('admin');
  await page.locator('.admin-modal-form button').click();
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  await expect(page.locator('.admin-main')).toBeVisible();
});

test('donation retains the order and verification API contract', async ({ page }) => {
  let orderBody: any;
  let verifyBody: any;
  await page.route('**/checkout/config', route => route.fulfill({ json: { key: 'rzp_test_regression' } }));
  await page.route('**/orders', route => { orderBody = route.request().postDataJSON(); return route.fulfill({ json: { id: 'order_regression', amount: orderBody.amount, currency: 'INR' } }); });
  await page.route('**/payments/verify', route => { verifyBody = route.request().postDataJSON(); return route.fulfill({ json: { success: true } }); });
  await page.addInitScript(() => {
    (window as any).Razorpay = class {
      options: any;
      constructor(options: any) { this.options = options; }
      on() {}
      open() { this.options.handler({ razorpay_order_id: this.options.order_id, razorpay_payment_id: 'pay_regression', razorpay_signature: 'test_signature' }); }
    };
    localStorage.setItem('lang', 'en');
  });
  await page.goto('/donate');
  await page.locator('input[name=name]').fill('Test Donor');
  await page.locator('input[name=email]').fill('test@example.com');
  await page.locator('input[name=mobile]').fill('9999999999');
  await page.locator('input[name=city]').fill('Pune');
  await page.getByRole('button', { name: 'Proceed to Payment' }).click();
  await expect(page.locator('.success.card')).toBeVisible();
  expect(orderBody).toMatchObject({ amount: 100000, currency: 'INR', notes: { name: 'Test Donor', country: 'India', city: 'Pune' } });
  expect(verifyBody).toEqual({ razorpay_order_id: 'order_regression', razorpay_payment_id: 'pay_regression', razorpay_signature: 'test_signature' });
  await expect(page.locator('.donation-confirmation')).toContainText('pay_regression');
  await expect(page.getByRole('button', { name: 'Share Campaign' })).toBeVisible();
});

test('failed verification never shows payment success', async ({ page }) => {
  await page.route('**/checkout/config', route => route.fulfill({ json: { key: 'rzp_test_regression' } }));
  await page.route('**/orders', route => route.fulfill({ json: { id: 'order_regression', amount: 100000, currency: 'INR' } }));
  await page.route('**/payments/verify', route => route.fulfill({ status: 400, body: 'Invalid signature' }));
  await page.addInitScript(() => {
    localStorage.setItem('lang', 'en');
    (window as any).Razorpay = class { constructor(public options: any) {} on() {} open() { this.options.handler({ razorpay_order_id: this.options.order_id, razorpay_payment_id: 'pay_invalid', razorpay_signature: 'invalid' }); } };
  });
  await page.goto('/donate');
  for (const [name, value] of Object.entries({ name: 'Test', mobile: '9999999999', email: 'test@example.com', city: 'Pune' })) await page.locator(`input[name=${name}]`).fill(value);
  await page.getByRole('button', { name: 'Proceed to Payment' }).click();
  await expect(page.getByRole('alert')).toContainText('Payment verification failed');
  await expect(page.locator('.success.card')).toHaveCount(0);
});

test('gallery expands and screenshots capture the mobile and desktop layout', async ({ page }) => {
  await page.goto('/');
  await page.locator('#gallery').scrollIntoViewIfNeeded();
  await page.locator('.hs-gallery-photo').click();
  await expect(page.locator('.hs-lightbox')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.hs-lightbox')).not.toBeVisible();
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.locator('.campaign-amount')).not.toHaveClass(/skeleton/);
    await page.screenshot({ path: `artifacts/home-${width}-top.png` });
    await page.screenshot({ path: `artifacts/home-${width}.png`, fullPage: true });
  }
});

test('PWA precaches static pages and excludes payment, admin and API responses', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  const manifest = await (await page.request.get('/manifest.webmanifest')).json();
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons).toHaveLength(3);
  const cacheKeys = await page.evaluate(async () => (await Promise.all((await caches.keys()).map(async key => (await (await caches.open(key)).keys()).map(request => request.url)))).flat());
  expect(cacheKeys.some(key => /\/index.html/.test(key))).toBeTruthy();
  expect(cacheKeys.some(key => /\/api\/|\/donate(?:\?|$)|\/admin(?:\/|-)|\/payments\//.test(key))).toBeFalsy();
  await context.setOffline(true);
  await page.goto('/about');
  await expect(page.locator('main h1')).toBeVisible();
  await page.goto('/donate').catch(() => {});
  expect(await page.locator('form[name=donationForm]').count()).toBe(0);
});
