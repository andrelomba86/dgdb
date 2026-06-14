import { afterEach, describe, expect, it, vi } from 'vitest'

import { setPrevious, getPrevious, clearPrevious } from '@/hooks/use-back-navigation'

const mockSessionStorage = vi.hoisted(() => {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => store.clear(),
  }
})

vi.stubGlobal('sessionStorage', mockSessionStorage)

afterEach(() => {
  mockSessionStorage.clear()
})

describe('hooks/use-back-navigation (passive)', () => {
  it('salva e recupera previous por actionKey', () => {
    setPrevious('view', '/docentes')
    setPrevious('edit', '/docentes/10')

    expect(getPrevious('view')).toBe('/docentes')
    expect(getPrevious('edit')).toBe('/docentes/10')
  })

  it('sobrescreve previous existente para a mesma actionKey', () => {
    setPrevious('edit', '/docentes/10')
    setPrevious('edit', '/docentes/10/editar')

    expect(getPrevious('edit')).toBe('/docentes/10/editar')
  })

  it('clearPrevious remove apenas a chave especificada', () => {
    setPrevious('view', '/docentes')
    setPrevious('edit', '/docentes/10')

    clearPrevious('edit')
    expect(getPrevious('edit')).toBeNull()
    expect(getPrevious('view')).toBe('/docentes')
  })

  it('clearPrevious sem argumento limpa tudo', () => {
    setPrevious('view', '/docentes')
    setPrevious('edit', '/docentes/10')

    clearPrevious()
    expect(getPrevious('view')).toBeNull()
    expect(getPrevious('edit')).toBeNull()
  })
})
