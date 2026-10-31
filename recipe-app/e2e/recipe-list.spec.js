import { expect, test } from '@playwright/test'

const cards = (page) => page.locator('.grid .card')

test.describe('Recipe list page', () => {
  test('shows the header, hero and all 12 sample recipes', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle('Recipe Book')
    await expect(page.getByRole('link', { name: /Recipe Book/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Find your next favourite meal' })).toBeVisible()
    await expect(page.getByText('Browse 12 hand-picked recipes')).toBeVisible()
    await expect(cards(page)).toHaveCount(12)
    await expect(page.getByText('Showing 12 of 12 recipes')).toBeVisible()
  })

  test('each card shows category, title, description, time, servings and cuisine', async ({ page }) => {
    await page.goto('/')
    const pizza = cards(page).filter({ hasText: 'Classic Margherita Pizza' })

    await expect(pizza.locator('.badge')).toHaveText('Main Course')
    await expect(pizza.locator('.card-text')).toContainText('Neapolitan-style pizza')
    await expect(pizza.locator('.card-meta')).toContainText('35 min') // 20 prep + 15 cook
    await expect(pizza.locator('.card-meta')).toContainText('4 servings')
    await expect(pizza.locator('.card-meta')).toContainText('Italian')
  })

  test('clicking a card opens that recipe', async ({ page }) => {
    await page.goto('/')
    await cards(page).filter({ hasText: 'Butter Chicken' }).click()

    await expect(page).toHaveURL(/\/recipes\/2$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Butter Chicken' })).toBeVisible()
  })

  test('header navigation works and highlights the active link', async ({ page }) => {
    await page.goto('/')
    const allRecipes = page.getByRole('link', { name: 'All Recipes' })
    await expect(allRecipes).toHaveClass(/active/)

    await page.getByRole('link', { name: '+ Add Recipe' }).click()
    await expect(page).toHaveURL(/\/add$/)
    await expect(page.getByRole('heading', { name: 'Add a new recipe' })).toBeVisible()

    await page.getByRole('link', { name: /Recipe Book/ }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(cards(page)).toHaveCount(12)
  })
})
