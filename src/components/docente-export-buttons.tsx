'use client'

import { HStack, Text, Button } from '@chakra-ui/react'
import { useState, useTransition } from 'react'

import { exportDocentesCsvAction, exportDocentesPdfAction } from '@/actions/docente-actions'
import type { DocenteExportPayload } from '@/lib/docente-export'

type ExportFilters = {
  nome?: string
  ativo?: boolean
  sortBy?: 'nome' | 'dataAdmissao'
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
    ativo: filters.ativo,
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
      <Button
        onClick={() => triggerExport('csv')}
        loading={isPending}
        loadingText="Exportando..."
        colorPalette="blue"
        rounded="full"
        variant="outline">
        Exportar para CSV
      </Button>
      <Button
        onClick={() => triggerExport('pdf')}
        loading={isPending}
        loadingText="Exportando..."
        colorPalette="blue"
        rounded="full"
        variant="outline">
        Exportar para PDF
      </Button>
      {error ? <Text color="#9f1239">{error}</Text> : null}
    </HStack>
  )
}
