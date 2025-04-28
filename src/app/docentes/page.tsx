'use client'

import {
  Button,
  Container,
  Grid,
  Heading as ChakraHeading,
  Stack as ChakraStack,
  createListCollection,
} from '@chakra-ui/react'
import { CollectionOptions, ListCollection } from '@zag-js/collection'
import { useState, useEffect } from 'react'
import { ProfessorData, Docente, SelectProps } from '@/types'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Toaster, toaster } from '@/components/ui/toaster'
import { InfoField, DataTable, Heading, Stack, Select } from '@/app/components'
import { useProfessorService, useStateContext } from '@/app/contexts'

//TODO: desativar botão editar quando der algum erro
export default function DocentesPage() {
  const router = useRouter()
  const professorService = useProfessorService()

  // const decaco: NotNull<Docente> = { dend: '' }
  // console.log(decaco)
  const {
    state: { selectedProfessorID, professorData },

    setProp,
  } = useStateContext()

  const [professorData, setProfessorData] = useState<ProfessorData>({ nome: '' })
  const [professorList, setProfessorList] = useState<ListCollection<SelectProps>>(
    createListCollection<SelectProps>({ items: [] })
  )

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadNames = async () => {
      const docentes: Docente[] = await professorService.fetchNames()
      const collection: CollectionOptions<SelectProps> = {
        items: docentes.map((docente: Docente) => ({
          label: docente.nome,
          value: docente.id.toString(),
        })),
      }
      const lista = createListCollection(collection)
      setProfessorList(lista)
    }

    loadNames()
  }, [professorService])

  useEffect(() => {
    if (selectedProfessorID === -1) return
    const loadData = async () => {
      setIsLoading(true)
      try {
        const { result, error } = await professorService.fetchData(selectedProfessorID)
        if (error) {
          toaster.create({ title: error.message, description: error.cause, type: 'error' })
          return
        }
        setProfessorData(result || { nome: '' })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedProfessorID, professorService])

  return (
    <Container layerStyle="container">
      <Toaster />
      <ChakraStack layerStyle="vstack" backgroundColor="white">
        <ChakraHeading size="md" layerStyle="heading" display="flex" alignItems="center" gap={3}>
          <User size={24} />
          Docentes
        </ChakraHeading>
        <ChakraStack px={12} mt={5}>
          <Select
            listCollection={professorList}
            selectedId={selectedProfessorID}
            onChange={setProp('selectedProfessorID')}
          />
        </ChakraStack>
        <Stack>
          {/*---------------- DADOS GERAIS -------------------*/}
          <Heading>Dados Gerais</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={1}>
            <InfoField label="Nome" value={professorData.nome} />

            <InfoField label="Data de Nascimento" value={professorData.data_nascimento?.toLocaleDateString() || ''} />
            <InfoField label="Endereço" value={professorData.endereco} />
          </Grid>
          {/*------------------  CONTATOS --------------------*/}
          <Heading>Contatos</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={1}>
            <InfoField label="Email" value={professorData.email} />
            {professorData.telefones?.map(telefone => (
              <InfoField key={telefone.id} label={`${telefone.tipo}`} value={telefone.telefone} />
            ))}
          </Grid>
          {/*------------------ DOCUMENTOS --------------------*/}
          <Heading>Documentos</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={1}>
            {professorData.documentos?.length
              ? professorData.documentos?.map(documento => (
                  <InfoField key={documento.id} label={documento.tipo} value={documento.documento} />
                ))
              : '-'}
          </Grid>
          {/*---------------- DADOS FUNCIONAIS ----------------*/}
          <Heading>Dados Funcionais</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={1}>
            <InfoField label="Matrícula" value={professorData.matricula} />
            <InfoField label="Data de Admissão" value={professorData.data_admissao?.toLocaleDateString()} />
            <InfoField label="Regime de Trabalho" value={professorData.regime_trabalho} />
            <InfoField label="Regime Jurídico" value={professorData.regime_juridico} />
            <InfoField label="Data de Aplicação" value={professorData.regime_data_aplicacao?.toLocaleDateString()} />
          </Grid>
          {/*-------------------- CARGOS ----------------------*/}
          <Heading>Cargos</Heading>
          {professorData.cargos && professorData.cargos.length > 0 && <DataTable data={professorData.cargos} />}
          {/*---------------- DADOS BANCÁRIOS -----------------*/}
          <Heading>Dados Bancários</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <InfoField label="Banco" value={professorData.banco} />
            <InfoField label="Agência" value={professorData.agencia} />
            <InfoField label="Conta" value={professorData.conta} />
          </Grid>
        </Stack>
        <Grid templateColumns="repeat(4, 1fr)" gap={4} mx={6} my={4}>
          <div />
          <div />
          <div />
          <Button
            colorScheme="blue"
            width="full"
            disabled={isLoading || selectedProfessorID === -1}
            onClick={() => router.push(`/docentes/form/${selectedProfessorID}`)}
          >
            {isLoading ? 'Carregando...' : 'Editar'}
          </Button>
        </Grid>
      </ChakraStack>
    </Container>
  )
}
