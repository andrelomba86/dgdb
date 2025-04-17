//'use client'
import { Docente, DadosDocente, Documento, Telefone, Cargo, ApiResponse } from '@/types/docente'
import { formatDatesFromObject } from '@/utils/dateUtils'
import { logError } from '@/lib/logger'

export class DocenteService {
  private static async get<T>(url: string): Promise<T> {
    const response = await fetch(url)
    const result = await response.json()

    if (!response.ok) {
      logError(`Erro na requisição GET para ${url}`, result.error)
      throw new Error(result.error)
    }

    return result
  }

  private static async post<T>(url: string, data: T): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const result = await response.json()
        logError(`Erro na requisição POST para ${url}`, result.error)
        throw new Error(result.error)
      }
      return await response.json()
    } catch (error) {
      logError(`Exceção em POST para ${url}`, error)
      throw error
    }
  }

  private static async put<T>(url: string, data: T): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const result = await response.json()
        logError(`Erro na requisição PUT para ${url}`, result.error)
        throw new Error(result.error)
      }
    } catch (error) {
      logError(`Exceção em PUT para ${url}`, error)
      throw error
    }
  }

  private static async delete(url: string): Promise<void> {
    try {
      const response = await fetch(url, { method: 'DELETE' })
      if (!response.ok) {
        const result = await response.json()
        logError(`Erro na requisição DELETE para ${url}`, result.error)
        throw new Error(result.error)
      }
    } catch (error) {
      logError(`Exceção em DELETE para ${url}`, error)
      throw error
    }
  }

  static async carregaLista(): Promise<Docente[]> {
    try {
      return await this.get<Docente[]>('/api/docentes/nomes')
    } catch (error) {
      logError('Erro ao carregar lista de docentes', error)
      return []
    }
  }

  static async carregaDados(id: number): Promise<ApiResponse<DadosDocente>> {
    try {
      if (id < 0) {
        const err = new Error('ID recebido não é valido')
        logError('ID inválido em carregaDados', err)
        return {
          result: { nome: '' },
          error: err,
        }
      }

      const [dados, telefones, documentos, cargos] = await Promise.all([
        this.carregaDadosGerais(id),
        this.carregaTelefones(id),
        this.carregaDocumentos(id),
        this.carregaCargos(id),
      ])

      return {
        result: { ...dados, telefones, documentos, cargos },
      }
    } catch (error) {
      logError('Erro ao carregar dados', error)
      return { result: { nome: '' }, error: new Error('Erro ao carregar dados', { cause: (error as Error).message }) }
    }
  }

  static async carregaDadosGerais(id: number): Promise<DadosDocente> {
    try {
      const result = await this.get<DadosDocente>(`/api/docentes?id=${id}`)
      return formatDatesFromObject(result, ['data_admissao', 'data_nascimento', 'regime_data_aplicacao'])
    } catch (error) {
      logError('Erro ao carregar dados gerais', error)
      return { nome: '' } as DadosDocente
    }
  }

  static async carregaDocumentos(id: number): Promise<Documento[]> {
    try {
      return await this.get<Documento[]>(`/api/docentes/documentos?docente_id=${id}`)
    } catch (error) {
      logError('Erro ao carregar documentos', error)
      return []
    }
  }

  static async carregaTelefones(id: number): Promise<Telefone[]> {
    try {
      return await this.get<Telefone[]>(`/api/docentes/telefones?docente_id=${id}`)
    } catch (error) {
      logError('Erro ao carregar telefones', error)
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
      logError('Erro ao carregar cargos', error)
      return []
    }
  }

  static async criar(dados: DadosDocente): Promise<DadosDocente> {
    try {
      return await this.post<DadosDocente>('/api/docentes', dados)
    } catch (error) {
      logError('Erro ao criar docente', error)
      throw error
    }
  }

  static async atualizar(dados: DadosDocente): Promise<void> {
    try {
      await this.put('/api/docentes', dados)
    } catch (error) {
      logError('Erro ao atualizar docente', error)
      throw error
    }
  }

  static async deletar(id: number): Promise<void> {
    try {
      await this.delete(`/api/docentes?id=${id}`)
    } catch (error) {
      logError('Erro ao deletar docente', error)
      throw error
    }
  }

  static async criarTelefone(docente_id: number, telefone: string, tipo: string): Promise<void> {
    try {
      await this.post('/api/docentes/telefones', { docente_id, telefone, tipo })
    } catch (error) {
      logError('Erro ao criar telefone', error)
      throw error
    }
  }

  static async atualizarTelefone(telefone: Telefone): Promise<void> {
    try {
      await this.put('/api/docentes/telefones', telefone)
    } catch (error) {
      logError('Erro ao atualizar telefone', error)
      throw error
    }
  }

  static async deletarTelefone(id: number): Promise<void> {
    try {
      await this.delete(`/api/docentes/telefones?id=${id}`)
    } catch (error) {
      logError('Erro ao deletar telefone', error)
      throw error
    }
  }
}
