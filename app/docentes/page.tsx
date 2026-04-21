import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
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
  Grid,
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
  await requireAuthenticatedUser()
  const resolvedParams = await searchParams

  const pageParam = getFirstParam(resolvedParams.page)
  const nome = getFirstParam(resolvedParams.nome)
  const ativo = getFirstParam(resolvedParams.ativo)
  const ativoFilter = ativo === 'on' ? true : undefined
  const sortBy = getFirstParam(resolvedParams.sortBy)
  const sortOrder = getFirstParam(resolvedParams.sortOrder)

  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage

  const result = await listDocentesAction({
    page,
    pageSize: 10,
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

  const baseParams = {
    nome,
    ativo,
    sortBy: (sortBy === 'dataAdmissao' ? sortBy : 'nome') as DocenteSortField,
    sortOrder: (sortOrder === 'desc' ? 'desc' : 'asc') as SortDirection,
  }

  return (
    <Box
      as="main"
      bg="radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 28%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)"
      minH="100vh"
      py={{ base: '15px', md: '32px' }}
      px={{ base: '7px', md: '24px' }}>
      <Container maxW="6xl" minW="sm">
        <Box
          bg="white"
          border="1px solid #dbe3f0"
          borderRadius="20px"
          shadow="lg"
          p={{ base: '16px', md: '28px' }}>
          <Flex justify="space-between" gap="16px" align="flex-start" wrap="wrap" mb="24px">
            <Box>
              <Text color="teal" fontSize="1rem" fontWeight="700">
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
                <Button rounded="full" border="none" bg="linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)">
                  Novo cadastro
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
            <form method="get">
              <Grid
                templateColumns={{ base: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }}
                gap="25px"
                alignItems="end">
                <Field.Root gridColumn={{ base: '2 span ', lg: 'auto' }}>
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
                  <Checkbox.Root id="ativo" name="ativo" size="sm" defaultChecked={ativo === 'on'} py="11px">
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label>Somente ativos</Checkbox.Label>
                  </Checkbox.Root>
                </Field.Root>
                <HStack justify="flex-end" gap="12px">
                  <Button type="submit" colorPalette="teal" rounded="full">
                    Buscar
                  </Button>
                  <NextLink href="/docentes" passHref>
                    <Button rounded="full" variant="outline">
                      Limpar
                    </Button>
                  </NextLink>
                </HStack>
              </Grid>
            </form>
          </Box>
          <Box>
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
                <Table.Root variant="outline">
                  <Table.Header bg="gray.50">
                    <Table.Row>
                      <Table.ColumnHeader>Nome</Table.ColumnHeader>
                      <Table.ColumnHeader display="none" lg={{ display: 'table-cell' }} textAlign="center">
                        Regime de trabalho
                      </Table.ColumnHeader>
                      <Table.ColumnHeader display="none" md={{ display: 'table-cell' }} textAlign="center">
                        Data de admissão
                      </Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="center" display="none" md={{ display: 'table-cell' }}>
                        Situação
                      </Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="center">Ações</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {items.map((doc: DocenteAggregate) => (
                      <Table.Row key={doc.id} borderBottom="1px solid #e2e8f0">
                        <Table.Cell>
                          <Text fontWeight="700">{doc.nome}</Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center" display="none" lg={{ display: 'table-cell' }}>
                          <Text>{doc.regimeTrabalho || <Em>Regime não informado</Em>}</Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center" display="none" md={{ display: 'table-cell' }}>
                          {doc.dataAdmissao
                            ? new Date(doc.dataAdmissao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                            : 'Data não informada'}
                        </Table.Cell>
                        <Table.Cell textAlign="center" display="none" md={{ display: 'table-cell' }}>
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
                              colorPalette="white"
                              borderLeftRadius="50%"
                              borderRightRadius="0"
                              size="sm"
                              title={`Visualizar cadastro de ${doc.nome}`}
                              aria-label={`Visualizar cadastro de ${doc.nome}`}>
                              <NextLink href={`/docentes/${doc.id}`}>
                                <VisibilityIcon fontSize="small" />
                              </NextLink>
                            </IconButton>
                            <IconButton
                              asChild
                              variant="surface"
                              colorPalette="white"
                              borderRadius="0"
                              borderLeftWidth="0"
                              size="sm"
                              title={`Editar cadastro de ${doc.nome}`}
                              aria-label={`Editar cadastro de ${doc.nome}`}>
                              <NextLink href={`/docentes/${doc.id}/editar`}>
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
                                colorPalette="white"
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
