import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import NextLink from 'next/link'

import {
  Box,
  Button,
  Checkbox,
  Container,
  IconButton,
  Field,
  Flex,
  Heading,
  HStack,
  Input,
  Link,
  NativeSelect,
  Table,
  Text,
  Em,
  CheckboxCard,
} from '@chakra-ui/react'

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
  const ativo = getFirstParam(resolvedParams.ativo)
  const ativoFilter = ativo === 'on' ? true : false
  const sortBy = getFirstParam(resolvedParams.sortBy)
  const sortOrder = getFirstParam(resolvedParams.sortOrder)

  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage

  //TODO: converter ativo que está em string para booleano?

  const result = await listDocentesAction({
    page,
    pageSize: 5,
    nome,
    ativo: ativoFilter,
    sortBy: sortBy === 'dataAdmissao' ? sortBy : 'nome',
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
    ativo,
    sortBy: (sortBy === 'dataAdmissao' ? sortBy : 'nome') as DocenteSortField,
    sortOrder: (sortOrder === 'desc' ? 'desc' : 'asc') as SortDirection,
  }

  return (
    <Box
      as="main"
      minH="100vh"
      py={{ base: '24px', md: '32px' }}
      px={{ base: '12px', md: '24px' }}
      bg="radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 28%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)">
      <Container maxW="6xl">
        <Box
          bg="white"
          border="1px solid #dbe3f0"
          borderRadius="20px"
          boxShadow="0 18px 50px rgba(15, 23, 42, 0.08)"
          p={{ base: '16px', md: '28px' }}>
          <Flex justify="space-between" gap="16px" align="flex-start" wrap="wrap" mb="24px">
            <Box>
              <Text m="0" color="blue" fontSize="1rem" fontWeight="700">
                Painel de docentes
              </Text>
            </Box>

            <HStack gap="10px" align="center" wrap="wrap">
              <NextLink href="/" passHref>
                <Button colorPalette="gray" rounded="full" variant="outline">
                  Home
                </Button>
              </NextLink>
              <NextLink href="/docentes/novo" passHref>
                <Button
                  rounded="full"
                  // colorPalette="cyan"
                  // color="#fff"
                  border="none"
                  bg="linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)">
                  Novo docente
                </Button>
              </NextLink>
              <form action={logoutAction}>
                <PendingSubmitButton
                  idleText="Encerrar sessão"
                  pendingText="Encerrando..."
                  colorPalette="red"
                  variant="surface"
                  rounded="full"
                />
              </form>
            </HStack>
          </Flex>

          <Box bg="white" border="1px solid #dbe3f0" borderRadius="18px" p="15px" mb="22px">
            <Heading size="md" mt="0">
              Filtros
            </Heading>
            <form
              method="get"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '25px',
              }}>
              <Field.Root>
                <Field.Label fontWeight="600">Nome</Field.Label>
                <Input id="nome" name="nome" type="text" defaultValue={nome} />
              </Field.Root>

              <Field.Root>
                <Field.Label fontWeight="600">Ordenar por</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field id="sortBy" name="sortBy" defaultValue={baseParams.sortBy}>
                    <option value="nome">Nome</option>
                    <option value="dataAdmissao">Data de admissão</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label fontWeight="600">Direção</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field id="sortOrder" name="sortOrder" defaultValue={baseParams.sortOrder}>
                    <option value="asc">Crescente</option>
                    <option value="desc">Decrescente</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label fontWeight="600">Situação</Field.Label>
                <CheckboxCard.Root id="ativo" name="ativo" size="sm" defaultChecked={ativo === 'on'}>
                  <CheckboxCard.HiddenInput />
                  <CheckboxCard.Content>
                    <CheckboxCard.Control>
                      <CheckboxCard.Label>Somente ativos</CheckboxCard.Label>

                      <CheckboxCard.Indicator />
                    </CheckboxCard.Control>
                  </CheckboxCard.Content>
                </CheckboxCard.Root>
              </Field.Root>

              <HStack gap="10px" align="flex-end" wrap="wrap">
                <Button type="submit" colorPalette="teal" borderRadius="999px">
                  Buscar
                </Button>
                <NextLink href="/docentes" passHref>
                  <Button rounded="full" variant="outline">
                    Limpar
                  </Button>
                </NextLink>
              </HStack>
            </form>
          </Box>
          <Box>
            {/* <Heading size="md" mb="14px">
              Listagem ({total} total)
            </Heading> */}
            {totalPages > 1 ? (
              <HStack mb="10px" gap="12px" align="center">
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

            {items.length === 0 ? (
              <Box bg="white" border="1px solid #dbe3f0" borderRadius="18px" p="22px">
                Nenhum docente encontrado para os filtros informados.
              </Box>
            ) : (
              <Box overflowX="auto" border="1px solid #dbe3f0" borderRadius="18px">
                <Table.Root minW="920px" variant="outline">
                  <Table.Header bg="gray.50">
                    <Table.Row>
                      <Table.ColumnHeader>Nome</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="center">Regime de trabalho</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="center">Data de admissão</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="center">Situação</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="center">Ações</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {items.map((doc: DocenteAggregate) => (
                      <Table.Row key={doc.id} borderBottom="1px solid #e2e8f0">
                        <Table.Cell>
                          <Text fontWeight="700">{doc.nome}</Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text>{doc.regimeTrabalho || <Em>Regime não informado</Em>}</Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {doc.dataAdmissao
                            ? new Date(doc.dataAdmissao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                            : 'Data não informada'}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {doc.ativo ? (
                            <Text as="span" color="black">
                              Ativo
                            </Text>
                          ) : (
                            <Text as="span" color="gray">
                              <Em>Inativo</Em>
                            </Text>
                          )}
                        </Table.Cell>

                        <Table.Cell>
                          <HStack justify="center" gap="-1" wrap="nowrap">
                            <IconButton
                              asChild
                              variant="surface"
                              // color="blue.600"
                              colorPalette="blue"
                              borderLeftRadius="50%"
                              borderRightRadius="0"
                              size="sm"
                              title={`Abrir cadastro de ${doc.nome}`}
                              aria-label={`Abrir cadastro de ${doc.nome}`}>
                              <NextLink href={`/docentes/${doc.id}`}>
                                <EditIcon fontSize="small" />
                              </NextLink>
                            </IconButton>
                            <form action={deleteDocenteAction.bind(null, doc.id)}>
                              <ConfirmSubmitButton
                                idleText="Excluir"
                                pendingText="..."
                                confirmMessage={`Excluir ${doc.nome}? Esta ação remove também os vínculos relacionados.`}
                                iconOnly
                                borderRightRadius="50%"
                                borderLeftRadius="0"
                                borderLeftWidth="0"
                                variant="surface"
                                colorPalette="red"
                                // color="red"
                                // rounded="xs"
                                size="sm"
                                title={`Excluir ${doc.nome}`}
                                aria-label={`Excluir ${doc.nome}`}>
                                <DeleteIcon fontSize="medium" />
                              </ConfirmSubmitButton>
                            </form>
                          </HStack>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}

            <Flex
              bg="white"
              border="1px solid #dbe3f0"
              borderRadius="18px"
              p="18px 22px"
              mt="22px"
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
                  ativo: ativo === 'on' || undefined,
                  sortBy: baseParams.sortBy,
                  sortOrder: baseParams.sortOrder,
                }}
              />
            </Flex>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
