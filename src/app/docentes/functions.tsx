'use client'
import { Docente, DadosDocente, Documento } from '@/types/docente'
import { createListCollection } from '@chakra-ui/react'

export async function carregaDocente(): Promise<Docente> {
  const response = await fetch('/api/docentes/nomes')
  const data = await response.json()
  return data
}

export async function carregaDadosDocente(id: number): Promise<DadosDocente | undefined> {
  if (id === -1) return

  try {
    const response = await fetch(`/api/docentes?id=${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao carregar dados do docente:', error)
  }
  return
}

export async function carregaDocumentosDocente(id: number): Promise<Documento[] | []> {
  try {
    const response = await fetch(`/api/docentes/documentos?docente_id=${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao carregar documentos do docente:', error)
  }
  return []
}
