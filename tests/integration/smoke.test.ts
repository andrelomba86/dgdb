import { describe, expect, it, vi } from 'vitest'

import { DocenteService } from '@/services/docente-service'

describe('Smoke Integration', () => {
  it('aplica normalizacao de filtro de listagem na camada de servico', async () => {
    const repository = {
      list: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 10 }),
    }

    const service = new DocenteService(repository as never)
    await service.list({ page: 1, pageSize: 10, nome: '  Maria  ', sortBy: 'nome', sortOrder: 'asc' })

    expect(repository.list).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      nome: 'Maria',
      sortBy: 'nome',
      sortOrder: 'asc',
    })
  })
})
