'use client'

import { HStack, Text } from '@chakra-ui/react'
import { useState, useTransition } from 'react'

import { exportDocentesCsvAction, exportDocentesPdfAction } from '@/actions/docente-actions'
import type { DocenteExportPayload } from '@/lib/docente-export'

type ExportFilters = {
  nome?: string
  matricula?: string
  email?: string
  dataAdmissaoInicio?: string
  dataAdmissaoFim?: string
  sortBy?: 'nome' | 'matricula' | 'email' | 'dataAdmissao'
  sortOrder?: 'asc' | 'desc'
}

type DocenteExportButtonsProps = {
  filters: ExportFilters
}

function decodeBase64(content: string) {
  const binary = window.atob(content)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function downloadPayload(payload: DocenteExportPayload) {
  const blob =
    payload.encoding === 'base64'
      ? new Blob([decodeBase64(payload.content)], { type: payload.mimeType })
      : new Blob([payload.content], { type: payload.mimeType })

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = payload.filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function toActionFilters(filters: ExportFilters) {
  return {
    page: 1,
    pageSize: 10,
    nome: filters.nome,
    matricula: filters.matricula,
    email: filters.email,
    dataAdmissaoInicio: filters.dataAdmissaoInicio
      ? new Date(`${filters.dataAdmissaoInicio}T00:00:00`)
      : undefined,
    dataAdmissaoFim: filters.dataAdmissaoFim ? new Date(`${filters.dataAdmissaoFim}T23:59:59`) : undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  }
}

export function DocenteExportButtons({ filters }: DocenteExportButtonsProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const triggerExport = (format: 'csv' | 'pdf') => {
    setError(null)

    startTransition(async () => {
      const actionFilters = toActionFilters(filters)
      const result =
        format === 'csv'
          ? await exportDocentesCsvAction(actionFilters)
          : await exportDocentesPdfAction(actionFilters)

      if (!result.success || !result.data) {
        setError(result.error ?? 'Não foi possível exportar os docentes.')
        return
      }

      downloadPayload(result.data)
    })
  }

  return (
    <HStack gap="10px" alignItems="center" flexWrap="wrap">
      <button
        type="button"
        onClick={() => triggerExport('csv')}
        disabled={isPending}
        style={{
          padding: '10px 16px',
          borderRadius: '999px',
          border: '1px solid #bfdbfe',
          background: '#eff6ff',
          color: '#1d4ed8',
          cursor: isPending ? 'wait' : 'pointer',
        }}>
        Exportar CSV
      </button>
      <button
        type="button"
        onClick={() => triggerExport('pdf')}
        disabled={isPending}
        style={{
          padding: '10px 16px',
          borderRadius: '999px',
          border: '1px solid #c7d2fe',
          background: '#eef2ff',
          color: '#4338ca',
          cursor: isPending ? 'wait' : 'pointer',
        }}>
        Exportar PDF
      </button>
      {error ? <Text color="#9f1239">{error}</Text> : null}
    </HStack>
  )
}
