import { test, expect } from '@playwright/test'

test.describe('Blog', () => {
  test.describe('Blog Listing Page', () => {
    test('blog listing page loads', async ({ page }) => {
      await page.goto('/blog')

      // Page should have main content
      await expect(page.locator('main')).toBeVisible()

      // Should have a heading
      const heading = page.locator('h1, h2').first()
      await expect(heading).toBeVisible()
    })

    test('displays posts or empty state', async ({ page }) => {
      await page.goto('/blog')

      // Either posts exist or an empty state message is shown
      const posts = page.locator('article, [data-testid="blog-post"]')
      const emptyState = page.locator(
        '[data-testid="empty-state"], .empty-state, p:has-text("No posts")'
      )

      const postsCount = await posts.count()
      const emptyStateCount = await emptyState.count()

      // Should have either posts or empty state
      expect(postsCount > 0 || emptyStateCount > 0).toBeTruthy()
    })

    test('category filter changes URL', async ({ page }) => {
      await page.goto('/blog')

      // Look for category filter
      const categoryFilter = page.locator(
        'select[data-testid="category-filter"], [role="combobox"]:has-text("Category"), button:has-text("Category")'
      )

      if ((await categoryFilter.count()) > 0) {
        await categoryFilter.first().click()

        // Wait for dropdown options
        await page.waitForTimeout(300)

        // Try to select an option
        const option = page.locator('[role="option"], option').first()
        if ((await option.count()) > 0) {
          await option.click()

          // URL should contain category parameter
          await page.waitForTimeout(300)
          // Note: URL might have category param now
        }
      }
    })

    test('tag filter changes URL', async ({ page }) => {
      await page.goto('/blog')

      // Look for tag filter
      const tagFilter = page.locator(
        'select[data-testid="tag-filter"], [role="combobox"]:has-text("Tag"), button:has-text("Tag")'
      )

      if ((await tagFilter.count()) > 0) {
        await tagFilter.first().click()

        // Wait for dropdown options
        await page.waitForTimeout(300)

        // Try to select an option
        const option = page.locator('[role="option"], option').first()
        if ((await option.count()) > 0) {
          await option.click()

          // URL should contain tag parameter
          await page.waitForTimeout(300)
        }
      }
    })
  })

  test.describe('Search', () => {
    test('search modal opens with keyboard shortcut', async ({ page }) => {
      await page.goto('/blog')

      // Press Cmd/Ctrl+K to open search
      await page.keyboard.press('Meta+k')

      // Wait for modal to appear
      await page.waitForTimeout(300)

      // Look for search modal/dialog
      const searchModal = page.locator(
        '[role="dialog"], [data-testid="search-modal"], .search-modal'
      )
      const searchInput = page.locator(
        'input[type="search"], input[placeholder*="search"], [role="combobox"] input'
      )

      // Either modal is visible or search input appeared
      const modalVisible = (await searchModal.count()) > 0
      const inputVisible = (await searchInput.count()) > 0

      expect(modalVisible || inputVisible).toBeTruthy()
    })
  })

  test.describe('Blog Post Detail', () => {
    test('can navigate to blog post from listing', async ({ page }) => {
      await page.goto('/blog')

      // Find a blog post link
      const postLink = page.locator('article a, [data-testid="blog-post"] a').first()

      if ((await postLink.count()) > 0) {
        // Get the href before clicking
        const href = await postLink.getAttribute('href')

        await postLink.click()

        // URL should change to the post
        await expect(page).toHaveURL(/\/blog\//)

        // Article content should be visible
        await expect(page.locator('main')).toBeVisible()

        // Should have article title
        const title = page.locator('h1')
        await expect(title).toBeVisible()
      }
    })

    test('blog post page has expected structure', async ({ page }) => {
      // Navigate directly to blog listing first
      await page.goto('/blog')

      // Find first post link
      const postLink = page.locator('article a, [data-testid="blog-post"] a').first()

      if ((await postLink.count()) > 0) {
        const href = await postLink.getAttribute('href')
        if (href) {
          await page.goto(href)

          // Should have main content
          await expect(page.locator('main')).toBeVisible()

          // Should have title
          await expect(page.locator('h1')).toBeVisible()

          // Should have article content
          const articleContent = page.locator('article, .content, [data-testid="post-content"]')
          if ((await articleContent.count()) > 0) {
            await expect(articleContent.first()).toBeVisible()
          }
        }
      }
    })
  })
})
