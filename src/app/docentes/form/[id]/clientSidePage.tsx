'use client'

import {
  Button,
  Container,
  Field,
  Input,
  Select,
  Grid,
  Heading,
  Card,
  InputGroup,
  createListCollection,
  Stack,
} from '@chakra-ui/react'
import { Tabs } from '@/app/components/Tabs'
import { useState, useEffect } from 'react'
import { DadosDocente } from '@/types/docente'
// import { DadosDocente, DocenteFormProps } from '@/types/docente'
import { User, Mail } from 'lucide-react'
import { DocenteService } from '../../../services/DocenteService'
import { useRouter as useNextRouter } from 'next/navigation'

type DocentePageParams = {
  idDocente: number
}
export default function DocentesPage({ idDocente }: DocentePageParams) {
  const router = useNextRouter()
  // export default function DocentesPage() {
  const [formData, setFormData] = useState<DadosDocente>({
    nome: '',
    data_nascimento: undefined,
    endereco: '',
    matricula: '',
    email: '',
    telefones: [{ id: 0, telefone: '', tipo: '', docente_id: 0 }],
    documentos: [],
    data_admissao: undefined,
    regime_juridico: '',
    regime_trabalho: '',
    regime_data_aplicacao: undefined,
    banco: '',
    agencia: '',
    conta: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const editando = true //searchParams?.editand === 'true'

  useEffect(() => {
    async function carregaDados() {
      const data = await DocenteService.carregaDados(idDocente)
      setFormData(data)
      console.log(data)
    }
    setIsLoading(true)
    carregaDados()
    setIsLoading(false)
  }, [idDocente])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (formData.email && !formData.email.trim()) newErrors.email = 'Email é obrigatório'

    //TODO: fazer função em arquivo separado para checar validade de email
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   newErrors.email = 'Email inválido'
    // }

    setErrors(newErrors)
    console.log(errors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    // setIsLoading(true)
    // try {
    //   const savedDocente = await DocenteService.createDocente(formData)
    //   // Save phones
    //   if (formData.telefones && formData.telefones.length > 0) {
    //     const phonePromises = formData.telefones.map(telefone =>
    //       DocenteService.createTelefone(savedDocente.id, telefone.telefone, telefone.tipo)
    //     )
    //     await Promise.all(phonePromises)
    //   }
    //   toast({
    //     title: 'Docente cadastrado com sucesso',
    //     status: 'success',
    //   })
    //   carregarDocentes()
    //   setIsLoading(false)
    // } catch (error) {
    //   setIsLoading(false)
    //   toast({
    //     title: 'Erro ao cadastrar docente',
    //     status: 'error',
    //   })
    // }
  }
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    alert('ok')
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
      <Stack layerStyle="vstack" backgroundColor="white">
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
                        value={formData.data_nascimento?.toLocaleDateString()}
                        onChange={e =>
                          setFormData({ ...formData, data_nascimento: new Date(e.target.value) })
                        }
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

                        {/* <Field.Root>
                      <Field.Label>Telefones</Field.Label>
                      {formData.telefones?.map((telefone, index) => (
                        <Grid key={index} templateColumns="1fr auto" gap={2} mb={2}>
                          <Input
                            value={telefone.telefone}
                            onChange={e => {
                              const newTelefones = [...(formData.telefones || [])]
                              newTelefones[index] = {
                                ...newTelefones[index],
                                telefone: e.target.value,
                              }
                              setFormData({ ...formData, telefones: newTelefones })
                            }}
                            placeholder="Número do telefone"
                          />
                          <Select.Root
                            value={[telefone.tipo]}
                            onValueChange={e => {
                              const newTelefones = [...(formData.telefones || [])]
                              newTelefones[index] = {
                                ...newTelefones[index],
                                tipo: e.value[0],
                              }
                              setFormData({ ...formData, telefones: newTelefones })
                            }}>
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Tipo" />
                              </Select.Trigger>
                            </Select.Control>
                            <Select.Positioner>
                              <Select.Content>
                                <Select.ItemGroup>
                                  <Select.Item value="Celular">Celular</Select.Item>
                                  <Select.Item value="Residencial">Residencial</Select.Item>
                                  <Select.Item value="Comercial">Comercial</Select.Item>
                                </Select.ItemGroup>
                              </Select.Content>
                            </Select.Positioner>
                          </Select.Root>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => {
                              const newTelefones = formData.telefones?.filter((_, i) => i !== index)
                              setFormData({ ...formData, telefones: newTelefones })
                            }}>
                            Remover
                          </Button>
                        </Grid>
                      ))}
                      <Button
                        size="sm"
                        onClick={() => {
                          const newTelefones = [...(formData.telefones || [])]
                          newTelefones.push({ id: 0, telefone: '', tipo: '', docente_id: formData.id || 0 })
                          setFormData({ ...formData, telefones: newTelefones })
                        }}>
                        Adicionar Telefone
                      </Button>
                    </Field.Root> */}
                      </InputGroup>
                    </Field.Root>

                    {/* <Field.Root>
                      <Field.Label>Telefones</Field.Label>
                      {formData.telefones?.map((telefone, index) => (
                        <Grid key={index} templateColumns="1fr auto" gap={2} mb={2}>
                          <Input
                            value={telefone.telefone}
                            onChange={e => {
                              const newTelefones = [...(formData.telefones || [])]
                              newTelefones[index] = {
                                ...newTelefones[index],
                                telefone: e.target.value,
                              }
                              setFormData({ ...formData, telefones: newTelefones })
                            }}
                            placeholder="Número do telefone"
                          />
                          <Select.Root
                            value={[telefone.tipo]}
                            onValueChange={e => {
                              const newTelefones = [...(formData.telefones || [])]
                              newTelefones[index] = {
                                ...newTelefones[index],
                                tipo: e.value[0],
                              }
                              setFormData({ ...formData, telefones: newTelefones })
                            }}>
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Tipo" />
                              </Select.Trigger>
                            </Select.Control>
                            <Select.Positioner>
                              <Select.Content>
                                <Select.ItemGroup>
                                  <Select.Item value="Celular">Celular</Select.Item>
                                  <Select.Item value="Residencial">Residencial</Select.Item>
                                  <Select.Item value="Comercial">Comercial</Select.Item>
                                </Select.ItemGroup>
                              </Select.Content>
                            </Select.Positioner>
                          </Select.Root>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => {
                              const newTelefones = formData.telefones?.filter((_, i) => i !== index)
                              setFormData({ ...formData, telefones: newTelefones })
                            }}>
                            Remover
                          </Button>
                        </Grid>
                      ))}
                      <Button
                        size="sm"
                        onClick={() => {
                          const newTelefones = [...(formData.telefones || [])]
                          newTelefones.push({ id: 0, telefone: '', tipo: '', docente_id: formData.id || 0 })
                          setFormData({ ...formData, telefones: newTelefones })
                        }}>
                        Adicionar Telefone
                      </Button>
                    </Field.Root> */}
                  </Grid>

                  <Heading size="md" mt={6} mb={4}>
                    Documentos
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}></Grid>
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
                      value={formData.data_admissao?.toLocaleDateString()}
                      onChange={e => setFormData({ ...formData, data_admissao: new Date(e.target.value) })}
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
          <Grid templateColumns="repeat(4, 1fr)" gap={4} mx={6} my={4}>
            <div />
            <div />

            <Button colorPalette="blue" size="sm" type="submit" loading={isLoading} w="full">
              {/* {editando ? 'Atualizar' : 'Cadastrar'} */}
              Atualizar
            </Button>
            <Button
              colorPalette="gray"
              size="sm"
              onClick={() => router.push('/docentes')}
              w="full"
              loading={isLoading}>
              Voltar
            </Button>
          </Grid>
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
