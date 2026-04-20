'use client'

import {
  Box,
  Button,
  Field,
  Fieldset,
  Grid,
  GridItem,
  IconButton,
  Input,
  NativeSelect,
  Separator,
  Stack,
} from '@chakra-ui/react'
import Close from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect, useState } from 'react'

type ProgressaoFormValue = {
  id?: number
  funcao: string
  dataInicio: string
  dataTermino: string
  referencia: string
}

type TelefoneFormValue = {
  id?: number
  telefone: string
  tipo: 'celular' | 'comercial' | 'residencial'
}

type DocumentoFormValue = {
  id?: number
  tipo: string
  documento: string
}

type ContaBancariaFormValue = {
  id?: number
  banco: string
  agencia: string
  conta: string
}

export type RelatedEntitiesInitialData = {
  progressoes: ProgressaoFormValue[]
  telefones: TelefoneFormValue[]
  documentos: DocumentoFormValue[]
  contasBancarias: ContaBancariaFormValue[]
}

type DocenteRelatedFieldsProps = {
  initialData?: RelatedEntitiesInitialData
}

const defaultData: RelatedEntitiesInitialData = {
  progressoes: [],
  telefones: [],
  documentos: [],
  contasBancarias: [],
}

function updateAtIndex<T>(items: T[], index: number, updater: (item: T) => T) {
  return items.map((item, itemIndex) => (itemIndex === index ? updater(item) : item))
}

function removeAtIndex<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index)
}

export function DocenteRelatedFields({ initialData = defaultData }: DocenteRelatedFieldsProps) {
  const [progressoes, setProgressoes] = useState<ProgressaoFormValue[]>(initialData.progressoes)
  const [telefones, setTelefones] = useState<TelefoneFormValue[]>(initialData.telefones)
  const [documentos, setDocumentos] = useState<DocumentoFormValue[]>(initialData.documentos)
  const [contasBancarias, setContasBancarias] = useState<ContaBancariaFormValue[]>(
    initialData.contasBancarias,
  )

  useEffect(() => {
    setProgressoes(initialData.progressoes)
    setTelefones(initialData.telefones)
    setDocumentos(initialData.documentos)
    setContasBancarias(initialData.contasBancarias)
  }, [initialData])

  return (
    <>
      <input type="hidden" name="progressoesData" value={JSON.stringify(progressoes)} />
      <input type="hidden" name="telefonesData" value={JSON.stringify(telefones)} />
      <input type="hidden" name="documentosData" value={JSON.stringify(documentos)} />
      <input type="hidden" name="contasBancariasData" value={JSON.stringify(contasBancarias)} />

      <Fieldset.Root borderWidth="1px" borderColor="blue.100" borderRadius="18px" p="20px" pt="0">
        <Fieldset.Legend px="8px" fontWeight="700">
          Progressões na carreira
        </Fieldset.Legend>
        <Fieldset.Content>
          <Stack gap="12px">
            {progressoes.map((progressao, index) => (
              <Box
                key={progressao.id ?? `progressao-${index}`}
                display="grid"
                gap="8px"
                p="14px"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="24px"
                bg="gray.50">
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: 'repeat(4, 5fr) 1fr' }} gap="8px">
                  <Field.Root>
                    <Field.Label htmlFor={`progressao-funcao-${index}`}>Função</Field.Label>
                    <Input
                      id={`progressao-funcao-${index}`}
                      type="text"
                      value={progressao.funcao}
                      onChange={event => {
                        setProgressoes(current =>
                          updateAtIndex(current, index, item => ({ ...item, funcao: event.target.value })),
                        )
                      }}
                      p="10px 12px"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label htmlFor={`progressao-data-${index}`}>Data de início</Field.Label>
                    <Input
                      id={`progressao-data-${index}`}
                      type="date"
                      value={progressao.dataInicio}
                      onChange={event => {
                        setProgressoes(current =>
                          updateAtIndex(current, index, item => ({
                            ...item,
                            dataInicio: event.target.value,
                          })),
                        )
                      }}
                      p="10px 12px"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label htmlFor={`progressao-data-termino-${index}`}>Data de término</Field.Label>
                    <Input
                      id={`progressao-data-termino-${index}`}
                      type="date"
                      value={progressao.dataTermino}
                      onChange={event => {
                        setProgressoes(current =>
                          updateAtIndex(current, index, item => ({
                            ...item,
                            dataTermino: event.target.value,
                          })),
                        )
                      }}
                      p="10px 12px"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label htmlFor={`progressao-referencia-${index}`}>Referência</Field.Label>
                    <Input
                      id={`progressao-referencia-${index}`}
                      type="text"
                      value={progressao.referencia}
                      onChange={event => {
                        setProgressoes(current =>
                          updateAtIndex(current, index, item => ({
                            ...item,
                            referencia: event.target.value,
                          })),
                        )
                      }}
                      p="10px 12px"
                    />
                  </Field.Root>
                  <IconButton
                    gridColumn={{ md: 'span 2', lg: 'span 1' }}
                    alignSelf="end"
                    type="button"
                    onClick={() => setProgressoes(current => removeAtIndex(current, index))}
                    aria-label="Remover progressão"
                    variant="ghost"
                    size="md"
                    colorPalette="red">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Box>
            ))}

            <Button
              onClick={() =>
                setProgressoes(current => [
                  ...current,
                  { funcao: '', dataInicio: '', dataTermino: '', referencia: '' },
                ])
              }
              variant="surface"
              rounded="full"
              colorPalette="blue">
              Adicionar progressão
            </Button>
          </Stack>
        </Fieldset.Content>
      </Fieldset.Root>

      <Fieldset.Root borderWidth="1px" borderColor="blue.100" borderRadius="18px" p="20px" pt="0">
        <Fieldset.Legend px="8px" fontWeight="700">
          Telefones
        </Fieldset.Legend>
        <Fieldset.Content>
          <Stack gap="8px">
            {telefones.map((telefone, index) => (
              <Box
                key={telefone.id ?? `telefone-${index}`}
                display="grid"
                gap="10px"
                p="14px"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="24px"
                bg="gray.50">
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 9fr) 1fr' }} gap="8px">
                  <Field.Root>
                    <Field.Label htmlFor={`telefone-numero-${index}`}>Telefone</Field.Label>
                    <Input
                      id={`telefone-numero-${index}`}
                      type="text"
                      value={telefone.telefone}
                      onChange={event => {
                        setTelefones(current =>
                          updateAtIndex(current, index, item => ({
                            ...item,
                            telefone: event.target.value,
                          })),
                        )
                      }}
                      p="10px 12px"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label htmlFor={`telefone-tipo-${index}`}>Tipo</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        id={`telefone-tipo-${index}`}
                        value={telefone.tipo}
                        onChange={event => {
                          setTelefones(current =>
                            updateAtIndex(current, index, item => ({
                              ...item,
                              tipo: event.target.value as TelefoneFormValue['tipo'],
                            })),
                          )
                        }}
                        p="10px 12px">
                        <option value="celular">Celular</option>
                        <option value="comercial">Comercial</option>
                        <option value="residencial">Residencial</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                  <IconButton
                    alignSelf="end"
                    type="button"
                    onClick={() => setTelefones(current => removeAtIndex(current, index))}
                    aria-label="Remover telefone"
                    variant="ghost"
                    size="md"
                    colorPalette="red">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Box>
            ))}

            <Button
              type="button"
              onClick={() => setTelefones(current => [...current, { telefone: '', tipo: 'celular' }])}
              variant="surface"
              rounded="full"
              colorPalette="blue">
              Adicionar telefone
            </Button>
          </Stack>
        </Fieldset.Content>
      </Fieldset.Root>

      <Fieldset.Root borderWidth="1px" borderColor="#dbeafe" borderRadius="18px" p="20px">
        <Fieldset.Legend px="8px" fontWeight={700}>
          Documentos
        </Fieldset.Legend>
        <Fieldset.Content>
          <Stack gap="8px">
            {documentos.map((documento, index) => (
              <Box
                key={documento.id ?? `documento-${index}`}
                display="grid"
                gap="10px"
                p="14px"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="24px"
                bg="gray.50">
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 9fr) 1fr' }} gap="8px">
                  <Field.Root>
                    <Field.Label htmlFor={`documento-tipo-${index}`}>Tipo</Field.Label>
                    <Input
                      id={`documento-tipo-${index}`}
                      type="text"
                      value={documento.tipo}
                      onChange={event => {
                        setDocumentos(current =>
                          updateAtIndex(current, index, item => ({ ...item, tipo: event.target.value })),
                        )
                      }}
                      p="10px 12px"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label htmlFor={`documento-numero-${index}`}>Número</Field.Label>
                    <Input
                      id={`documento-numero-${index}`}
                      type="text"
                      value={documento.documento}
                      onChange={event => {
                        setDocumentos(current =>
                          updateAtIndex(current, index, item => ({ ...item, documento: event.target.value })),
                        )
                      }}
                      p="10px 12px"
                    />
                  </Field.Root>
                  <IconButton
                    alignSelf="end"
                    type="button"
                    onClick={() => setDocumentos(current => removeAtIndex(current, index))}
                    aria-label="Remover documento"
                    variant="ghost"
                    size="md"
                    colorPalette="red">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Box>
            ))}

            <Button
              type="button"
              onClick={() => setDocumentos(current => [...current, { tipo: '', documento: '' }])}
              variant="surface"
              rounded="full"
              colorPalette="blue">
              Adicionar documento
            </Button>
          </Stack>
        </Fieldset.Content>
      </Fieldset.Root>

      <Fieldset.Root borderWidth="1px" borderColor="#dbeafe" borderRadius="18px" p="20px">
        <Fieldset.Legend px="8px" fontWeight={700}>
          Contas bancárias
        </Fieldset.Legend>
        <Fieldset.Content>
          <Stack gap="12px">
            {contasBancarias.map((conta, index) => (
              <Box
                key={conta.id ?? `conta-${index}`}
                display="grid"
                gap="10px"
                p="14px"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="24px"
                bg="gray.50">
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 6fr) 1fr' }} gap="8px">
                  <Field.Root>
                    <Field.Label htmlFor={`conta-banco-${index}`}>Banco</Field.Label>
                    <Input
                      id={`conta-banco-${index}`}
                      type="text"
                      value={conta.banco}
                      onChange={event => {
                        setContasBancarias(current =>
                          updateAtIndex(current, index, item => ({ ...item, banco: event.target.value })),
                        )
                      }}
                      p="10px 12px"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label htmlFor={`conta-agencia-${index}`}>Agência</Field.Label>
                    <Input
                      id={`conta-agencia-${index}`}
                      type="text"
                      value={conta.agencia}
                      onChange={event => {
                        setContasBancarias(current =>
                          updateAtIndex(current, index, item => ({ ...item, agencia: event.target.value })),
                        )
                      }}
                      p="10px 12px"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label htmlFor={`conta-conta-${index}`}>Conta</Field.Label>
                    <Input
                      id={`conta-conta-${index}`}
                      type="text"
                      value={conta.conta}
                      onChange={event => {
                        setContasBancarias(current =>
                          updateAtIndex(current, index, item => ({ ...item, conta: event.target.value })),
                        )
                      }}
                      p="10px 12px"
                    />
                  </Field.Root>
                  <IconButton
                    alignSelf="end"
                    type="button"
                    onClick={() => setContasBancarias(current => removeAtIndex(current, index))}
                    aria-label="Remover conta"
                    variant="ghost"
                    size="md"
                    colorPalette="red">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Box>
            ))}

            <Button
              type="button"
              onClick={() =>
                setContasBancarias(current => [...current, { banco: '', agencia: '', conta: '' }])
              }
              variant="surface"
              rounded="full"
              colorPalette="blue">
              Adicionar conta
            </Button>
          </Stack>
        </Fieldset.Content>
      </Fieldset.Root>
    </>
  )
}
