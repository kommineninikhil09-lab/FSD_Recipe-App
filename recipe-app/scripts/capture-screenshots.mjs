// Captures screenshots of every feature for the project submission.
// Usage: start the dev server, then run
//   node scripts/capture-screenshots.mjs <baseUrl> <outputDir>
import { chromium, devices } from '@playwright/test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const baseUrl = process.argv[2] ?? 'http://localhost:5173'
const outDir = path.resolve(process.argv[3] ?? 'screenshots')
const reportFile = path.resolve('playwright-report/index.html')

const browser = await chromium.launch({ channel: 'chrome' })
const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 })
const page = await desktop.newPage()
const shot = async (name, opts = {}) => {
  // Full-page captures of a scrolled page stamp the sticky header mid-image, so scroll up first.
  if (opts.fullPage) await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: path.join(outDir, `${name}.png`), ...opts })
}
const search = () => page.getByRole('searchbox', { name: 'Search recipes' })

// Recipe list
await page.goto(baseUrl)
await shot('01-recipe-list', { fullPage: true })
await page.locator('.grid .card').first().screenshot({ path: path.join(outDir, '02-recipe-card.png') })

// Search
await search().fill('chicken')
await page.waitForTimeout(300)
await shot('03-search-chicken')
await search().fill('')
await page.getByRole('combobox', { name: 'Filter by category' }).selectOption('Breakfast')
await page.waitForTimeout(300)
await shot('04-category-filter-breakfast')
await page.goto(`${baseUrl}/?q=vegetarian&category=Main%20Course`)
await shot('05-search-and-filter-combined')
await page.goto(`${baseUrl}/?q=sushi`)
await shot('06-search-no-results')

// Recipe detail
await page.goto(`${baseUrl}/recipes/2`)
await shot('07-recipe-detail', { fullPage: true })

// Add recipe
await page.goto(`${baseUrl}/add`)
await shot('08-add-recipe-form', { fullPage: true })
await page.getByRole('button', { name: 'Save recipe' }).click()
await shot('09-add-recipe-validation', { fullPage: true })
await page.getByLabel('Recipe name').fill('Garlic Butter Shrimp')
await page.getByLabel('Emoji').fill('🍤')
await page.getByLabel('Cuisine').fill('Spanish')
await page.getByLabel('Prep time (min)').fill('10')
await page.getByLabel('Cook time (min)').fill('8')
await page.getByLabel('Servings').fill('2')
await page.getByLabel('Short description').fill('Juicy shrimp sizzled in a rich garlic butter sauce with lemon and parsley.')
await page.getByLabel('Ingredients').fill('300 g shrimp, peeled\n3 tbsp butter\n4 cloves garlic, minced\n1 tbsp lemon juice\nChopped parsley')
await page.getByLabel('Instructions').fill('Melt the butter in a pan over medium heat.\nAdd the garlic and cook for 1 minute.\nAdd the shrimp and cook 2 minutes per side.\nFinish with lemon juice and parsley.')
await page.getByLabel('Tags').fill('seafood, quick')
await shot('10-add-recipe-filled', { fullPage: true })
await page.getByRole('button', { name: 'Save recipe' }).click()
await page.waitForURL(/\/recipes\/13$/)
await shot('11-new-recipe-detail', { fullPage: true })
await page.getByRole('link', { name: 'All Recipes' }).click()
await search().fill('shrimp')
await page.waitForTimeout(300)
await shot('12-new-recipe-in-search')

// Not found
await page.goto(`${baseUrl}/recipes/999`)
await shot('13-recipe-not-found')

// Mobile
const mobile = await browser.newContext({ ...devices['Pixel 7'] })
const mobilePage = await mobile.newPage()
await mobilePage.goto(baseUrl)
await mobilePage.screenshot({ path: path.join(outDir, '14-mobile-list.png') })
await mobilePage.goto(`${baseUrl}/recipes/1`)
await mobilePage.screenshot({ path: path.join(outDir, '15-mobile-detail.png'), fullPage: true })

// End-to-end test report
await page.goto(pathToFileURL(reportFile).href)
await page.waitForTimeout(1000)
await shot('16-e2e-test-report', { fullPage: true })

await browser.close()
console.log(`Saved screenshots to ${outDir}`)
