import { test, expect } from '@playwright/test'

test.describe('Contact Page', () => {
  test.describe('Page Load', () => {
    test('contact page loads with form', async ({ page }) => {
      await page.goto('/contact')

      // Page should have main content
      await expect(page.locator('main')).toBeVisible()

      // Should have a heading
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()

      // Should have a contact form
      const form = page.locator('form')
      await expect(form).toBeVisible()
    })

    test('form has required input fields', async ({ page }) => {
      await page.goto('/contact')

      // Name field
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]')
      await expect(nameInput).toBeVisible()

      // Email field
      const emailInput = page.locator('input[name="email"], input[type="email"]')
      await expect(emailInput).toBeVisible()

      // Phone field
      const phoneInput = page.locator('input[name="phone"], input[type="tel"]')
      await expect(phoneInput).toBeVisible()

      // Message field
      const messageInput = page.locator('textarea[name="message"], textarea')
      await expect(messageInput).toBeVisible()

      // Submit button
      const submitButton = page.locator('button[type="submit"], input[type="submit"]')
      await expect(submitButton).toBeVisible()
    })
  })

  test.describe('Form Validation', () => {
    test('shows validation errors for empty submit', async ({ page }) => {
      await page.goto('/contact')

      // Click submit without filling form
      const submitButton = page.locator('button[type="submit"], input[type="submit"]')
      await submitButton.click()

      // Wait for validation to trigger
      await page.waitForTimeout(300)

      // Should show validation errors
      const errorMessages = page.locator(
        '[data-error], .error, [role="alert"], span:has-text("required"), p:has-text("must")'
      )

      // Either validation errors shown or form prevented submission
      // Modern browsers also show HTML5 validation tooltips
      const errorsShown = (await errorMessages.count()) > 0
      const formHasValidation = await page.locator('input:invalid').count()

      expect(errorsShown || formHasValidation > 0).toBeTruthy()
    })

    test('shows validation error for invalid email', async ({ page }) => {
      await page.goto('/contact')

      // Fill in name and phone but invalid email
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]')
      await nameInput.fill('John Doe')

      const emailInput = page.locator('input[name="email"], input[type="email"]')
      await emailInput.fill('invalid-email')

      const phoneInput = page.locator('input[name="phone"], input[type="tel"]')
      await phoneInput.fill('123-456-7890')

      const messageInput = page.locator('textarea[name="message"], textarea')
      await messageInput.fill('This is a test message for the contact form.')

      // Try to submit
      const submitButton = page.locator('button[type="submit"], input[type="submit"]')
      await submitButton.click()

      // Wait for validation
      await page.waitForTimeout(300)

      // Check for email validation error
      const emailError = page.locator('[data-error*="email"], .error:has-text("email"), p:has-text("email")')
      const emailInvalid = await emailInput.evaluate((el) => !(el as HTMLInputElement).validity.valid)

      expect((await emailError.count()) > 0 || emailInvalid).toBeTruthy()
    })

    test('form fields accept valid input', async ({ page }) => {
      await page.goto('/contact')

      // Fill all fields with valid data
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]')
      await nameInput.fill('John Doe')
      await expect(nameInput).toHaveValue('John Doe')

      const emailInput = page.locator('input[name="email"], input[type="email"]')
      await emailInput.fill('john@example.com')
      await expect(emailInput).toHaveValue('john@example.com')

      const phoneInput = page.locator('input[name="phone"], input[type="tel"]')
      await phoneInput.fill('123-456-7890')
      await expect(phoneInput).toHaveValue('123-456-7890')

      const messageInput = page.locator('textarea[name="message"], textarea')
      await messageInput.fill(
        'This is a test message for the contact form. It should be long enough to pass validation.'
      )
      await expect(messageInput).toContainText('test message')
    })

    test('optional fields are fillable', async ({ page }) => {
      await page.goto('/contact')

      // Service dropdown (optional)
      const serviceSelect = page.locator(
        'select[name="service"], [role="combobox"][aria-label*="service" i]'
      )
      if ((await serviceSelect.count()) > 0) {
        await expect(serviceSelect.first()).toBeVisible()
      }

      // Budget dropdown (optional)
      const budgetSelect = page.locator(
        'select[name="budget"], [role="combobox"][aria-label*="budget" i]'
      )
      if ((await budgetSelect.count()) > 0) {
        await expect(budgetSelect.first()).toBeVisible()
      }

      // Timeline dropdown (optional)
      const timelineSelect = page.locator(
        'select[name="timeline"], [role="combobox"][aria-label*="timeline" i]'
      )
      if ((await timelineSelect.count()) > 0) {
        await expect(timelineSelect.first()).toBeVisible()
      }
    })
  })

  test.describe('Form Submission', () => {
    // Note: Actual form submission is skipped to avoid sending test data
    // These tests verify the form structure and validation only

    test('submit button has appropriate text', async ({ page }) => {
      await page.goto('/contact')

      const submitButton = page.locator('button[type="submit"], input[type="submit"]')
      await expect(submitButton).toBeVisible()

      // Button should have meaningful text
      const buttonText = await submitButton.textContent()
      expect(buttonText?.toLowerCase()).toMatch(/send|submit|contact/i)
    })
  })
})
