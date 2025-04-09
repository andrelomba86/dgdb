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

export interface DadosDocente extends Docente {
  data_nascimento?: string
  endereco?: string
  matricula?: string
  email?: string
  telefones?: string[]
  documentos?: Documento[]
  data_admissao?: string
  regime_trabalho?: string
  regime_juridico?: string
  regime_data_aplicacao?: string
  banco?: string
  agencia?: string
  conta?: string
}
