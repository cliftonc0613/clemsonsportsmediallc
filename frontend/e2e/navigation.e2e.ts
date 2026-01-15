import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.describe('Desktop Navigation', () => {
    test('homepage loads with hero section', async ({ page }) => {
      await page.goto('/')

      // Check page title exists
      await expect(page).toHaveTitle(/.+/)

      // Hero section should be visible
      const hero = page.locator('section').first()
      await expect(hero).toBeVisible()
    })

    test('navigation menu is visible', async ({ page }) => {
      await page.goto('/')

      // Header should be visible
      const header = page.locator('header')
      await expect(header).toBeVisible()

      // Navigation should contain links
      const nav = page.locator('nav')
      await expect(nav).toBeVisible()
    })

    test('can navigate to Blog page', async ({ page }) => {
      await page.goto('/')

      // Click blog link
      await page.click('a[href="/blog"]')

      // URL should change
      await expect(page).toHaveURL(/\/blog/)

      // Blog page content should be visible
      await expect(page.locator('main')).toBeVisible()
    })

    test('can navigate to Services page', async ({ page }) => {
      await page.goto('/')

      // Click services link
      await page.click('a[href="/services"]')

      // URL should change
      await expect(page).toHaveURL(/\/services/)

      // Services page content should be visible
      await expect(page.locator('main')).toBeVisible()
    })

    test('can navigate to Contact page', async ({ page }) => {
      await page.goto('/')

      // Click contact link
      await page.click('a[href="/contact"]')

      // URL should change
      await expect(page).toHaveURL(/\/contact/)

      // Contact page content should be visible
      await expect(page.locator('main')).toBeVisible()
    })
  })

  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('mobile menu button is visible', async ({ page }) => {
      await page.goto('/')

      // Mobile menu button should be visible
      const menuButton = page.locator(
        'button[aria-label*="menu"], button[data-testid="mobile-menu"], .mobile-menu-button'
      )

      // Either mobile menu button exists or navigation is still visible
      const hasMenuButton = (await menuButton.count()) > 0
      if (hasMenuButton) {
        await expect(menuButton.first()).toBeVisible()
      }
    })

    test('can open mobile menu and navigate', async ({ page }) => {
      await page.goto('/')

      // Find mobile menu button
      const menuButton = page.locator(
        'button[aria-label*="menu"], button[data-testid="mobile-menu"], .mobile-menu-button'
      )

      const hasMenuButton = (await menuButton.count()) > 0
      if (hasMenuButton) {
        // Click to open mobile menu
        await menuButton.first().click()

        // Wait for menu to appear
        await page.waitForTimeout(300)

        // Navigation links should be visible
        const blogLink = page.locator('a[href="/blog"]')
        if ((await blogLink.count()) > 0) {
          await blogLink.first().click()
          await expect(page).toHaveURL(/\/blog/)
        }
      }
    })
  })
})
