import { chromium } from 'playwright'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const screenshotsDir = path.join(__dirname, '../public/screenshots')

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'

async function generateScreenshots() {
  console.log('🖼️  Generating PWA screenshots...')
  console.log(`📍 Using base URL: ${BASE_URL}`)

  const browser = await chromium.launch()

  try {
    // Desktop screenshot (1280x720)
    console.log('📸 Taking desktop screenshot (1280x720)...')
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    })
    const desktopPage = await desktopContext.newPage()
    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle' })
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, 'desktop.png'),
      fullPage: false,
    })
    await desktopContext.close()
    console.log('✅ Desktop screenshot saved')

    // Mobile screenshot (750x1334 - iPhone 6/7/8 Plus ratio)
    console.log('📸 Taking mobile screenshot (750x1334)...')
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2, // Results in 750x1334 actual pixels
    })
    const mobilePage = await mobileContext.newPage()
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' })
    await mobilePage.screenshot({
      path: path.join(screenshotsDir, 'mobile.png'),
      fullPage: false,
    })
    await mobileContext.close()
    console.log('✅ Mobile screenshot saved')

    console.log('\n🎉 Screenshots generated successfully!')
    console.log(`📁 Saved to: ${screenshotsDir}`)
  } finally {
    await browser.close()
  }
}

generateScreenshots().catch((error) => {
  console.error('❌ Error generating screenshots:', error)
  process.exit(1)
})
