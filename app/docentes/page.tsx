import NextLink from 'next/link'

import { Box, Button, Container, Flex, Grid, Heading, HStack, Input, Link, Text } from '@chakra-ui/react'

import { logoutAction } from '@/actions/auth-actions'
import { deleteDocenteAction, listDocentesAction } from '@/actions/docente-actions'
import { ConfirmSubmitButton } from '@/components/confirm-submit-button'
import { DocenteExportButtons } from '@/components/docente-export-buttons'
import { PendingSubmitButton } from '@/components/pending-submit-button'
import { requireAuthenticatedUser } from '@/lib/auth-guard'
import type { DocenteAggregate, DocenteSortField, SortDirection } from '@/types/docente'

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function buildDocentesHref(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()
  return query ? `/docentes?${query}` : '/docentes'
}

type DocentesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function DocentesPage({ searchParams }: DocentesPageProps) {
  const user = await requireAuthenticatedUser()
  const resolvedParams = await searchParams

  const pageParam = getFirstParam(resolvedParams.page)
  const nome = getFirstParam(resolvedParams.nome)
  const matricula = getFirstParam(resolvedParams.matricula)
  const email = getFirstParam(resolvedParams.email)
  const dataAdmissaoInicio = getFirstParam(resolvedParams.dataAdmissaoInicio)
  const dataAdmissaoFim = getFirstParam(resolvedParams.dataAdmissaoFim)
  const sortBy = getFirstParam(resolvedParams.sortBy)
  const sortOrder = getFirstParam(resolvedParams.sortOrder)

  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage

  const result = await listDocentesAction({
    page,
    pageSize: 10,
    nome,
    matricula,
    email,
    dataAdmissaoInicio: dataAdmissaoInicio ? new Date(`${dataAdmissaoInicio}T00:00:00`) : undefined,
    dataAdmissaoFim: dataAdmissaoFim ? new Date(`${dataAdmissaoFim}T23:59:59`) : undefined,
    sortBy: sortBy === 'matricula' || sortBy === 'email' || sortBy === 'dataAdmissao' ? sortBy : 'nome',
    sortOrder: sortOrder === 'desc' ? 'desc' : 'asc',
  })

  if (!result.success) {
    return (
      <Box as="main" minH="100vh" py="32px" px="24px" bg="linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)">
        <Text>Erro ao carregar docentes: {result.error}</Text>
      </Box>
    )
  }

  const { items, total, pageSize } = result.data || { items: [], total: 0, pageSize: 10 }
  const totalPages = Math.ceil(total / pageSize)

  const errorMessage = getFirstParam(resolvedParams.erro)
  const successMessage = getFirstParam(resolvedParams.sucesso)

  const baseParams = {
    nome,
    matricula,
    email,
    dataAdmissaoInicio,
    dataAdmissaoFim,
    sortBy: (sortBy === 'matricula' || sortBy === 'email' || sortBy === 'dataAdmissao'
      ? sortBy
      : 'nome') as DocenteSortField,
    sortOrder: (sortOrder === 'desc' ? 'desc' : 'asc') as SortDirection,
  }

  return (
    <Box
      as="main"
      minH="100vh"
      py={{ base: '24px', md: '32px' }}
      px={{ base: '12px', md: '24px' }}
      bg="radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 28%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)">
      <Container maxW="7xl">
        <Box
          bg="white"
          border="1px solid #dbe3f0"
          borderRadius="20px"
          boxShadow="0 18px 50px rgba(15, 23, 42, 0.08)"
          p={{ base: '16px', md: '28px' }}>
          <Flex justify="space-between" gap="16px" align="flex-start" wrap="wrap" mb="24px">
            <Box>
              <Text m="0" color="#1d4ed8" fontSize="0.9rem" fontWeight="700">
                Painel de docentes
              </Text>
              <Heading m="8px 0 6px" size="2xl" lineHeight="1.1">
                Cadastro consolidado
              </Heading>
              <Text m="0" color="#475569" maxW="680px">
                Filtre, ordene e acesse os registros de docentes. Usuário autenticado: {user.nome}.
              </Text>
            </Box>

            <HStack gap="10px" align="center" wrap="wrap">
              <Link
                as={NextLink}
                href="/"
                px="14px"
                py="10px"
                borderRadius="999px"
                color="#0f172a"
                textDecoration="none"
                border="1px solid #cbd5e1">
                Home
              </Link>
              <Link
                as={NextLink}
                href="/docentes/novo"
                px="16px"
                py="10px"
                borderRadius="999px"
                color="#fff"
                textDecoration="none"
                bg="linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)"
                boxShadow="0 10px 25px rgba(20, 184, 166, 0.28)">
                Novo docente
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

          <Grid templateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap="14px" mb="20px">
            <Box bg="white" border="1px solid #dbe3f0" borderRadius="16px" p="18px">
              <Text color="#64748b" fontSize="0.88rem">
                Total de registros
              </Text>
              <Text fontSize="2rem" fontWeight="700" mt="8px">
                {total}
              </Text>
            </Box>
            <Box bg="white" border="1px solid #dbe3f0" borderRadius="16px" p="18px">
              <Text color="#64748b" fontSize="0.88rem">
                Página atual
              </Text>
              <Text fontSize="2rem" fontWeight="700" mt="8px">
                {page}
              </Text>
            </Box>
            <Box bg="white" border="1px solid #dbe3f0" borderRadius="16px" p="18px">
              <Text color="#64748b" fontSize="0.88rem">
                Ordenação
              </Text>
              <Text fontSize="1.2rem" fontWeight="700" mt="8px" textTransform="capitalize">
                {(baseParams.sortBy || 'nome').replace('dataAdmissao', 'admissão')} {baseParams.sortOrder}
              </Text>
            </Box>
          </Grid>

          <Flex
            bg="white"
            border="1px solid #dbe3f0"
            borderRadius="18px"
            p="18px 22px"
            mb="22px"
            justify="space-between"
            gap="14px"
            align="center"
            wrap="wrap">
            <Box>
              <Heading size="md" m="0 0 4px">
                Exportação
              </Heading>
              <Text m="0" color="#64748b">
                Gere arquivos CSV e PDF com base nos filtros e na ordenação atuais.
              </Text>
            </Box>

            <DocenteExportButtons
              filters={{
                nome,
                matricula,
                email,
                dataAdmissaoInicio,
                dataAdmissaoFim,
                sortBy: baseParams.sortBy,
                sortOrder: baseParams.sortOrder,
              }}
            />
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

          <Box bg="white" border="1px solid #dbe3f0" borderRadius="18px" p="22px" mb="22px">
            <Heading size="md" mt="0">
              Filtros
            </Heading>
            <form
              method="get"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '14px',
              }}>
              <Box>
                <label htmlFor="nome" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Nome
                </label>
                <Input id="nome" name="nome" type="text" defaultValue={nome} p="10px 12px" />
              </Box>

              <Box>
                <label htmlFor="matricula" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Matrícula
                </label>
                <Input id="matricula" name="matricula" type="text" defaultValue={matricula} p="10px 12px" />
              </Box>

              <Box>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  E-mail
                </label>
                <Input id="email" name="email" type="email" defaultValue={email} p="10px 12px" />
              </Box>

              <Box>
                <label
                  htmlFor="dataAdmissaoInicio"
                  style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Admissão inicial
                </label>
                <Input
                  id="dataAdmissaoInicio"
                  name="dataAdmissaoInicio"
                  type="date"
                  defaultValue={dataAdmissaoInicio}
                  p="10px 12px"
                />
              </Box>

              <Box>
                <label
                  htmlFor="dataAdmissaoFim"
                  style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Admissão final
                </label>
                <Input
                  id="dataAdmissaoFim"
                  name="dataAdmissaoFim"
                  type="date"
                  defaultValue={dataAdmissaoFim}
                  p="10px 12px"
                />
              </Box>

              <Box>
                <label htmlFor="sortBy" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Ordenar por
                </label>
                <select
                  id="sortBy"
                  name="sortBy"
                  defaultValue={baseParams.sortBy}
                  style={{ width: '100%', padding: '10px 12px' }}>
                  <option value="nome">Nome</option>
                  <option value="matricula">Matrícula</option>
                  <option value="email">E-mail</option>
                  <option value="dataAdmissao">Data de admissão</option>
                </select>
              </Box>

              <Box>
                <label htmlFor="sortOrder" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Direção
                </label>
                <select
                  id="sortOrder"
                  name="sortOrder"
                  defaultValue={baseParams.sortOrder}
                  style={{ width: '100%', padding: '10px 12px' }}>
                  <option value="asc">Crescente</option>
                  <option value="desc">Decrescente</option>
                </select>
              </Box>

              <HStack gap="10px" align="flex-end" wrap="wrap">
                <Button type="submit" p="10px 16px" bg="#1d4ed8" color="#fff" borderRadius="999px">
                  Buscar
                </Button>
                <Link
                  as={NextLink}
                  href="/docentes"
                  px="16px"
                  py="10px"
                  borderRadius="999px"
                  color="#334155"
                  textDecoration="none"
                  border="1px solid #cbd5e1">
                  Limpar
                </Link>
              </HStack>
            </form>
          </Box>

          <Box>
            <Heading size="md" mb="14px">
              Listagem ({total} total)
            </Heading>

            {items.length === 0 ? (
              <Box bg="white" border="1px solid #dbe3f0" borderRadius="18px" p="22px">
                Nenhum docente encontrado para os filtros informados.
              </Box>
            ) : (
              <Box overflowX="auto" border="1px solid #dbe3f0" borderRadius="18px">
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '920px',
                    background: '#fff',
                  }}>
                  <thead>
                    <tr style={{ backgroundColor: '#eff6ff' }}>
                      <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid #dbe3f0' }}>
                        Nome
                      </th>
                      <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid #dbe3f0' }}>
                        Matrícula
                      </th>
                      <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid #dbe3f0' }}>
                        E-mail
                      </th>
                      <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid #dbe3f0' }}>
                        Admissão
                      </th>
                      <th style={{ padding: '14px', textAlign: 'center', borderBottom: '1px solid #dbe3f0' }}>
                        Cargos
                      </th>
                      <th style={{ padding: '14px', textAlign: 'center', borderBottom: '1px solid #dbe3f0' }}>
                        Telefones
                      </th>
                      <th style={{ padding: '14px', textAlign: 'center', borderBottom: '1px solid #dbe3f0' }}>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((doc: DocenteAggregate) => (
                      <tr key={doc.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '14px' }}>
                          <Text fontWeight="700">{doc.nome}</Text>
                          <Text color="#64748b" fontSize="0.9rem">
                            {doc.regimeTrabalho || 'Regime não informado'}
                          </Text>
                        </td>
                        <td style={{ padding: '14px' }}>{doc.matricula}</td>
                        <td style={{ padding: '14px' }}>{doc.email}</td>
                        <td style={{ padding: '14px' }}>
                          {new Date(doc.dataAdmissao).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center' }}>{doc.cargos.length}</td>
                        <td style={{ padding: '14px', textAlign: 'center' }}>{doc.telefones.length}</td>
                        <td style={{ padding: '14px' }}>
                          <HStack justify="center" gap="10px" wrap="wrap">
                            <Link
                              as={NextLink}
                              href={`/docentes/${doc.id}`}
                              color="#1d4ed8"
                              textDecoration="none"
                              fontWeight="600">
                              Abrir
                            </Link>
                            <form action={deleteDocenteAction.bind(null, doc.id)}>
                              <ConfirmSubmitButton
                                idleText="Excluir"
                                pendingText="Excluindo..."
                                confirmMessage={`Excluir ${doc.nome}? Esta ação remove também os vínculos relacionados.`}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#be123c',
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                }}
                              />
                            </form>
                          </HStack>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}

            {totalPages > 1 ? (
              <HStack mt="20px" gap="12px" align="center">
                {page > 1 ? (
                  <Link as={NextLink} href={buildDocentesHref({ ...baseParams, page: String(page - 1) })}>
                    ← Anterior
                  </Link>
                ) : (
                  <Text color="#94a3b8">← Anterior</Text>
                )}

                <Text>
                  Página {page} de {totalPages}
                </Text>

                {page < totalPages ? (
                  <Link as={NextLink} href={buildDocentesHref({ ...baseParams, page: String(page + 1) })}>
                    Próxima →
                  </Link>
                ) : (
                  <Text color="#94a3b8">Próxima →</Text>
                )}
              </HStack>
            ) : null}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
