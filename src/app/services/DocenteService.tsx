'use client'
import { Docente, DadosDocente, Documento, Telefone, Cargo } from '@/types/docente'
import { formatDatesFromObject } from '@/utils/dateUtils'

export class DocenteService {
  private static async get<T>(url: string): Promise<T> {
    const response = await fetch(url)
    return await response.json()
  }

  private static async post<T>(url: string, data: T): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return await response.json()
  }

  private static async put<T>(url: string, data: T): Promise<void> {
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  private static async delete(url: string): Promise<void> {
    await fetch(url, { method: 'DELETE' })
  }

  static async carregaLista(): Promise<Docente[]> {
    return await this.get<Docente[]>('/api/docentes/nomes')
  }

  static async carregaDados(id: number): Promise<DadosDocente> {
    if (id == -1) {
      return Promise.reject(new Error('ID inválido'))
    }

    try {
      const dados = await this.carregaDadosGerais(id)
      const telefones = await this.carregaTelefones(id)
      const documentos = await this.carregaDocumentos(id)
      const cargos = await this.carregaCargos(id)
      return { ...dados, telefones, documentos, cargos }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      return Promise.reject(error)
    }
  }

  static async carregaDadosGerais(id: number): Promise<DadosDocente> {
    const result: DadosDocente = await this.get<DadosDocente>(`/api/docentes?id=${id}`)

    return formatDatesFromObject(result, ['data_admissao', 'data_nascimento', 'regime_data_aplicacao'])
  }

  static async carregaDocumentos(id: number): Promise<Documento[]> {
    try {
      return await this.get<Documento[]>(`/api/docentes/documentos?docente_id=${id}`)
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
      return []
    }
  }

  static async carregaTelefones(id: number): Promise<Telefone[]> {
    try {
      return await this.get<Telefone[]>(`/api/docentes/telefones?docente_id=${id}`)
    } catch (error) {
      console.error('Erro ao carregar telefones:', error)
      return []
    }
  }

  static async carregaCargos(id: number): Promise<Cargo[]> {
    try {
      const result = await this.get<Cargo[]>(`/api/docentes/cargos?docente_id=${id}`)
      return result.map((row: Cargo) => ({
        ...row,
        data_inicio: new Date(row.data_inicio),
      }))
    } catch (error) {
      console.error('Erro ao carregar cargos:', error)
      return []
    }
  }

  static async criar(dados: DadosDocente): Promise<DadosDocente> {
    return await this.post<DadosDocente>('/api/docentes', dados)
  }

  static async atualizar(dados: DadosDocente): Promise<void> {
    await this.put('/api/docentes', dados)
  }

  static async deletar(id: number): Promise<void> {
    await this.delete(`/api/docentes?id=${id}`)
  }

  static async criarTelefone(docente_id: number, telefone: string, tipo: string): Promise<void> {
    await this.post('/api/docentes/telefones', { docente_id, telefone, tipo })
  }

  static async atualizarTelefone(telefone: Telefone): Promise<void> {
    await this.put('/api/docentes/telefones', telefone)
  }

  static async deletarTelefone(id: number): Promise<void> {
    await this.delete(`/api/docentes/telefones?id=${id}`)
  }
}
