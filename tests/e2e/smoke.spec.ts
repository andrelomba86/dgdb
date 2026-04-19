import { expect, test } from '@playwright/test'

test('carrega pagina de login', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'DGDB' })).toBeVisible()
})
