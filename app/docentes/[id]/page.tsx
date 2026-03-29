import NextLink from 'next/link'
import { redirect } from 'next/navigation'

import { Box, Container, Flex, Grid, Heading, HStack, Input, Link, Text } from '@chakra-ui/react'

import { logoutAction } from '@/actions/auth-actions'
import { deleteDocenteAction, getDocenteAction, updateDocenteAction } from '@/actions/docente-actions'
import { ConfirmSubmitButton } from '@/components/confirm-submit-button'
import { DocenteRelatedFields, type RelatedEntitiesInitialData } from '@/components/docente-related-fields'
import { PendingSubmitButton } from '@/components/pending-submit-button'
import { requireAuthenticatedUser } from '@/lib/auth-guard'

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

type DocenteDetailPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function DocenteDetailPage({ params, searchParams }: DocenteDetailPageProps) {
  const user = await requireAuthenticatedUser()
  const { id } = await params
  const resolvedParams = await searchParams

  const docId = parseInt(id, 10)
  if (isNaN(docId)) {
    redirect('/docentes')
  }

  const result = await getDocenteAction(docId)

  if (!result.success || !result.data) {
    return (
      <Box as="main" minH="100vh" p="24px" bg="linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)">
        <Text>Erro: {result.error}</Text>
      </Box>
    )
  }

  const docente = result.data
  const errorMessage = getFirstParam(resolvedParams.erro)
  const successMessage = getFirstParam(resolvedParams.sucesso)
  const relatedInitialData: RelatedEntitiesInitialData = {
    cargos: docente.cargos.map(cargo => ({
      id: cargo.id,
      descricao: cargo.descricao,
      funcao: cargo.funcao || '',
      dataInicio: new Date(cargo.dataInicio).toISOString().split('T')[0],
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
    <Box
      as="main"
      minH="100vh"
      py={{ base: '24px', md: '32px' }}
      px={{ base: '12px', md: '24px' }}
      bg="radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 28%), linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)">
      <Container maxW="6xl">
        <Box
          bg="white"
          border="1px solid #dbeafe"
          borderRadius="20px"
          boxShadow="0 18px 50px rgba(15, 23, 42, 0.08)"
          p={{ base: '16px', md: '28px' }}>
          <Flex justify="space-between" align="flex-start" gap="16px" wrap="wrap" mb="24px">
            <Box>
              <Text m="0" color="#1d4ed8" fontSize="0.9rem" fontWeight="700">
                Registro docente
              </Text>
              <Heading m="8px 0 6px" size="2xl">
                {docente.nome}
              </Heading>
              <Text m="0" color="#475569">
                Matrícula {docente.matricula} · sessão atual {user.nome}
              </Text>
            </Box>

            <HStack gap="10px" wrap="wrap">
              <Link
                as={NextLink}
                href="/docentes"
                px="14px"
                py="10px"
                borderRadius="999px"
                textDecoration="none"
                color="#0f172a"
                border="1px solid #cbd5e1">
                Voltar
              </Link>
              <form action={logoutAction}>
                <PendingSubmitButton
                  idleText="Sair"
                  pendingText="Saindo..."
                  style={{
                    padding: '10px 14px',
                    borderRadius: '999px',
                    border: '1px solid #fecaca',
                    background: '#fff1f2',
                    color: '#be123c',
                    cursor: 'pointer',
                  }}
                />
              </form>
            </HStack>
          </Flex>

          {successMessage ? (
            <Box
              p="14px 16px"
              mb="14px"
              bg="#ecfdf5"
              color="#065f46"
              border="1px solid #a7f3d0"
              borderRadius="14px">
              {successMessage}
            </Box>
          ) : null}

          {errorMessage ? (
            <Box
              p="14px 16px"
              mb="14px"
              bg="#fff1f2"
              color="#9f1239"
              border="1px solid #fecdd3"
              borderRadius="14px">
              {errorMessage}
            </Box>
          ) : null}

          <Grid templateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap="14px" mb="20px">
            <Box border="1px solid #dbeafe" borderRadius="16px" p="18px">
              <Text color="#64748b" fontSize="0.88rem">
                E-mail
              </Text>
              <Text fontWeight="700" mt="8px">
                {docente.email}
              </Text>
            </Box>
            <Box border="1px solid #dbeafe" borderRadius="16px" p="18px">
              <Text color="#64748b" fontSize="0.88rem">
                Admissão
              </Text>
              <Text fontWeight="700" mt="8px">
                {new Date(docente.dataAdmissao).toLocaleDateString('pt-BR')}
              </Text>
            </Box>
            <Box border="1px solid #dbeafe" borderRadius="16px" p="18px">
              <Text color="#64748b" fontSize="0.88rem">
                Relações
              </Text>
              <Text fontWeight="700" mt="8px">
                {docente.cargos.length} cargos · {docente.telefones.length} telefones
              </Text>
            </Box>
          </Grid>

          <form action={updateDocenteAction} method="post" style={{ display: 'grid', gap: '18px' }}>
            <input type="hidden" name="id" value={docente.id} />

            <fieldset style={{ border: '1px solid #dbeafe', borderRadius: '18px', padding: '20px' }}>
              <legend style={{ padding: '0 8px', fontWeight: 700 }}>Dados pessoais</legend>

              <Grid gap="14px">
                <Box>
                  <label htmlFor="nome">
                    Nome <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    maxLength={100}
                    defaultValue={docente.nome}
                    required
                    p="10px 12px"
                  />
                </Box>

                <Box>
                  <label htmlFor="dataNascimento">Data de Nascimento</label>
                  <Input
                    id="dataNascimento"
                    name="dataNascimento"
                    type="date"
                    defaultValue={
                      docente.dataNascimento
                        ? new Date(docente.dataNascimento).toISOString().split('T')[0]
                        : ''
                    }
                    p="10px 12px"
                  />
                </Box>

                <Box>
                  <label htmlFor="endereco">Endereço</label>
                  <Input
                    id="endereco"
                    name="endereco"
                    type="text"
                    maxLength={200}
                    defaultValue={docente.endereco || ''}
                    p="10px 12px"
                  />
                </Box>
              </Grid>
            </fieldset>

            <fieldset style={{ border: '1px solid #dbeafe', borderRadius: '18px', padding: '20px' }}>
              <legend style={{ padding: '0 8px', fontWeight: 700 }}>Dados profissionais</legend>

              <Grid gap="14px">
                <Box>
                  <label htmlFor="matricula">
                    Matrícula <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Input
                    id="matricula"
                    name="matricula"
                    type="text"
                    maxLength={10}
                    defaultValue={docente.matricula}
                    required
                    p="10px 12px"
                  />
                </Box>

                <Box>
                  <label htmlFor="email">
                    E-mail <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    maxLength={80}
                    defaultValue={docente.email}
                    required
                    p="10px 12px"
                  />
                </Box>

                <Box>
                  <label htmlFor="dataAdmissao">
                    Data de Admissão <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Input
                    id="dataAdmissao"
                    name="dataAdmissao"
                    type="date"
                    defaultValue={new Date(docente.dataAdmissao).toISOString().split('T')[0]}
                    required
                    p="10px 12px"
                  />
                </Box>

                <Box>
                  <label htmlFor="regimeJuridico">Regime Jurídico</label>
                  <Input
                    id="regimeJuridico"
                    name="regimeJuridico"
                    type="text"
                    maxLength={15}
                    defaultValue={docente.regimeJuridico || ''}
                    p="10px 12px"
                  />
                </Box>

                <Box>
                  <label htmlFor="regimeTrabalho">Regime de Trabalho</label>
                  <Input
                    id="regimeTrabalho"
                    name="regimeTrabalho"
                    type="text"
                    maxLength={15}
                    defaultValue={docente.regimeTrabalho || ''}
                    p="10px 12px"
                  />
                </Box>

                <Box>
                  <label htmlFor="regimeDataAplicacao">Data Aplicação Regime</label>
                  <Input
                    id="regimeDataAplicacao"
                    name="regimeDataAplicacao"
                    type="date"
                    defaultValue={
                      docente.regimeDataAplicacao
                        ? new Date(docente.regimeDataAplicacao).toISOString().split('T')[0]
                        : ''
                    }
                    p="10px 12px"
                  />
                </Box>
              </Grid>
            </fieldset>

            <DocenteRelatedFields initialData={relatedInitialData} />

            <HStack gap="10px" wrap="wrap">
              <PendingSubmitButton
                idleText="Atualizar docente"
                pendingText="Atualizando..."
                style={{
                  padding: '11px 18px',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #38bdf8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  boxShadow: '0 12px 30px rgba(56, 189, 248, 0.2)',
                }}
              />
              <Link
                as={NextLink}
                href="/docentes"
                px="18px"
                py="11px"
                color="#334155"
                textDecoration="none"
                borderRadius="999px"
                border="1px solid #cbd5e1"
                display="inline-flex"
                alignItems="center">
                Cancelar
              </Link>
            </HStack>
          </form>

          <Box mt="16px" p="18px" border="1px solid #fecdd3" bg="#fff1f2" borderRadius="18px">
            <Heading mt="0" size="sm" color="#9f1239">
              Exclusão
            </Heading>
            <Text mt="0" color="#881337">
              A exclusão é definitiva e remove o docente e os vínculos relacionados do cadastro.
            </Text>
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
          </Box>

          <Box mt="36px" pt="20px" borderTop="1px solid #dbeafe">
            <Heading size="md" mb="8px">
              Dados relacionados
            </Heading>
            <Text m="0" color="#475569">
              Cargos, telefones, documentos e contas bancárias agora podem ser editados diretamente no
              formulário acima.
            </Text>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
