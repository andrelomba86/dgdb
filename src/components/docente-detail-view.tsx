'use client'

import { useEffect } from 'react'

import { Box, Checkmark, Em, Fieldset, Grid, Stack, Table, Text } from '@chakra-ui/react'

import { deleteDocenteAction } from '@/actions/docente-actions'
import { DocenteFormActionBar } from '@/components/docente-form-action-bar'
import type { DocenteDetailViewProps, InfoItemProps } from '@/types/docente'
import { toaster } from './toaster-notifier'

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <Box>
      <Text mb="4px" fontSize="sm" fontWeight="600" color="gray.600">
        {label}
      </Text>
      <Text color="gray.900" wordBreak="break-word">
        {value}
      </Text>
    </Box>
  )
}

function formatDate(value: Date | null) {
  return value ? new Date(value).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : <Em>Não informado</Em>
}

function formatText(value: string | null | undefined) {
  const normalized = value?.trim()
  return normalized ? normalized : <Em>Não informado</Em>
}

export function DocenteDetailView({ docente, successMessage }: DocenteDetailViewProps) {
  useEffect(() => {
    if (successMessage) {
      toaster.create({ type: 'success', description: successMessage })
    }
  }, [successMessage])
  return (
    <Stack gap="18px" pb="128px">
      <Box>
        <Checkmark mr="6px" size="sm" checked={docente.ativo ? true : false} /> Ativo
      </Box>
      <Fieldset.Root borderWidth="1px" borderColor="#dbeafe" borderRadius="18px" p="20px" pt="0">
        <Fieldset.Legend px="8px" fontWeight={700}>
          Dados pessoais
        </Fieldset.Legend>
        <Fieldset.Content>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="14px">
            <InfoItem label="Nome" value={formatText(docente.nome)} />
            <InfoItem label="Data de nascimento" value={formatDate(docente.dataNascimento)} />
            <Box gridColumn={{ base: '1', md: '1 / -1' }}>
              <InfoItem label="Endereço" value={formatText(docente.endereco)} />
            </Box>
          </Grid>
        </Fieldset.Content>
      </Fieldset.Root>
      <Fieldset.Root borderWidth="1px" borderColor="#dbeafe" borderRadius="18px" p="20px" pt="0">
        <Fieldset.Legend px="8px" fontWeight={700}>
          Dados funcionais
        </Fieldset.Legend>
        <Fieldset.Content>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' }} gap="14px">
            <InfoItem label="Matrícula" value={formatText(docente.matricula)} />
            <InfoItem label="Data de admissão" value={formatDate(docente.dataAdmissao)} />
            <InfoItem label="E-mail" value={formatText(docente.email)} />
            <InfoItem label="Regime jurídico" value={formatText(docente.regimeJuridico)} />
            <InfoItem label="Regime de trabalho" value={formatText(docente.regimeTrabalho)} />
            <InfoItem label="Data de aplicação do regime" value={formatDate(docente.regimeDataAplicacao)} />
          </Grid>
        </Fieldset.Content>
      </Fieldset.Root>
      <Fieldset.Root borderWidth="1px" borderColor="blue.100" borderRadius="18px" p="20px" pt="0">
        <Fieldset.Legend px="8px" fontWeight={700}>
          Progressão na carreira
        </Fieldset.Legend>
        <Fieldset.Content>
          {docente.progressoes.length === 0 ? (
            <Text color="gray.600">
              <Em>Nenhuma progressão na carreira cadastrada.</Em>
            </Text>
          ) : (
            <Box overflowX="auto" border="1px solid #e2e8f0" borderRadius="16px">
              <Table.Root minW="720px" variant="outline">
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader>Função</Table.ColumnHeader>
                    <Table.ColumnHeader>Data de início</Table.ColumnHeader>
                    <Table.ColumnHeader>Data de término</Table.ColumnHeader>
                    <Table.ColumnHeader>Referência</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {docente.progressoes.map(progressao => (
                    <Table.Row key={progressao.id}>
                      <Table.Cell>{formatText(progressao.funcao)}</Table.Cell>
                      <Table.Cell>{formatDate(progressao.dataInicio)}</Table.Cell>
                      <Table.Cell>{formatDate(progressao.dataTermino)}</Table.Cell>
                      <Table.Cell>{formatText(progressao.referencia)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </Fieldset.Content>
      </Fieldset.Root>
      <Fieldset.Root borderWidth="1px" borderColor="blue.100" borderRadius="18px" p="20px" pt="0">
        <Fieldset.Legend px="8px" fontWeight={700}>
          Telefones
        </Fieldset.Legend>
        <Fieldset.Content>
          {docente.telefones.length === 0 ? (
            <Text color="gray.600">
              <Em>Nenhum telefone cadastrado.</Em>
            </Text>
          ) : (
            <Box overflowX="auto" border="1px solid #e2e8f0" borderRadius="16px">
              <Table.Root minW="420px" variant="outline">
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader>Telefone</Table.ColumnHeader>
                    <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {docente.telefones.map(telefone => (
                    <Table.Row key={telefone.id}>
                      <Table.Cell>{formatText(telefone.telefone)}</Table.Cell>
                      <Table.Cell>{formatText(telefone.tipo)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </Fieldset.Content>
      </Fieldset.Root>
      <Fieldset.Root borderWidth="1px" borderColor="#dbeafe" borderRadius="18px" p="20px" pt="0">
        <Fieldset.Legend px="8px" fontWeight={700}>
          Documentos
        </Fieldset.Legend>
        <Fieldset.Content>
          {docente.documentos.length === 0 ? (
            <Text color="gray.600">
              <Em>Nenhum documento cadastrado.</Em>
            </Text>
          ) : (
            <Box overflowX="auto" border="1px solid #e2e8f0" borderRadius="16px">
              <Table.Root minW="420px" variant="outline">
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                    <Table.ColumnHeader>Número</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {docente.documentos.map(documento => (
                    <Table.Row key={documento.id}>
                      <Table.Cell>{formatText(documento.tipo)}</Table.Cell>
                      <Table.Cell>{formatText(documento.documento)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </Fieldset.Content>
      </Fieldset.Root>
      <Fieldset.Root borderWidth="1px" borderColor="#dbeafe" borderRadius="18px" p="20px" pt="0">
        <Fieldset.Legend px="8px" fontWeight={700}>
          Contas bancárias
        </Fieldset.Legend>
        <Fieldset.Content>
          {docente.contasBancarias.length === 0 ? (
            <Text color="gray.600">
              <Em>Nenhuma conta bancária cadastrada.</Em>
            </Text>
          ) : (
            <Box overflowX="auto" border="1px solid #e2e8f0" borderRadius="16px">
              <Table.Root minW="520px" variant="outline">
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader>Banco</Table.ColumnHeader>
                    <Table.ColumnHeader>Agência</Table.ColumnHeader>
                    <Table.ColumnHeader>Conta</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {docente.contasBancarias.map(conta => (
                    <Table.Row key={conta.id}>
                      <Table.Cell>{formatText(conta.banco)}</Table.Cell>
                      <Table.Cell>{formatText(conta.agencia)}</Table.Cell>
                      <Table.Cell>{formatText(conta.conta)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </Fieldset.Content>
      </Fieldset.Root>
      <DocenteFormActionBar
        title="Ações do registro"
        submitIdleText="Editar cadastro"
        submitPendingText="Abrindo edição..."
        submitHref={`/docentes/${docente.id}/editar`}
        cancelHref="/docentes"
        deleteFormAction={deleteDocenteAction.bind(null, docente.id)}
        deleteConfirmMessage={`Excluir ${docente.nome}? Esta ação remove permanentemente o cadastro e os vínculos relacionados.`}
      />
    </Stack>
  )
}
