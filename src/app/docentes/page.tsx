'use client'

import {
  Box,
  Button,
  Container,
  Field,
  Input,
  Stack,
  Select,
  Grid,
  Heading,
  Card,
  CardBody,
  useDisclosure,
  Spinner,
  InputGroup,
  createListCollection,
  NativeSelect,
  Bleed,
  Flex,
  Text,
  HStack,
  Table,
  Accordion,
  Span,
} from '@chakra-ui/react'
import { CollectionOptions, ListCollection, CollectionItem } from '@zag-js/collection'

import { Tabs } from '@/app/components/Tabs'
import { useState, useEffect, useRef } from 'react'
import { DadosDocente, Docente } from '@/types/docente'
import { User, Mail, MapPin, Calendar, Briefcase, Info } from 'lucide-react'
import { label } from 'framer-motion/client'
import { InfoField } from '@/app/components/InfoField'
import { DocenteService } from './functions'
import { DataTable } from '@/app/components/DataTable'

export default function DocentesPage() {
  const [idDocenteSelecionado, setIdDocenteSelecionado] = useState<number>(0)
  const [dadosDocente, setDadosDocente] = useState<DadosDocente>({ id: -1, nome: '' })
  const [listaDeDocentes, setListaDeDocentes] = useState<ListCollection<any>>(
    createListCollection<any>({ items: [] })
  )

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const carregaDados = async () => {
      const docentes: Docente[] = await DocenteService.carregaDocente()
      const items: CollectionOptions = {
        items: docentes.map((docente: Docente) => ({
          label: docente.nome,
          value: docente.id,
        })),
      }
      const lista = createListCollection(items)
      setListaDeDocentes(lista)
    }
    console.log('itens carregados')

    carregaDados()
  }, [])

  useEffect(() => {
    if (idDocenteSelecionado === -1) return
    const carregaDados = async () => {
      setIsLoading(true)
      const dadosDocente = await DocenteService.carregaDadosDocente(idDocenteSelecionado)
      if (!dadosDocente) return
      setDadosDocente(dadosDocente)
      setIsLoading(false)
    }

    carregaDados()
  }, [idDocenteSelecionado])

  return (
    <Container layerStyle="container">
      <Stack layerStyle="vstack" backgroundColor="white">
        <Heading size="md" layerStyle="heading" display="flex" alignItems="center" gap={3}>
          <User size={24} />
          Docentes
        </Heading>
        <Stack px={12} mt={5}>
          <Select.Root
            collection={listaDeDocentes}
            onValueChange={e => {
              const docenteId = parseInt(e.value[0])
              setIdDocenteSelecionado(docenteId)
            }}>
            <Select.Label>Docente:</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Selecione" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.ClearTrigger />
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                <Select.ItemGroup>
                  {listaDeDocentes.items.map((docente: CollectionItem) => (
                    <Select.Item item={docente} key={docente.value}>
                      {docente.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.ItemGroup>
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Stack>
        {/* ------------ VISUALIZAÇÃO DOS DADOS ----------------- */}
        <Card.Root width="100%" borderWidth={0} borderRadius={0} size="sm">
          <Card.Body>
            {isLoading ? (
              <Spinner />
            ) : (
              dadosDocente.id !== -1 && (
                <>
                  <Heading size="md" mb={4}>
                    Dados Gerais
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={1}>
                    <InfoField label="Nome" value={dadosDocente.nome} />
                    <InfoField label="Matrícula" value={dadosDocente.matricula} />
                    <InfoField
                      label="Data de Nascimento"
                      value={dadosDocente.data_nascimento}
                      formatter={date => (date ? new Date(date).toLocaleDateString() : '')}
                    />
                    <InfoField label="Endereço" value={dadosDocente.endereco} />
                  </Grid>
                  <Heading size="md" mt={6} mb={4}>
                    Contatos
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={1}>
                    <InfoField label="Email" value={dadosDocente.email} />
                    {dadosDocente.telefones?.map((telefone, index) => (
                      <InfoField key={telefone.id} label={`${telefone.tipo}`} value={telefone.telefone} />
                    ))}
                  </Grid>
                  <Heading size="md" mt={6} mb={4}>
                    Documentos
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={1}>
                    {dadosDocente.documentos?.length
                      ? dadosDocente.documentos?.map((documento, index) => (
                          <InfoField key={index} label={documento.tipo} value={documento.documento} />
                        ))
                      : '-'}
                  </Grid>

                  <Heading size="md" mt={6} mb={4}>
                    Dados Contratuais
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={1}>
                    <InfoField
                      label="Data de Admissão"
                      value={dadosDocente.data_admissao}
                      formatter={date => (date ? new Date(date).toLocaleDateString() : '')}
                    />
                    <InfoField label="Regime de Trabalho" value={dadosDocente.regime_trabalho} />

                    <InfoField label="Regime Jurídico" value={dadosDocente.regime_juridico} />
                    <InfoField
                      label="Data de Aplicação"
                      value={dadosDocente.regime_data_aplicacao}
                      formatter={date => (date ? new Date(date).toLocaleDateString() : '')}
                    />
                  </Grid>
                  <Heading size="md" mt={6} mb={4}>
                    Cargos
                  </Heading>
                  {dadosDocente.cargos && dadosDocente.cargos.length > 0 && (
                    <>
                      {/* exibe apenas a primeira linha e deixa o restante em componente retraído */}
                      <DataTable data={dadosDocente.cargos} />
                    </>
                  )}

                  <Heading size="md" mt={6} mb={4}>
                    Dados Bancários
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                    <InfoField label="Banco" value={dadosDocente.banco} />
                    <InfoField label="Agência" value={dadosDocente.agencia} />
                    <InfoField label="Conta" value={dadosDocente.conta} />
                  </Grid>
                </>
              )
            )}
          </Card.Body>
        </Card.Root>

        <Button mt={6} colorScheme="blue" width="full" type="submit" disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Editar'}
        </Button>
      </Stack>
    </Container>
  )
}
