import { expect, test } from '@playwright/test'

test.describe('Recipe detail page', () => {
  test('shows all details of a recipe', async ({ page }) => {
    await page.goto('/recipes/2')

    await expect(page.getByRole('heading', { level: 1, name: 'Butter Chicken' })).toBeVisible()
    await expect(page.locator('.detail-badges')).toContainText('Main Course')
    await expect(page.locator('.detail-badges')).toContainText('Indian')
    await expect(page.locator('.detail-description')).toContainText('creamy tomato and butter sauce')

    const stat = (label) => page.locator('.stat').filter({ has: page.getByText(label, { exact: true }) }).locator('dd')
    await expect(stat('Prep')).toHaveText('30 min')
    await expect(stat('Cook')).toHaveText('35 min')
    await expect(stat('Total')).toHaveText('65 min')
    await expect(stat('Servings')).toHaveText('4')
    await expect(stat('Difficulty')).toHaveText('Medium')

    await expect(page.getByRole('heading', { name: 'Ingredients' })).toBeVisible()
    await expect(page.locator('.ingredients li')).toHaveCount(11)
    await expect(page.locator('.ingredients li').first()).toHaveText('700 g boneless chicken thighs, cubed')

    await expect(page.getByRole('heading', { name: 'Instructions' })).toBeVisible()
    await expect(page.locator('.instructions li')).toHaveCount(6)
    await expect(page.locator('.instructions li').last()).toHaveText('Serve hot with naan or basmati rice.')

    await expect(page.locator('.tags .tag')).toHaveText(['#chicken', '#curry', '#spicy'])
  })

  test('every sample recipe has a working detail page', async ({ page }) => {
    for (let id = 1; id <= 12; id++) {
      await page.goto(`/recipes/${id}`)
      await expect(page.locator('.detail-title')).not.toBeEmpty()
      expect(await page.locator('.ingredients li').count()).toBeGreaterThan(0)
      expect(await page.locator('.instructions li').count()).toBeGreaterThan(0)
    }
  })

  test('clicking a tag searches for it', async ({ page }) => {
    await page.goto('/recipes/2')
    await page.getByRole('link', { name: '#curry' }).click()

    await expect(page).toHaveURL(/\/\?q=curry$/)
    await expect(page.getByRole('searchbox', { name: 'Search recipes' })).toHaveValue('curry')
    await expect(page.locator('.grid .card-title')).toHaveText(['Butter Chicken'])
  })

  test('back button goes to the list when the page was opened directly', async ({ page }) => {
    await page.goto('/recipes/5')
    await page.getByRole('button', { name: '← Back to recipes' }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('.grid .card')).toHaveCount(12)
  })

  test('shows a not-found message for an unknown recipe id', async ({ page }) => {
    await page.goto('/recipes/999')
    await expect(page.getByRole('heading', { name: 'Not found' })).toBeVisible()
    await expect(page.getByText("We couldn't find that recipe.")).toBeVisible()

    await page.getByRole('link', { name: 'Back to all recipes' }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('shows a not-found page for an unknown route', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.getByRole('heading', { name: 'Not found' })).toBeVisible()
    await expect(page.getByText("The page you're looking for doesn't exist.")).toBeVisible()
  })
})
