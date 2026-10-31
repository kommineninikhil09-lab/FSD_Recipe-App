import { expect, test } from '@playwright/test'

// Each Playwright test gets a fresh browser context, so localStorage starts empty.

async function fillValidRecipe(page) {
  await page.getByLabel('Recipe name').fill('Garlic Butter Shrimp')
  await page.getByLabel('Cuisine').fill('Spanish')
  await page.getByLabel('Category').selectOption('Main Course')
  await page.getByLabel('Difficulty').selectOption('Hard')
  await page.getByLabel('Prep time (min)').fill('10')
  await page.getByLabel('Cook time (min)').fill('8')
  await page.getByLabel('Servings').fill('2')
  await page.getByLabel('Short description').fill('Juicy shrimp sizzled in garlic butter.')
  // Blank lines and extra spaces should be ignored.
  await page.getByLabel('Ingredients').fill('300 g shrimp\n\n  3 tbsp butter  \n4 cloves garlic')
  await page.getByLabel('Instructions').fill('Melt the butter with garlic.\nAdd shrimp and cook 2 minutes per side.')
  await page.getByLabel('Tags').fill('Seafood, quick, ')
}

test.describe('Add recipe', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/add')
  })

  test('shows validation errors for an empty form and stays on the page', async ({ page }) => {
    await page.getByRole('button', { name: 'Save recipe' }).click()

    for (const message of [
      'Please give the recipe a name.',
      'Please enter a cuisine.',
      'Servings must be at least 1.',
      'Please add a short description.',
      'Add at least one ingredient.',
      'Add at least one step.',
    ]) {
      await expect(page.getByText(message)).toBeVisible()
    }
    await expect(page).toHaveURL(/\/add$/)
  })

  test('rejects whitespace-only fields and zero servings', async ({ page }) => {
    await page.getByLabel('Recipe name').fill('   ')
    await page.getByLabel('Servings').fill('0')
    await page.getByLabel('Ingredients').fill('\n   \n')
    await page.getByRole('button', { name: 'Save recipe' }).click()

    await expect(page.getByText('Please give the recipe a name.')).toBeVisible()
    await expect(page.getByText('Servings must be at least 1.')).toBeVisible()
    await expect(page.getByText('Add at least one ingredient.')).toBeVisible()
  })

  test('clears errors once the form is fixed and saves the recipe', async ({ page }) => {
    await page.getByRole('button', { name: 'Save recipe' }).click()
    await expect(page.locator('.field-error')).toHaveCount(6)

    await fillValidRecipe(page)
    await page.getByRole('button', { name: 'Save recipe' }).click()

    await expect(page).toHaveURL(/\/recipes\/13$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Garlic Butter Shrimp' })).toBeVisible()
    await expect(page.locator('.detail-badges')).toContainText('Spanish')

    const stat = (label) => page.locator('.stat').filter({ has: page.getByText(label, { exact: true }) }).locator('dd')
    await expect(stat('Total')).toHaveText('18 min')
    await expect(stat('Servings')).toHaveText('2')
    await expect(stat('Difficulty')).toHaveText('Hard')

    await expect(page.locator('.ingredients li')).toHaveText(['300 g shrimp', '3 tbsp butter', '4 cloves garlic'])
    await expect(page.locator('.instructions li')).toHaveCount(2)
    await expect(page.locator('.tags .tag')).toHaveText(['#seafood', '#quick'])
  })

  test('new recipe appears in the list, is searchable and survives a reload', async ({ page }) => {
    await fillValidRecipe(page)
    await page.getByRole('button', { name: 'Save recipe' }).click()
    await expect(page).toHaveURL(/\/recipes\/13$/)

    await page.getByRole('link', { name: 'All Recipes' }).click()
    await expect(page.locator('.grid .card')).toHaveCount(13)
    await expect(page.getByText('Browse 13 hand-picked recipes')).toBeVisible()

    await page.getByRole('searchbox', { name: 'Search recipes' }).fill('shrimp')
    await expect(page.locator('.grid .card-title')).toHaveText(['Garlic Butter Shrimp'])

    await page.reload()
    await expect(page.locator('.grid .card-title')).toHaveText(['Garlic Butter Shrimp'])

    await page.goto('/recipes/13')
    await expect(page.getByRole('heading', { level: 1, name: 'Garlic Butter Shrimp' })).toBeVisible()
  })

  test('assigns unique ids to several new recipes', async ({ page }) => {
    await fillValidRecipe(page)
    await page.getByRole('button', { name: 'Save recipe' }).click()
    await expect(page).toHaveURL(/\/recipes\/13$/)

    await page.goto('/add')
    await fillValidRecipe(page)
    await page.getByLabel('Recipe name').fill('Second Shrimp Dish')
    await page.getByRole('button', { name: 'Save recipe' }).click()
    await expect(page).toHaveURL(/\/recipes\/14$/)

    await page.goto('/recipes/13')
    await expect(page.getByRole('heading', { level: 1, name: 'Garlic Butter Shrimp' })).toBeVisible()
  })

  test('cancel returns to the list without saving', async ({ page }) => {
    await page.getByLabel('Recipe name').fill('Unsaved recipe')
    await page.getByRole('button', { name: 'Cancel' }).click()

    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('.grid .card')).toHaveCount(12)
  })

  test('survives corrupted localStorage data', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('recipe-app:custom-recipes', '{not json'))
    await page.goto('/')
    await expect(page.locator('.grid .card')).toHaveCount(12)
  })
})
