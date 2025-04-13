// import { AppProps } from "next/app"
export interface Docente {
  id: number
  nome: string
}

export interface Documento {
  id: number
  tipo: string
  documento: string
  docente_id: number
}

export interface Telefone {
  id: number
  telefone: string
  tipo: string
  docente_id: number
}

export interface Cargo {
  id: number
  descricao: string
  funcao: string
  data_inicio: Date
  referencia: string
  docente_id: number
}

export interface DadosDocente {
  nome: string
  data_nascimento?: Date
  endereco?: string
  matricula?: string
  email?: string
  telefones?: Telefone[]
  documentos?: Documento[]
  cargos?: Cargo[]
  data_admissao?: Date
  regime_trabalho?: string
  regime_juridico?: string
  regime_data_aplicacao?: Date
  banco?: string
  agencia?: string
  conta?: string
}

export interface DocenteFormProps {
  params: Promise<{
    id: string
  }>
  searchParams?: Promise<{
    editando?: string
  }>
}
