import type { Progressao, ContaBancaria, Documento, Docente, Telefone } from '@prisma/client'

import type { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'

export type DocenteSortField = 'nome' | 'dataAdmissao'

export type DocenteAggregate = Docente & {
  progressoes: Progressao[]
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
export type InfoItemProps = {
  label: string
  value: ReactNode
}
export type DocenteDetailViewProps = {
  docente: DocenteAggregate
  successMessage?: string
}
