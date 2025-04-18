'use client'

import {
  Button,
  Container,
  Grid,
  Heading as ChakraHeading,
  Stack as ChakraStack,
  createListCollection,
} from '@chakra-ui/react'
import { CollectionOptions, ListCollection, CollectionItem } from '@zag-js/collection'

import { useState, useEffect } from 'react'
import { DadosDocente, Docente } from '@/types/docente'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Toaster, toaster } from '@/components/ui/toaster'
import { ProfessorService } from '../services/DocenteService'
import { InfoField, DataTable, Heading, Stack, Select } from '@/app/components'

//TODO: desativar botão editar quando der algum erro
export default function DocentesPage() {
  const router = useRouter()
  const [idDocenteSelecionado, setIdDocenteSelecionado] = useState<number>(-1)
  const [dadosDocente, setDadosDocente] = useState<DadosDocente>({ nome: '' })
  const [listaDeDocentes, setListaDeDocentes] = useState<ListCollection<Docente>>(
    createListCollection<Docente>({ items: [] })
  )

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const carregaNomes = async () => {
      const docentes: Docente[] = await ProfessorService.fetchNames()
      const items: CollectionOptions = {
        items: docentes.map((docente: Docente) => ({
          label: docente.nome,
          value: docente.id,
        })),
      }
      const lista = createListCollection(items)
      setListaDeDocentes(lista)
    }

    carregaNomes()
  }, [])

  useEffect(() => {
    if (idDocenteSelecionado === -1) return
    const carregaDados = async () => {
      setIsLoading(true)
      try {
        const { result, error } = await ProfessorService.carregaDados(idDocenteSelecionado)
        console.log('---------> ', result, error)
        if (error) {
          toaster.create({ title: error.message, description: error.cause, type: 'error' })
          return
        }
        setDadosDocente(result)
      } finally {
        setIsLoading(false)
      }
    }

    carregaDados()
  }, [idDocenteSelecionado])

  return (
    <Container layerStyle="container">
      <Toaster />
      <ChakraStack layerStyle="vstack" backgroundColor="white">
        <ChakraHeading size="md" layerStyle="heading" display="flex" alignItems="center" gap={3}>
          <User size={24} />
          Docentes
        </ChakraHeading>
        <ChakraStack px={12} mt={5}>
          <Select listCollection={listaDeDocentes} onChange={setIdDocenteSelecionado} />
        </ChakraStack>
        <Stack>
          {/*---------------- DADOS GERAIS -------------------*/}
          <Heading>Dados Gerais</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={1}>
            <InfoField label="Nome" value={dadosDocente.nome} />

            <InfoField label="Data de Nascimento" value={dadosDocente.data_nascimento?.toLocaleDateString() || ''} />
            <InfoField label="Endereço" value={dadosDocente.endereco} />
          </Grid>
          {/*------------------  CONTATOS --------------------*/}
          <Heading>Contatos</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={1}>
            <InfoField label="Email" value={dadosDocente.email} />
            {dadosDocente.telefones?.map(telefone => (
              <InfoField key={telefone.id} label={`${telefone.tipo}`} value={telefone.telefone} />
            ))}
          </Grid>
          {/*------------------ DOCUMENTOS --------------------*/}
          <Heading>Documentos</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={1}>
            {dadosDocente.documentos?.length
              ? dadosDocente.documentos?.map(documento => (
                  <InfoField key={documento.id} label={documento.tipo} value={documento.documento} />
                ))
              : '-'}
          </Grid>
          {/*---------------- DADOS FUNCIONAIS ----------------*/}
          <Heading>Dados Funcionais</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={1}>
            <InfoField label="Matrícula" value={dadosDocente.matricula} />
            <InfoField label="Data de Admissão" value={dadosDocente.data_admissao?.toLocaleDateString()} />
            <InfoField label="Regime de Trabalho" value={dadosDocente.regime_trabalho} />
            <InfoField label="Regime Jurídico" value={dadosDocente.regime_juridico} />
            <InfoField label="Data de Aplicação" value={dadosDocente.regime_data_aplicacao?.toLocaleDateString()} />
          </Grid>
          {/*-------------------- CARGOS ----------------------*/}
          <Heading>Cargos</Heading>
          {dadosDocente.cargos && dadosDocente.cargos.length > 0 && <DataTable data={dadosDocente.cargos} />}
          {/*---------------- DADOS BANCÁRIOS -----------------*/}
          <Heading>Dados Bancários</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <InfoField label="Banco" value={dadosDocente.banco} />
            <InfoField label="Agência" value={dadosDocente.agencia} />
            <InfoField label="Conta" value={dadosDocente.conta} />
          </Grid>
        </Stack>
        <Grid templateColumns="repeat(4, 1fr)" gap={4} mx={6} my={4}>
          <div />
          <div />
          <div />
          <Button
            colorScheme="blue"
            width="full"
            disabled={isLoading || idDocenteSelecionado === -1}
            onClick={() => router.push(`/docentes/form/${idDocenteSelecionado}`)}
          >
            {isLoading ? 'Carregando...' : 'Editar'}
          </Button>
        </Grid>
      </ChakraStack>
    </Container>
  )
}
