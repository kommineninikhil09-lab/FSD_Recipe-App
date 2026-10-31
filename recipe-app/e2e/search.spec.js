import { expect, test } from '@playwright/test'

const cards = (page) => page.locator('.grid .card')
const titles = (page) => page.locator('.grid .card-title')
const searchBox = (page) => page.getByRole('searchbox', { name: 'Search recipes' })
const categorySelect = (page) => page.getByRole('combobox', { name: 'Filter by category' })

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('searches by title', async ({ page }) => {
    await searchBox(page).fill('pizza')
    await expect(titles(page)).toHaveText(['Classic Margherita Pizza'])
    await expect(page.getByText('Showing 1 of 12 recipes')).toBeVisible()
  })

  test('searches by ingredient', async ({ page }) => {
    await searchBox(page).fill('feta')
    await expect(titles(page)).toHaveText(['Greek Salad'])
  })

  test('searches by cuisine', async ({ page }) => {
    await searchBox(page).fill('indian')
    await expect(titles(page)).toHaveText(['Butter Chicken', 'Mango Lassi'])
  })

  test('searches by tag', async ({ page }) => {
    await searchBox(page).fill('stir-fry')
    await expect(titles(page)).toHaveText(['Chicken Pad Thai', 'Vegetable Fried Rice'])
  })

  test('is case-insensitive', async ({ page }) => {
    await searchBox(page).fill('CHICKEN')
    await expect(cards(page)).toHaveCount(2)
  })

  test('multi-word queries match recipes containing every word', async ({ page }) => {
    await searchBox(page).fill('chicken noodles')
    await expect(titles(page)).toHaveText(['Chicken Pad Thai'])
  })

  test('keeps every character when typing quickly (regression)', async ({ page }) => {
    await searchBox(page).pressSequentially('chicken', { delay: 0 })
    await expect(searchBox(page)).toHaveValue('chicken')
    await expect(cards(page)).toHaveCount(2)
    await expect(page).toHaveURL(/\?q=chicken$/)
  })

  test('filters by category', async ({ page }) => {
    await categorySelect(page).selectOption('Breakfast')
    await expect(titles(page)).toHaveText([
      'Avocado Toast with Poached Egg',
      'Fluffy Pancakes',
    ])
    await expect(page).toHaveURL(/category=Breakfast/)
  })

  test('combines search text with the category filter', async ({ page }) => {
    await searchBox(page).fill('vegetarian')
    await categorySelect(page).selectOption('Main Course')
    await expect(titles(page)).toHaveText(['Classic Margherita Pizza', 'Vegetable Fried Rice'])
  })

  test('lists every category in the dropdown', async ({ page }) => {
    await expect(categorySelect(page).locator('option')).toHaveText([
      'All categories',
      'Breakfast',
      'Dessert',
      'Drink',
      'Main Course',
      'Salad',
      'Soup',
    ])
  })

  test('shows an empty state and clears the search', async ({ page }) => {
    await searchBox(page).fill('xyz-not-a-recipe')
    await expect(cards(page)).toHaveCount(0)
    await expect(page.getByText('No recipes match your search.')).toBeVisible()

    await page.getByRole('button', { name: 'Clear search' }).click()
    await expect(searchBox(page)).toHaveValue('')
    await expect(cards(page)).toHaveCount(12)
    await expect(page).toHaveURL(/\/$/)
  })

  test('loads a search straight from the URL', async ({ page }) => {
    await page.goto('/?q=salmon&category=Main%20Course')
    await expect(searchBox(page)).toHaveValue('salmon')
    await expect(categorySelect(page)).toHaveValue('Main Course')
    await expect(titles(page)).toHaveText(['Salmon Teriyaki'])
  })

  test('keeps the search after opening a recipe and going back', async ({ page }) => {
    await searchBox(page).fill('chicken')
    await expect(cards(page)).toHaveCount(2)
    await cards(page).first().click()
    await expect(page).toHaveURL(/\/recipes\/\d+$/)

    await page.getByRole('button', { name: '← Back to recipes' }).click()
    await expect(searchBox(page)).toHaveValue('chicken')
    await expect(cards(page)).toHaveCount(2)
  })
})
