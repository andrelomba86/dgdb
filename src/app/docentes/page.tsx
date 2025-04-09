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
} from '@chakra-ui/react'
import { CollectionOptions, ListCollection, CollectionItem } from '@zag-js/collection'

import { Tabs } from '@/app/components/Tabs'
import { useState, useEffect, useRef } from 'react'
import { DadosDocente, Docente } from '@/types/docente'
import { User, Mail, MapPin, Calendar, Briefcase, Info } from 'lucide-react'
import { label } from 'framer-motion/client'
import { InfoField } from '@/app/components/InfoField'
import { carregaDocente, carregaDadosDocente, carregaDocumentosDocente } from './functions'

export default function DocentesPage() {
  const [idDocenteSelecionado, setIdDocenteSelecionado] = useState<number>(0)
  const [dadosDocente, setDadosDocente] = useState<DadosDocente>({ id: -1, nome: '' })
  const [listaDeDocentes, setListaDeDocentes] = useState<ListCollection<never>>(
    createListCollection({ items: [] })
  )

  // const toast = useToast()
  // const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  //TODO: corrigir reloads desnecessários
  useEffect(() => {
    const carregaDados = async () => {
      const docentes: Docente = await carregaDocente()
      setListaDeDocentes(
        createListCollection({
          items: docentes.map((docente: Docente) => ({
            label: docente.nome,
            value: docente.id,
          })),
        })
      )
    }

    carregaDados()
    // setListaDeDocentes(docentes)
  }, [])

  useEffect(() => {
    if (idDocenteSelecionado === -1) return
    const carregaDados = async () => {
      setIsLoading(true)
      //TODO: chechar se ocorre erro ao enviar id de docente não existente
      const dadosDocente = await carregaDadosDocente(idDocenteSelecionado)
      const documentosDocente = await carregaDocumentosDocente(idDocenteSelecionado)
      if (!dadosDocente) return
      const docente: DadosDocente = {
        ...dadosDocente,
        documentos: documentosDocente,
      }
      console.log(documentosDocente)
      setDadosDocente(docente)
      setIsLoading(false)
    }

    carregaDados()
  }, [idDocenteSelecionado])

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target
  //   setDocente(prevDocente => ({
  //     ...prevDocente,
  //     [name]: value,
  //   }))
  // }
  // console.log(listaDeDocentes)

  return (
    <Container layerStyle="container">
      <Stack layerStyle="vstack" backgroundColor="white">
        <Heading size="md" layerStyle="heading" display="flex" alignItems="center" gap={3}>
          <User size={24} />
          Docentes
        </Heading>
        <Stack px={20} mt={5}>
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
        {/* ----------------------------- */}
        <Card.Root width="100%" borderWidth={0} borderRadius={0}>
          <Card.Body>
            {isLoading ? (
              <Spinner />
            ) : (
              dadosDocente.id !== -1 && (
                <>
                  <Heading size="md" mb={4}>
                    Dados Gerais
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={2}>
                    <InfoField label="Nome" value={dadosDocente.nome} />
                    <InfoField label="Matrícula" value={dadosDocente.matricula} />
                    <InfoField
                      label="Data de Nascimento"
                      value={dadosDocente.data_nascimento}
                      formatter={date => (date ? new Date(date).toLocaleDateString() : '')}
                    />
                    <InfoField label="Endereço" value={dadosDocente.endereco} />
                    <InfoField label="Email" value={dadosDocente.email} />
                    <InfoField label="Telefone" value={dadosDocente.telefones?.[0]} />
                  </Grid>

                  <Heading size="md" mt={6} mb={4}>
                    Documentos
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    {/* <InfoField label="CPF" value={dadosDocente.cpf} />
                    <InfoField label="RG" value={dadosDocente.rg} /> */}
                  </Grid>

                  <Heading size="md" mt={6} mb={4}>
                    Dados Contratuais
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <InfoField
                      label="Data de Admissão"
                      value={dadosDocente.data_admissao}
                      formatter={date => (date ? new Date(date).toLocaleDateString() : '')}
                    />
                    <InfoField label="Regime de Trabalho" value={dadosDocente.regime_trabalho} />
                  </Grid>

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
        {/* <Tab.Contents>
            <Box overflowX="auto">
              <Table variant="simple" bg="white" shadow="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Nome</Th>
                    <Th>Email</Th>
                    <Th>Regime</Th>
                    <Th width="200px">Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {docentes.map(docente => (
                    <Tr key={docente.id}>
                      <Td>{docente.nome}</Td>
                      <Td>{docente.email}</Td>
                      <Td>{docente.regime_trabalho}</Td>
                      <Td>
                        <Button size="sm" colorScheme="yellow" onClick={() => handleEdit(docente)} mr={2}>
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => {
                            onOpen()
                          }}>
                          Excluir
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Tab.Contents> */}
      </Stack>
    </Container>
  )
}
