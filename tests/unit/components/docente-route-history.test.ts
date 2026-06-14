import { afterEach, describe, expect, it, vi } from 'vitest'

import { popPreviousRoute, trackRouteVisit, readRouteStack, writeRouteStack } from '@/hooks/use-back-navigation'

const STORAGE_KEY = 'dgdb.routeStack'

const mockSessionStorage = vi.hoisted(() => {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value) },
    clear: () => store.clear(),
  }
})

vi.stubGlobal('sessionStorage', mockSessionStorage)

afterEach(() => {
  mockSessionStorage.clear()
})

describe('hooks/use-back-navigation', () => {
  it('mantém histórico de navegação em pilha sem duplicar rota consecutiva', () => {
    trackRouteVisit('/docentes')
    trackRouteVisit('/docentes/10')
    trackRouteVisit('/docentes/10/editar')
    trackRouteVisit('/docentes/10/editar')

    expect(readRouteStack()).toEqual(['/docentes', '/docentes/10', '/docentes/10/editar'])
  })

  it('retorna rota anterior correta ao desfazer caminho Editar -> Visualização -> Painel', () => {
    trackRouteVisit('/docentes')
    trackRouteVisit('/docentes/10')
    trackRouteVisit('/docentes/10/editar')

    const backFromEdit = popPreviousRoute('/docentes/10/editar')
    expect(backFromEdit).toBe('/docentes/10')
    expect(readRouteStack()).toEqual(['/docentes', '/docentes/10'])

    const backFromView = popPreviousRoute('/docentes/10')
    expect(backFromView).toBe('/docentes')
    expect(readRouteStack()).toEqual(['/docentes'])
  })

  it('cenario 1: Painel -> Visualizar -> Editar -> Voltar retorna Visualizar', () => {
    trackRouteVisit('/docentes')
    trackRouteVisit('/docentes/10')
    trackRouteVisit('/docentes/10/editar')

    const rotaAnterior = popPreviousRoute('/docentes/10/editar')
    expect(rotaAnterior).toBe('/docentes/10')
    expect(readRouteStack()).toEqual(['/docentes', '/docentes/10'])
  })

  it('cenario 2: Painel -> Editar -> Voltar retorna Painel', () => {
    trackRouteVisit('/docentes')
    trackRouteVisit('/docentes/10/editar')

    const rotaAnterior = popPreviousRoute('/docentes/10/editar')
    expect(rotaAnterior).toBe('/docentes')
    expect(readRouteStack()).toEqual(['/docentes'])
  })

  it('cenario 3: acesso direto a Editar -> Voltar retorna null (fallback para Painel)', () => {
    trackRouteVisit('/docentes/10/editar')

    const rotaAnterior = popPreviousRoute('/docentes/10/editar')
    expect(rotaAnterior).toBeNull()
    expect(readRouteStack()).toEqual([])
  })

  it('cenario 4: acesso direto a Visualizar -> Voltar retorna null (fallback para Painel)', () => {
    trackRouteVisit('/docentes/10')

    const rotaAnterior = popPreviousRoute('/docentes/10')
    expect(rotaAnterior).toBeNull()
    expect(readRouteStack()).toEqual([])
  })
})
