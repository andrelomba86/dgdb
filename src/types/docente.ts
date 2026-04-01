import type { Cargo, ContaBancaria, Documento, Docente, Telefone } from '@prisma/client'

import type { CreateDocenteInput, DocenteListInput, UpdateDocenteInput } from '@/validators/docente'

export type SortDirection = 'asc' | 'desc'

export type DocenteSortField = 'nome' | 'dataAdmissao'

export type DocenteAggregate = Docente & {
  cargos: Cargo[]
  telefones: Telefone[]
  documentos: Documento[]
  contasBancarias: ContaBancaria[]
}

export type DocenteListResult = {
  items: DocenteAggregate[]
  total: number
  page: number
  pageSize: number
}

export type DocenteFilters = DocenteListInput

export type CreateDocenteCommand = CreateDocenteInput

export type UpdateDocenteCommand = UpdateDocenteInput
