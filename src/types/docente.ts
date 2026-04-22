import type { Progressao, ContaBancaria, Documento, Docente, Telefone } from '@prisma/client'

import type { CreateDocenteInput, DocenteListInput, UpdateDocenteInput } from '@/validators/docente'
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

export type DocenteFilters = DocenteListInput

export type CreateDocenteCommand = CreateDocenteInput

export type UpdateDocenteCommand = UpdateDocenteInput
export type InfoItemProps = {
  label: string
  value: ReactNode
}
export type DocenteDetailViewProps = {
  docente: DocenteAggregate
  successMessage?: string
}

export type ProgressaoFormValue = {
  id?: number
  funcao: string
  dataInicio: string
  dataTermino: string
  referencia: string
}

export type TelefoneFormValue = {
  id?: number
  telefone: string
  tipo: string
}

export type DocumentoFormValue = {
  id?: number
  tipo: string
  documento: string
}

export type ContaBancariaFormValue = {
  id?: number
  banco: string
  agencia: string
  conta: string
}

export type RelatedEntitiesInitialData = {
  progressoes: ProgressaoFormValue[]
  telefones: TelefoneFormValue[]
  documentos: DocumentoFormValue[]
  contasBancarias: ContaBancariaFormValue[]
  progressaoFuncoesSugeridas: string[]
  progressaoReferenciasSugeridas: string[]
  telefoneTiposSugeridos: string[]
  documentoTiposSugeridos: string[]
}

export type DocenteRelatedFieldsProps = {
  initialData?: RelatedEntitiesInitialData
}
