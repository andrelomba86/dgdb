import { redirect } from 'next/navigation'

import { Box, Text } from '@chakra-ui/react'

import { getDocenteAction } from '@/actions/docente-actions'
import type { DocenteFormValues } from '@/components/docente-form-fields'
import { DocentePageShell } from '@/components/docente-page-shell'
import type { RelatedEntitiesInitialData } from '@/components/docente-related-fields'
import { UpdateDocenteForm } from '@/components/update-docente-form'
import { requireAuthenticatedUser } from '@/lib/auth-guard'
import { docenteService } from '@/services/docente-service'

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function toDateInputValue(value: Date | null) {
  return value ? new Date(value).toISOString().split('T')[0] : ''
}

type EditDocentePageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditDocentePage({ params, searchParams }: EditDocentePageProps) {
  await requireAuthenticatedUser()

  const { id } = await params
  const resolvedParams = await searchParams

  const docId = parseInt(id, 10)
  if (isNaN(docId)) {
    redirect('/docentes')
  }

  const successMessage = getFirstParam(resolvedParams.sucesso)

  const [result, telefoneTiposSugeridos] = await Promise.all([
    getDocenteAction(docId),
    docenteService.listTelefoneTiposSugeridos(),
  ])
  if (!result.success || !result.data) {
    return (
      <Box as="main" minH="100vh" p="24px" bg="linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)">
        <Text>Erro: {result.error}</Text>
      </Box>
    )
  }

  const docente = result.data

  const docenteFormValues: DocenteFormValues = {
    nome: docente.nome,
    dataNascimento: toDateInputValue(docente.dataNascimento),
    endereco: docente.endereco || '',
    matricula: docente.matricula || '',
    email: docente.email || '',
    dataAdmissao: toDateInputValue(docente.dataAdmissao),
    regimeJuridico: docente.regimeJuridico || '',
    regimeTrabalho: docente.regimeTrabalho || '',
    regimeDataAplicacao: toDateInputValue(docente.regimeDataAplicacao),
    ativo: docente.ativo,
  }

  const relatedInitialData: RelatedEntitiesInitialData = {
    progressoes: docente.progressoes.map(progressao => ({
      id: progressao.id,
      funcao: progressao.funcao || '',
      dataInicio: toDateInputValue(progressao.dataInicio),
      dataTermino: toDateInputValue(progressao.dataTermino),
      referencia: progressao.referencia || '',
    })),
    telefones: docente.telefones.map(telefone => ({
      id: telefone.id,
      telefone: telefone.telefone,
      tipo: telefone.tipo || 'celular',
    })),
    documentos: docente.documentos.map(documento => ({
      id: documento.id,
      tipo: documento.tipo,
      documento: documento.documento,
    })),
    contasBancarias: docente.contasBancarias.map(conta => ({
      id: conta.id,
      banco: conta.banco,
      agencia: conta.agencia,
      conta: conta.conta,
    })),
    telefoneTiposSugeridos,
  }

  return (
    <DocentePageShell badge="Edição de docente" title={docente.nome}>
      <UpdateDocenteForm
        id={docente.id}
        initialValues={docenteFormValues}
        relatedInitialData={relatedInitialData}
        initialSuccessMessage={successMessage}
      />
    </DocentePageShell>
  )
}
