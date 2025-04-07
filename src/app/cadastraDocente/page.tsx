'use client'

import {
  Box,
  Button,
  Container,
  Field,
  Input,
  VStack,
  Select,
  Grid,
  Heading,
  Card,
  CardBody,
  useDisclosure,
  Spinner,
  InputGroup,
  createListCollection,
  Stack,
} from '@chakra-ui/react'
import { Tabs } from '@/app/components/Tabs'
import { useState, useEffect } from 'react'
import { DadosDocente } from '@/types/docente'
import { User, Mail, MapPin, Calendar, Briefcase } from 'lucide-react'
import { label } from 'framer-motion/client'

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<DadosDocente[]>([])
  const [formData, setFormData] = useState<DadosDocente>({
    nome: '',
    data_nascimento: '',
    endereco: '',
    matricula: '',
    email: '',
    telefones: [''],
    cpf: '',
    rg: '',
    data_admissao: '',
    regime_juridico: '',
    regime_trabalho: '',
    regime_data_aplicacao: '',
    banco: '',
    agencia: '',
    conta: '',
  })
  const [editando, setEditando] = useState(false)
  // const toast = useToast()
  // const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    carregarDocentes()
  }, [])

  const carregarDocentes = async () => {
    const response = await fetch('/api/docentes')
    const data = await response.json()
    setDocentes(data)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await fetch('/api/docentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      toast({
        title: 'Docente cadastrado com sucesso',
        status: 'success',
      })
      carregarDocentes()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast({
        title: 'Erro ao cadastrar docente',
        status: 'error',
      })
    }
  }

  const handleEdit = (docente: Docente) => {
    setFormData(docente)
    setEditando(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await fetch('/api/docentes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      toast({
        title: 'Docente atualizado com sucesso',
        status: 'success',
      })
      setEditando(false)
      setFormData({
        nome: '',
        data_nascimento: '',
        endereco: '',
        matricula: '',
        email: '',
        telefones: [''],
        cpf: '',
        rg: '',
        data_admissao: '',
        regime_juridico: '',
        regime_trabalho: '',
        regime_data_aplicacao: '',
        banco: '',
        agencia: '',
        conta: '',
      })
      carregarDocentes()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast({
        title: 'Erro ao atualizar docente',
        status: 'error',
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este docente?')) {
      try {
        await fetch(`/api/docentes?id=${id}`, {
          method: 'DELETE',
        })
        toast({
          title: 'Docente excluído com sucesso',
          status: 'success',
        })
        carregarDocentes()
      } catch (error) {
        toast({
          title: 'Erro ao excluir docente',
          status: 'error',
        })
      }
    }
  }
  //TODO: Eliminar lista hardcoded; dar um fetch na lista de regimes de trabalho do banco de dados
  const regimes_de_trabalho = createListCollection({
    items: [
      { label: 'Autárquico', value: 'autarquico' },
      { label: 'CLT', value: 'clt' },
    ],
  })

  return (
    <Container layerStyle="container">
      <Stack layerStyle="vstack">
        <Heading size="md" layerStyle="heading" display="flex" alignItems="center" gap={3}>
          <User size={24} />
          Cadastro de docente
        </Heading>

        {/* <Tabs.Root defaultValue="dados_gerais" size="md" width="100%" margin={0} padding={0}> */}
        <Tabs.Root defaultValue="dados_gerais">
          <Tabs.List>
            <Tabs.Trigger value="dados_gerais">Dados Gerais</Tabs.Trigger>
            <Tabs.Trigger value="dados_contratuais">Dados Contratuais</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="dados_gerais">
            <form onSubmit={editando ? handleUpdate : handleSubmit}>
              <Card.Root width="100%" borderWidth={0}>
                <Card.Body>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <Field.Root required>
                      <Field.Label>
                        Nome
                        <Field.RequiredIndicator />
                      </Field.Label>
                      {/* <InputGroup startElement={<User size={18} />}> */}
                      <Input
                        value={formData.nome}
                        onChange={e => setFormData({ ...formData, nome: e.target.value })}
                      />
                      {/* </InputGroup> */}
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Matrícula</Field.Label>
                      <Input
                        value={formData.matricula}
                        onChange={e => setFormData({ ...formData, matricula: e.target.value })}
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Data de Nascimento</Field.Label>

                      <Input
                        type="date"
                        value={formData.data_nascimento}
                        onChange={e => setFormData({ ...formData, data_nascimento: e.target.value })}
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Endereço</Field.Label>
                      <Input
                        value={formData.endereco}
                        onChange={e => setFormData({ ...formData, endereco: e.target.value })}
                      />
                    </Field.Root>
                  </Grid>

                  <Heading size="md" mt={6} mb={4}>
                    Contato
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <Field.Root>
                      <Field.Label>Email</Field.Label>
                      <InputGroup startElement={<Mail size={18} />}>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </InputGroup>
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Telefone</Field.Label>

                      <Input
                        value={formData.telefones?.[0]}
                        onChange={e => setFormData({ ...formData, telefones: [e.target.value] })}
                      />
                    </Field.Root>
                  </Grid>

                  <Heading size="md" mt={6} mb={4}>
                    Documentos
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <Field.Root>
                      <Field.Label>CPF</Field.Label>
                      <Input
                        value={formData.cpf}
                        onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>RG</Field.Label>
                      <Input
                        value={formData.rg}
                        onChange={e => setFormData({ ...formData, rg: e.target.value })}
                      />
                    </Field.Root>
                  </Grid>
                </Card.Body>
              </Card.Root>
            </form>
          </Tabs.Content>

          <Tabs.Content value="dados_contratuais">
            <Card.Root width="100%" borderWidth={0}>
              <Card.Body>
                <Grid templateColumns={{ base: 'fr', md: 'repeat(2, 1fr)' }} gap={4}>
                  <Field.Root>
                    <Field.Label>Data de Admissão</Field.Label>
                    <Input
                      type="date"
                      value={formData.data_admissao}
                      onChange={e => setFormData({ ...formData, data_admissao: e.target.value })}
                    />
                  </Field.Root>

                  <Select.Root collection={regimes_de_trabalho}>
                    <Select.Label>Regime de Trabalho</Select.Label>
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
                          {regimes_de_trabalho.items.map(regime => (
                            <Select.Item item={regime} key={regime.value}>
                              {regime.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.ItemGroup>
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Grid>
                <Heading size="md" mt={6} mb={4}>
                  Dados Bancários
                </Heading>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                  <Field.Root>
                    <Field.Label>Banco</Field.Label>
                    <Input
                      value={formData.banco}
                      onChange={e => setFormData({ ...formData, banco: e.target.value })}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Agência</Field.Label>
                    <Input
                      value={formData.agencia}
                      onChange={e => setFormData({ ...formData, agencia: e.target.value })}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Conta</Field.Label>
                    <Input
                      value={formData.conta}
                      onChange={e => setFormData({ ...formData, conta: e.target.value })}
                    />
                  </Field.Root>
                </Grid>
              </Card.Body>
            </Card.Root>
          </Tabs.Content>
          <Button mt={6} colorScheme="blue" width="full" type="submit" isLoading={isLoading}>
            {editando ? 'Atualizar' : 'Cadastrar'}
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
        </Tabs.Root>
        {/* 
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar exclusão</ModalHeader>
            <ModalBody>Tem certeza que deseja excluir este docente?</ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={() => {
                  onClose()
                }}>
                Confirmar
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal> */}
      </Stack>
    </Container>
  )
}
