import { expect, test } from '@playwright/test'

test('carrega pagina de login', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'DGDB' })).toBeVisible()
})

test('redireciona para login ao acessar rota raiz sem sessao', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login$/)
})

test('redireciona para login ao acessar pagina de docentes sem sessao', async ({ page }) => {
  await page.goto('/docentes')
  await expect(page).toHaveURL(/\/login$/)
})

test('exibe mensagem de erro recebida por query string no login', async ({ page }) => {
  await page.goto('/login?erro=Credenciais%20inv%C3%A1lidas')
  await expect(page.getByText('Credenciais inválidas')).toBeVisible()
})
