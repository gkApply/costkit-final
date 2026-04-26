import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/.+/)
})

test('signup page loads', async ({ page }) => {
  // TODO Phase 5: update to click navbar signup link once Navbar is built
  // await page.click('a[href="/signup"]')
  await page.goto('/signup')
  await expect(page).toHaveURL(/\/signup/)
})

test('pricing page loads', async ({ page }) => {
  await page.goto('/pricing')
  await expect(page.locator('h1, h2').first()).toBeVisible()
})

test.skip('dashboard redirects when not logged in', async ({ page }) => {
  // Enable in Phase 6 when AuthGuard is wired
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})
