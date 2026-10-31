import { expect, test } from '@playwright/test'

// Runs in both the desktop and the mobile (Pixel 7) projects.

test('list page has no horizontal scrolling', async ({ page }) => {
  await page.goto('/')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
})

test('header fits on one line (regression)', async ({ page }) => {
  await page.goto('/')
  const header = await page.locator('.header-inner').boundingBox()
  const logo = await page.locator('.logo').boundingBox()
  const addLink = await page.getByRole('link', { name: '+ Add Recipe' }).boundingBox()

  // Logo and nav links stay on a single row inside the 64px header.
  expect(logo.height).toBeLessThan(48)
  expect(addLink.height).toBeLessThan(48)
  expect(addLink.y + addLink.height).toBeLessThanOrEqual(header.y + header.height)
})

test('detail page is readable and has no horizontal scrolling', async ({ page }) => {
  await page.goto('/recipes/1')
  await expect(page.getByRole('heading', { level: 1, name: 'Classic Margherita Pizza' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Instructions' })).toBeVisible()
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
})

test('search works and the add form is usable', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('searchbox', { name: 'Search recipes' }).fill('pancakes')
  await expect(page.locator('.grid .card-title')).toHaveText(['Fluffy Pancakes'])

  await page.getByRole('link', { name: '+ Add Recipe' }).click()
  await expect(page.getByRole('button', { name: 'Save recipe' })).toBeVisible()
})

test('page loads without console errors', async ({ page }) => {
  const errors = []
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/')
  await page.goto('/recipes/3')
  await page.goto('/add')
  await page.getByRole('button', { name: 'Save recipe' }).click()

  expect(errors).toEqual([])
})
