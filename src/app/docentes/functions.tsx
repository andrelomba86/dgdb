'use client'
import { Docente, DadosDocente, Documento, Telefone } from '@/types/docente'
import { createListCollection } from '@chakra-ui/react'

//TODO: mudar nome do arquivo function.tsx para um nome mais apropriado
//TODO: eliminar código redundante neste arquivo
//TODO: eliminar o termo Docente doé métodos da classe DocenteService
export class DocenteService {
  static async carregaDocente(): Promise<Docente[]> {
    const response = await fetch('/api/docentes/nomes')
    const data = await response.json()
    return data
  }

  static async carregaDadosDocente(id: number): Promise<DadosDocente | undefined> {
    if (id === -1) return

    try {
      const response = await fetch(`/api/docentes?id=${id}`)
      const dadosDocente = await response.json()

      const telefones = await this.carregaTelefones(id)
      const documentos = await this.carregaDocumentos(id)
      const cargos = await this.carregaCargos(id)

      return {
        ...dadosDocente,
        telefones,
        documentos,
        cargos,
      }
    } catch (error) {
      console.error('Erro ao carregar dados do docente:', error)
    }
    return
  }

  static async carregaDocumentos(id: number): Promise<Documento[] | []> {
    try {
      const response = await fetch(`/api/docentes/documentos?docente_id=${id}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao carregar documentos do docente:', error)
    }
    return []
  }

  static async carregaTelefones(id: number): Promise<Telefone[] | []> {
    try {
      const response = await fetch(`/api/docentes/telefones?docente_id=${id}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao carregar telefones do docente:', error)
    }
    return []
  }

  static async carregaCargos(id: number): Promise<any[]> {
    try {
      const response = await fetch(`/api/docentes/cargos?docente_id=${id}`)
      const data = await response.json()
      console.log('CARGOS: ', data)
      return data
    } catch (error) {
      console.error('Erro ao carregar cargos do docente:', error)
      return []
    }
  }

  static async deletaTelefoneDocente(id: number): Promise<void> {
    try {
      await fetch(`/api/docentes/telefones?id=${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Erro ao deletar telefone:', error)
      throw error
    }
  }

  static async createDocente(dados: DadosDocente): Promise<DadosDocente> {
    const response = await fetch('/api/docentes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
    return await response.json()
  }

  static async updateDocente(dados: DadosDocente): Promise<void> {
    await fetch('/api/docentes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
  }

  static async deleteDocente(id: number): Promise<void> {
    await fetch(`/api/docentes?id=${id}`, {
      method: 'DELETE',
    })
  }

  static async createTelefone(docente_id: number, telefone: string, tipo: string): Promise<void> {
    await fetch('/api/docentes/telefones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docente_id, telefone, tipo }),
    })
  }

  static async updateTelefone(telefone: Telefone): Promise<void> {
    await fetch('/api/docentes/telefones', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telefone),
    })
  }
}
