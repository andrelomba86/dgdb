// 'use client'
import { Docente, ProfessorData, Documento, Telefone, Cargo, ApiResponse } from '@/types'
import { formatDateFields } from '@/utils/dateUtils'
import { HttpRequest } from './HttpRequest'

export class ProfessorService extends HttpRequest {
  constructor() {
    super()
    console.log('ProfessorService instanciado', performance.now())
  }
  private async get<T>(url: string): Promise<T> {
    const result = this.fetch<T>(url)
    return result
  }

  private async post<T>(url: string, data: T): Promise<T> {
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
    return this.fetch<T>(url, init)
  }
  //TODO: verificar se deve retornar algo, pois existe o tipo T, mas sem retorno
  private async put<T>(url: string, data: T): Promise<void> {
    const init = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
    this.fetch<T>(url, init)
  }

  private async delete<T>(url: string): Promise<void> {
    const init = { method: 'DELETE' }
    this.fetch<T>(url, init)
  }

  private async carregaDadosGerais(id: number): Promise<ProfessorData> {
    const result = await this.get<ProfessorData>(`/api/docentes?id=${id}`)
    return formatDateFields(result, ['data_admissao', 'data_nascimento', 'regime_data_aplicacao'])
  }

  private async loadIDDocuments(id: number): Promise<Documento[]> {
    return await this.get<Documento[]>(`/api/docentes/documentos?docente_id=${id}`)
  }

  private async fetchPhones(id: number): Promise<Telefone[]> {
    return await this.get<Telefone[]>(`/api/docentes/telefones?docente_id=${id}`)
  }

  private async loadJobTitles(id: number): Promise<Cargo[]> {
    const result = await this.get<Cargo[]>(`/api/docentes/cargos?docente_id=${id}`)
    return result.map((row: Cargo) => formatDateFields(row, ['data_inicio']))
  }
  async fetchNames(): Promise<Docente[]> {
    return await this.get<Docente[]>('/api/docentes/nomes')
  }

  async fetchData(id: number): Promise<ApiResponse<ProfessorData>> {
    try {
      const [dados, telefones, documentos, cargos] = await Promise.all([
        this.carregaDadosGerais(id),
        this.fetchPhones(id),
        this.loadIDDocuments(id),
        this.loadJobTitles(id),
      ])
      return {
        result: { ...dados, telefones, documentos, cargos },
      }
    } catch (error) {
      console.error('Erro ao carregar dados', error)
      return { error: new Error('Erro ao carregar dados', { cause: (error as Error).message }) }
    }
  }

  async criar(dados: ProfessorData): Promise<ProfessorData> {
    try {
      return await this.post<ProfessorData>('/api/docentes', dados)
    } catch (error) {
      console.error('Erro ao criar docente', error)
      throw error
    }
  }

  async atualizar(dados: ProfessorData): Promise<void> {
    try {
      await this.put('/api/docentes', dados)
    } catch (error) {
      console.error('Erro ao atualizar docente', error)
      throw error
    }
  }

  async deletar(id: number): Promise<void> {
    try {
      await this.delete(`/api/docentes?id=${id}`)
    } catch (error) {
      console.error('Erro ao deletar docente', error)
      throw error
    }
  }

  async criarTelefone(docente_id: number, telefone: string, tipo: string): Promise<void> {
    try {
      await this.post('/api/docentes/telefones', { docente_id, telefone, tipo })
    } catch (error) {
      console.error('Erro ao criar telefone', error)
      throw error
    }
  }

  async atualizarTelefone(telefone: Telefone): Promise<void> {
    try {
      await this.put('/api/docentes/telefones', telefone)
    } catch (error) {
      console.error('Erro ao atualizar telefone', error)
      throw error
    }
  }

  async deletarTelefone(id: number): Promise<void> {
    try {
      await this.delete(`/api/docentes/telefones?id=${id}`)
    } catch (error) {
      console.error('Erro ao deletar telefone', error)
      throw error
    }
  }
}
