import { describe, expect, it } from 'vitest'

import { ROUTE_STACK_STORAGE_KEY, popPreviousRoute, trackRouteVisit } from '@/components/docente-route-history'

class MemoryStorage {
  private readonly map = new Map<string, string>()

  getItem(key: string) {
    return this.map.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.map.set(key, value)
  }
}

describe('lib/route-history', () => {
  it('mantém histórico de navegação em pilha sem duplicar rota consecutiva', () => {
    const storage = new MemoryStorage()

    trackRouteVisit(storage, '/docentes')
    trackRouteVisit(storage, '/docentes/10')
    trackRouteVisit(storage, '/docentes/10/editar')
    trackRouteVisit(storage, '/docentes/10/editar')

    expect(storage.getItem(ROUTE_STACK_STORAGE_KEY)).toBe(
      JSON.stringify(['/docentes', '/docentes/10', '/docentes/10/editar']),
    )
  })

  it('retorna rota anterior correta ao desfazer caminho Editar -> Visualização -> Painel', () => {
    const storage = new MemoryStorage()

    trackRouteVisit(storage, '/docentes')
    trackRouteVisit(storage, '/docentes/10')
    trackRouteVisit(storage, '/docentes/10/editar')

    const backFromEdit = popPreviousRoute(storage, '/docentes/10/editar')
    expect(backFromEdit).toBe('/docentes/10')
    expect(storage.getItem(ROUTE_STACK_STORAGE_KEY)).toBe(JSON.stringify(['/docentes', '/docentes/10']))

    const backFromView = popPreviousRoute(storage, '/docentes/10')
    expect(backFromView).toBe('/docentes')
    expect(storage.getItem(ROUTE_STACK_STORAGE_KEY)).toBe(JSON.stringify(['/docentes']))
  })
})
