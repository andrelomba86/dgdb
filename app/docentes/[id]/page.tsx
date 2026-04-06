import { redirect } from 'next/navigation'

import { Box, Text } from '@chakra-ui/react'

import { getDocenteAction } from '@/actions/docente-actions'
import { DocenteDetailView } from '@/components/docente-detail-view'
import { DocentePageShell } from '@/components/docente-page-shell'
import { requireAuthenticatedUser } from '@/lib/auth-guard'

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

type DocenteDetailPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function DocenteDetailPage({ params, searchParams }: DocenteDetailPageProps) {
  await requireAuthenticatedUser()

  const { id } = await params
  const resolvedParams = await searchParams

  const docId = parseInt(id, 10)
  if (isNaN(docId)) {
    redirect('/docentes')
  }

  const successMessage = getFirstParam(resolvedParams.sucesso)

  const result = await getDocenteAction(docId)
  if (!result.success || !result.data) {
    return (
      <Box as="main" minH="100vh" p="24px" bg="linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)">
        <Text>Erro: {result.error}</Text>
      </Box>
    )
  }

  const docente = result.data

  return (
    <DocentePageShell badge="Visualização de docente" title={docente.nome}>
      <DocenteDetailView docente={docente} successMessage={successMessage} />
    </DocentePageShell>
  )
}
