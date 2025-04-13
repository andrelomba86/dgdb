// import React, { useState } from 'react'
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Stack,
//   Grid,
//   Input,
//   useToast,
// } from '@chakra-ui/react'
// import { Field, Select } from '@components'
// import { DadosDocente } from '@/types/docente'

// interface NovoDocenteModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onSave: () => void
// }

// const NovoDocenteModal: React.FC<NovoDocenteModalProps> = ({ isOpen, onClose, onSave }) => {
//   const [formData, setFormData] = useState<DadosDocente>({
//     nome: '',
//     data_nascimento: new Date(),
//     endereco: '',
//     matricula: '',
//     email: '',
//     telefones: [{ id: 0, telefone: '', tipo: '', docente_id: 0 }],
//     documentos: [],
//     data_admissao: new Date(),
//     regime_juridico: '',
//     regime_trabalho: '',
//     regime_data_aplicacao: new Date(),
//     banco: '',
//     agencia: '',
//     conta: '',
//   })

//   const [isLoading, setIsLoading] = useState(false)
//   const toast = useToast()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const response = await fetch('/api/docentes', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       })
//       const savedDocente = await response.json()

//       // Save phones
//       if (formData.telefones && formData.telefones.length > 0) {
//         const phonePromises = formData.telefones.map(telefone =>
//           fetch('/api/docentes/telefones', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               docente_id: savedDocente.id,
//               telefone: telefone.telefone,
//               tipo: telefone.tipo,
//             }),
//           })
//         )
//         await Promise.all(phonePromises)
//       }

//       onClose()
//       onSave()
//       toast({
//         title: 'Docente cadastrado com sucesso',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       })
//     } catch (error) {
//       console.error('Erro ao cadastrar docente:', error)
//       toast({
//         title: 'Erro ao cadastrar docente',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="xl">
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Novo Docente</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           <form onSubmit={handleSubmit}>
//             <Stack spacing={4}>
//               <Field.Root>
//                 <Field.Label>Nome</Field.Label>
//                 <Input
//                   value={formData.nome}
//                   onChange={e => setFormData({ ...formData, nome: e.target.value })}
//                 />
//               </Field.Root>

//               <Field.Root>
//                 <Field.Label>Matrícula</Field.Label>
//                 <Input
//                   value={formData.matricula}
//                   onChange={e => setFormData({ ...formData, matricula: e.target.value })}
//                 />
//               </Field.Root>

//               <Field.Root>
//                 <Field.Label>Data de Nascimento</Field.Label>
//                 <Input
//                   type="date"
//                   value={formData.data_nascimento}
//                   onChange={e => setFormData({ ...formData, data_nascimento: e.target.value })}
//                 />
//               </Field.Root>

//               <Field.Root>
//                 <Field.Label>Endereço</Field.Label>
//                 <Input
//                   value={formData.endereco}
//                   onChange={e => setFormData({ ...formData, endereco: e.target.value })}
//                 />
//               </Field.Root>

//               <Field.Root>
//                 <Field.Label>Email</Field.Label>
//                 <Input
//                   type="email"
//                   value={formData.email}
//                   onChange={e => setFormData({ ...formData, email: e.target.value })}
//                 />
//               </Field.Root>

//               <Field.Root>
//                 <Field.Label>Telefones</Field.Label>
//                 {formData.telefones?.map((telefone, index) => (
//                   <Grid key={index} templateColumns="1fr auto auto" gap={2} mb={2}>
//                     <Input
//                       value={telefone.telefone}
//                       onChange={e => {
//                         const newTelefones = [...(formData.telefones || [])]
//                         newTelefones[index] = {
//                           ...newTelefones[index],
//                           telefone: e.target.value,
//                         }
//                         setFormData({ ...formData, telefones: newTelefones })
//                       }}
//                       placeholder="Número do telefone"
//                     />
//                     <Select.Root
//                       value={[telefone.tipo]}
//                       onValueChange={e => {
//                         const newTelefones = [...(formData.telefones || [])]
//                         newTelefones[index] = {
//                           ...newTelefones[index],
//                           tipo: e.value[0],
//                         }
//                         setFormData({ ...formData, telefones: newTelefones })
//                       }}>
//                       <Select.Control>
//                         <Select.Trigger>
//                           <Select.ValueText placeholder="Tipo" />
//                         </Select.Trigger>
//                       </Select.Control>
//                       <Select.Positioner>
//                         <Select.Content>
//                           <Select.ItemGroup>
//                             <Select.Item value="Celular">Celular</Select.Item>
//                             <Select.Item value="Residencial">Residencial</Select.Item>
//                             <Select.Item value="Comercial">Comercial</Select.Item>
//                           </Select.ItemGroup>
//                         </Select.Content>
//                       </Select.Positioner>
//                     </Select.Root>
//                     <Button
//                       size="sm"
//                       colorScheme="red"
//                       onClick={() => {
//                         const newTelefones = formData.telefones?.filter((_, i) => i !== index)
//                         setFormData({ ...formData, telefones: newTelefones })
//                       }}>
//                       Remover
//                     </Button>
//                   </Grid>
//                 ))}
//                 <Button
//                   size="sm"
//                   onClick={() => {
//                     const newTelefones = [...(formData.telefones || [])]
//                     newTelefones.push({ id: 0, telefone: '', tipo: '', docente_id: 0 })
//                     setFormData({ ...formData, telefones: newTelefones })
//                   }}>
//                   Adicionar Telefone
//                 </Button>
//               </Field.Root>

//               <Field.Root>
//                 <Field.Label>Data de Admissão</Field.Label>
//                 <Input
//                   type="date"
//                   value={formData.data_admissao}
//                   onChange={e => setFormData({ ...formData, data_admissao: e.target.value })}
//                 />
//               </Field.Root>

//               <Field.Root>
//                 <Field.Label>Regime de Trabalho</Field.Label>
//                 <Select.Root
//                   value={[formData.regime_trabalho || '']}
//                   onValueChange={e => setFormData({ ...formData, regime_trabalho: e.value[0] })}>
//                   <Select.Control>
//                     <Select.Trigger>
//                       <Select.ValueText placeholder="Selecione" />
//                     </Select.Trigger>
//                   </Select.Control>
//                   <Select.Positioner>
//                     <Select.Content>
//                       <Select.ItemGroup>
//                         <Select.Item value="20h">20 horas</Select.Item>
//                         <Select.Item value="40h">40 horas</Select.Item>
//                         <Select.Item value="DE">Dedicação Exclusiva</Select.Item>
//                       </Select.ItemGroup>
//                     </Select.Content>
//                   </Select.Positioner>
//                 </Select.Root>
//               </Field.Root>

//               <Field.Root>
//                 <Field.Label>Regime Jurídico</Field.Label>
//                 <Select.Root
//                   value={[formData.regime_juridico || '']}
//                   onValueChange={e => setFormData({ ...formData, regime_juridico: e.value[0] })}>
//                   <Select.Control>
//                     <Select.Trigger>
//                       <Select.ValueText placeholder="Selecione" />
//                     </Select.Trigger>
//                   </Select.Control>
//                   <Select.Positioner>
//                     <Select.Content>
//                       <Select.ItemGroup>
//                         <Select.Item value="Efetivo">Efetivo</Select.Item>
//                         <Select.Item value="Substituto">Substituto</Select.Item>
//                         <Select.Item value="Visitante">Visitante</Select.Item>
//                       </Select.ItemGroup>
//                     </Select.Content>
//                   </Select.Positioner>
//                 </Select.Root>
//               </Field.Root>

//               <Field.Root>
//                 <Field.Label>Data de Aplicação do Regime</Field.Label>
//                 <Input
//                   type="date"
//                   value={formData.regime_data_aplicacao}
//                   onChange={e => setFormData({ ...formData, regime_data_aplicacao: e.target.value })}
//                 />
//               </Field.Root>

//               <Field.Root>
//                 <Field.Label>Banco</Field.Label>
//                 <Input
//                   value={formData.banco}
//                   onChange={e => setFormData({ ...formData, banco: e.target.value })}
//                 />
//               </Field.Root>

//               <Field.Root>
//                 <Field.Label>Agência</Field.Label>
//                 <Input
//                   value={formData.agencia}
//                   onChange={e => setFormData({ ...formData, agencia: e.target.value })}
//                 />
//               </Field.Root>

//               <Field.Root>
//                 <Field.Label>Conta</Field.Label>
//                 <Input
//                   value={formData.conta}
//                   onChange={e => setFormData({ ...formData, conta: e.target.value })}
//                 />
//               </Field.Root>
//             </Stack>
//             <ModalFooter>
//               <Button onClick={onClose} mr={3}>
//                 Cancelar
//               </Button>
//               <Button colorScheme="blue" isLoading={isLoading} type="submit">
//                 Salvar
//               </Button>
//             </ModalFooter>
//           </form>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   )
// }

// export default NovoDocenteModal
