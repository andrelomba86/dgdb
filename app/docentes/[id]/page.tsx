import { redirect } from 'next/navigation'

import { Box, Heading, Text } from '@chakra-ui/react'

import { deleteDocenteAction, getDocenteAction } from '@/actions/docente-actions'
import { ConfirmSubmitButton } from '@/components/confirm-submit-button'
import type { DocenteFormValues } from '@/components/docente-form-fields'
import { DocentePageShell } from '@/components/docente-page-shell'
import type { RelatedEntitiesInitialData } from '@/components/docente-related-fields'
import { UpdateDocenteForm } from '@/components/update-docente-form'
import { requireAuthenticatedUser } from '@/lib/auth-guard'

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function toDateInputValue(value: Date | null) {
  return value ? new Date(value).toISOString().split('T')[0] : ''
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
    cargos: docente.cargos.map(cargo => ({
      id: cargo.id,
      descricao: cargo.descricao,
      funcao: cargo.funcao || '',
      dataInicio: toDateInputValue(cargo.dataInicio),
      referencia: cargo.referencia || '',
    })),
    telefones: docente.telefones.map(telefone => ({
      id: telefone.id,
      telefone: telefone.telefone,
      tipo: telefone.tipo as 'celular' | 'comercial' | 'residencial',
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
  }

  return (
    <DocentePageShell badge="Registro docente" title={docente.nome}>
      <UpdateDocenteForm
        id={docente.id}
        initialValues={docenteFormValues}
        relatedInitialData={relatedInitialData}
        initialSuccessMessage={successMessage}
      />

      <Box mt="16px" p="18px" border="1px solid #fecdd3" bg="#fff1f2" borderRadius="18px">
        <form action={deleteDocenteAction.bind(null, docente.id)}>
          <ConfirmSubmitButton
            idleText="Excluir docente"
            pendingText="Excluindo..."
            confirmMessage={`Excluir ${docente.nome}? Esta ação remove permanentemente o cadastro e os vínculos relacionados.`}
            style={{
              padding: '11px 18px',
              color: '#be123c',
              borderRadius: '999px',
              border: '1px solid #fda4af',
              background: '#ffffff',
              cursor: 'pointer',
            }}
          />
        </form>
        <Text mt="0" color="#881337">
          A exclusão é definitiva e remove o docente e os vínculos relacionados do cadastro.
        </Text>
      </Box>

      <Box mt="36px" pt="20px" borderTop="1px solid #dbeafe">
        <Heading size="md" mb="8px">
          Dados relacionados
        </Heading>
        <Text m="0" color="#475569">
          Cargos, telefones, documentos e contas bancárias agora podem ser editados diretamente no formulário
          acima.
        </Text>
      </Box>
    </DocentePageShell>
  )
}
