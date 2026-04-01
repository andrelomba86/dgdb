import NextLink from 'next/link'

import { Box, Container, Flex, Grid, Heading, HStack, Input, Link, Text } from '@chakra-ui/react'

import { logoutAction } from '@/actions/auth-actions'
import { createDocenteAction } from '@/actions/docente-actions'
import { DocenteRelatedFields } from '@/components/docente-related-fields'
import { PendingSubmitButton } from '@/components/pending-submit-button'
import { requireAuthenticatedUser } from '@/lib/auth-guard'

type NovoDocentePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function NovoDocentePage({ searchParams }: NovoDocentePageProps) {
  const user = await requireAuthenticatedUser()
  const resolvedParams = await searchParams
  const errorMessage = getFirstParam(resolvedParams.erro)

  return (
    <Box
      as="main"
      minH="100vh"
      py={{ base: '24px', md: '32px' }}
      px={{ base: '12px', md: '24px' }}
      bg="radial-gradient(circle at top right, rgba(20, 184, 166, 0.18), transparent 28%), linear-gradient(180deg, #f8fafc 0%, #ecfeff 100%)">
      <Container maxW="5xl">
        <Box
          bg="white"
          border="1px solid #dbeafe"
          borderRadius="20px"
          boxShadow="0 18px 50px rgba(15, 23, 42, 0.08)"
          p={{ base: '16px', md: '28px' }}>
          <Flex justify="space-between" align="flex-start" gap="16px" wrap="wrap" mb="24px">
            <Box>
              <Text m="0" color="#0f766e" fontSize="0.9rem" fontWeight="700">
                Novo cadastro
              </Text>
              <Heading m="8px 0 6px" size="2xl">
                Cadastrar docente
              </Heading>
              <Text m="0" color="#475569">
                Sessão atual: {user.nome}
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

          {errorMessage ? (
            <Box
              p="14px 16px"
              mb="16px"
              bg="#fff1f2"
              color="#9f1239"
              border="1px solid #fecdd3"
              borderRadius="14px">
              {errorMessage}
            </Box>
          ) : null}

          <form action={createDocenteAction} style={{ display: 'grid', gap: '18px' }}>
            <fieldset style={{ border: '1px solid #dbeafe', borderRadius: '18px', padding: '20px' }}>
              <legend style={{ padding: '0 8px', fontWeight: 700 }}>Dados pessoais</legend>

              <Grid gap="14px">
                <Box>
                  <label htmlFor="nome">
                    Nome <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Input id="nome" name="nome" type="text" maxLength={100} required p="10px 12px" />
                </Box>

                <Box>
                  <label htmlFor="dataNascimento">Data de Nascimento</label>
                  <Input id="dataNascimento" name="dataNascimento" type="date" p="10px 12px" />
                </Box>

                <Box>
                  <label htmlFor="endereco">Endereço</label>
                  <Input id="endereco" name="endereco" type="text" maxLength={200} p="10px 12px" />
                </Box>
              </Grid>
            </fieldset>

            <fieldset style={{ border: '1px solid #dbeafe', borderRadius: '18px', padding: '20px' }}>
              <legend style={{ padding: '0 8px', fontWeight: 700 }}>Dados profissionais</legend>

              <Grid gap="14px">
                <Box>
                  <label htmlFor="matricula">Matrícula</label>
                  <Input id="matricula" name="matricula" type="text" maxLength={10} p="10px 12px" />
                </Box>

                <Box>
                  <label htmlFor="email">E-mail</label>
                  <Input id="email" name="email" type="email" maxLength={80} p="10px 12px" />
                </Box>

                <Box>
                  <label htmlFor="dataAdmissao">Data de Admissão</label>
                  <Input id="dataAdmissao" name="dataAdmissao" type="date" p="10px 12px" />
                </Box>

                <Box>
                  <label htmlFor="regimeJuridico">Regime Jurídico</label>
                  <Input id="regimeJuridico" name="regimeJuridico" type="text" maxLength={15} p="10px 12px" />
                </Box>

                <Box>
                  <label htmlFor="regimeTrabalho">Regime de Trabalho</label>
                  <Input id="regimeTrabalho" name="regimeTrabalho" type="text" maxLength={15} p="10px 12px" />
                </Box>

                <Box>
                  <label htmlFor="regimeDataAplicacao">Data Aplicação Regime</label>
                  <Input id="regimeDataAplicacao" name="regimeDataAplicacao" type="date" p="10px 12px" />
                </Box>
              </Grid>
            </fieldset>

            <DocenteRelatedFields />

            <Box>
              <label htmlFor="ativo">
                <input
                  id="ativo"
                  name="ativo"
                  type="checkbox"
                  defaultChecked
                  style={{ marginRight: '8px' }}
                />
                Docente ativo
              </label>
            </Box>

            <HStack gap="10px" wrap="wrap">
              <PendingSubmitButton
                idleText="Criar docente"
                pendingText="Criando..."
                style={{
                  padding: '11px 18px',
                  background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  boxShadow: '0 12px 30px rgba(20, 184, 166, 0.22)',
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
        </Box>
      </Container>
    </Box>
  )
}
