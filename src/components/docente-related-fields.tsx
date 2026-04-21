'use client'

import { Box, Button, Field, Fieldset, Grid, IconButton, Input, Stack } from '@chakra-ui/react'
import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect, useState } from 'react'
import { SelectOrAddInput } from '@/components/select-or-add-input'
import { normalizeText } from '@/lib/normalizers'

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
  tipo: string
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
  progressaoFuncoesSugeridas: string[]
  progressaoReferenciasSugeridas: string[]
  telefoneTiposSugeridos: string[]
  documentoTiposSugeridos: string[]
}

type DocenteRelatedFieldsProps = {
  initialData?: RelatedEntitiesInitialData
}

const defaultProgressaoFuncoesSugeridas = [
  'Professor Assistente Doutor',
  'Professor Associado',
  'Professor Titular',
]
const defaultProgressaoReferenciasSugeridas = ['MS3.1', 'MS3.2', 'MS3.3', 'MS5.1', 'MS5.2', 'MS6']
const defaultTelefoneTiposSugeridos = ['Celular', 'Institucional', 'Residencial']
const defaultDocumentoTiposSugeridos = ['CPF', 'RG', 'PIS', 'RNE']

function mergeSuggestedValues(values: string[]) {
  const valuesByKey = new Map<string, string>()

  values.forEach(value => {
    const normalizedValue = normalizeText(value)
    if (normalizedValue.length === 0) {
      return
    }

    const key = normalizedValue.toLocaleLowerCase('pt-BR')
    if (!valuesByKey.has(key)) {
      valuesByKey.set(key, normalizedValue)
    }
  })

  return Array.from(valuesByKey.values())
}

function appendSuggestedValue(currentValues: string[], value: string) {
  const normalizedValue = normalizeText(value)
  if (normalizedValue.length === 0) {
    return currentValues
  }

  const alreadyExists = currentValues.some(
    item => item.toLocaleLowerCase('pt-BR') === normalizedValue.toLocaleLowerCase('pt-BR'),
  )

  if (alreadyExists) {
    return currentValues
  }

  return [...currentValues, normalizedValue]
}

function extractDynamicTelefoneTipos(initialData: RelatedEntitiesInitialData) {
  return mergeSuggestedValues([
    ...(initialData.telefoneTiposSugeridos ?? []),
    ...(initialData.telefones ?? []).map(telefone => telefone.tipo),
  ])
}

function extractDynamicProgressaoFuncoes(initialData: RelatedEntitiesInitialData) {
  return mergeSuggestedValues([
    ...(initialData.progressaoFuncoesSugeridas ?? []),
    ...(initialData.progressoes ?? []).map(progressao => progressao.funcao),
  ])
}

function extractDynamicProgressaoReferencias(initialData: RelatedEntitiesInitialData) {
  return mergeSuggestedValues([
    ...(initialData.progressaoReferenciasSugeridas ?? []),
    ...(initialData.progressoes ?? []).map(progressao => progressao.referencia),
  ])
}

function extractDynamicDocumentoTipos(initialData: RelatedEntitiesInitialData) {
  return mergeSuggestedValues([
    ...(initialData.documentoTiposSugeridos ?? []),
    ...(initialData.documentos ?? []).map(documento => documento.tipo),
  ])
}

const defaultData: RelatedEntitiesInitialData = {
  progressoes: [],
  telefones: [],
  documentos: [],
  contasBancarias: [],
  progressaoFuncoesSugeridas: defaultProgressaoFuncoesSugeridas,
  progressaoReferenciasSugeridas: defaultProgressaoReferenciasSugeridas,
  telefoneTiposSugeridos: defaultTelefoneTiposSugeridos,
  documentoTiposSugeridos: defaultDocumentoTiposSugeridos,
}

function updateAtIndex<T>(items: T[], index: number, updater: (item: T) => T) {
  return items.map((item, itemIndex) => (itemIndex === index ? updater(item) : item))
}

function removeAtIndex<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index)
}

export function DocenteRelatedFields({ initialData = defaultData }: DocenteRelatedFieldsProps) {
  const [progressoes, setProgressoes] = useState<ProgressaoFormValue[]>(initialData.progressoes)
  const [progressaoFuncoesSugeridas, setProgressaoFuncoesSugeridas] = useState<string[]>(
    extractDynamicProgressaoFuncoes(initialData),
  )
  const [progressaoReferenciasSugeridas, setProgressaoReferenciasSugeridas] = useState<string[]>(
    extractDynamicProgressaoReferencias(initialData),
  )
  const [telefones, setTelefones] = useState<TelefoneFormValue[]>(initialData.telefones)
  const [telefoneTiposSugeridos, setTelefoneTiposSugeridos] = useState<string[]>(
    extractDynamicTelefoneTipos(initialData),
  )
  const [documentoTiposSugeridos, setDocumentoTiposSugeridos] = useState<string[]>(
    extractDynamicDocumentoTipos(initialData),
  )
  const [documentos, setDocumentos] = useState<DocumentoFormValue[]>(initialData.documentos)
  const [contasBancarias, setContasBancarias] = useState<ContaBancariaFormValue[]>(
    initialData.contasBancarias,
  )

  useEffect(() => {
    setProgressoes(initialData.progressoes)
    setProgressaoFuncoesSugeridas(extractDynamicProgressaoFuncoes(initialData))
    setProgressaoReferenciasSugeridas(extractDynamicProgressaoReferencias(initialData))
    setTelefones(initialData.telefones)
    setTelefoneTiposSugeridos(extractDynamicTelefoneTipos(initialData))
    setDocumentoTiposSugeridos(extractDynamicDocumentoTipos(initialData))
    setDocumentos(initialData.documentos)
    setContasBancarias(initialData.contasBancarias)
  }, [initialData])

  return (
    <>
      <input type="hidden" name="progressoesData" value={JSON.stringify(progressoes)} />
      <input
        type="hidden"
        name="progressaoFuncoesSugeridasData"
        value={JSON.stringify(progressaoFuncoesSugeridas)}
      />
      <input
        type="hidden"
        name="progressaoReferenciasSugeridasData"
        value={JSON.stringify(progressaoReferenciasSugeridas)}
      />
      <input type="hidden" name="telefonesData" value={JSON.stringify(telefones)} />
      <input type="hidden" name="telefoneTiposSugeridosData" value={JSON.stringify(telefoneTiposSugeridos)} />
      <input type="hidden" name="documentosData" value={JSON.stringify(documentos)} />
      <input
        type="hidden"
        name="documentoTiposSugeridosData"
        value={JSON.stringify(documentoTiposSugeridos)}
      />
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
                <Grid
                  templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '7fr repeat(3, 5fr) 1fr' }}
                  gap="8px">
                  <SelectOrAddInput
                    id={`progressao-funcao-${index}`}
                    label="Função"
                    value={progressao.funcao}
                    onValueChange={value => {
                      setProgressoes(current =>
                        updateAtIndex(current, index, item => ({
                          ...item,
                          funcao: value,
                        })),
                      )
                    }}
                    onRegisterOption={value => {
                      setProgressaoFuncoesSugeridas(current => appendSuggestedValue(current, value))
                    }}
                    defaultOptions={defaultProgressaoFuncoesSugeridas.map(funcao => ({
                      value: funcao,
                      label: funcao,
                    }))}
                    options={progressaoFuncoesSugeridas.map(funcao => ({
                      value: funcao,
                      label: funcao,
                    }))}
                    customInputPlaceholder="Informe a função"
                    cancelToValue={progressaoFuncoesSugeridas[0] ?? ''}
                    cancelAriaLabel="Voltar para lista de funções sugeridas"
                  />
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
                  <SelectOrAddInput
                    id={`progressao-referencia-${index}`}
                    label="Referência"
                    value={progressao.referencia}
                    onValueChange={value => {
                      setProgressoes(current =>
                        updateAtIndex(current, index, item => ({
                          ...item,
                          referencia: value,
                        })),
                      )
                    }}
                    onRegisterOption={value => {
                      setProgressaoReferenciasSugeridas(current => appendSuggestedValue(current, value))
                    }}
                    defaultOptions={defaultProgressaoReferenciasSugeridas.map(referencia => ({
                      value: referencia,
                      label: referencia,
                    }))}
                    options={progressaoReferenciasSugeridas.map(referencia => ({
                      value: referencia,
                      label: referencia,
                    }))}
                    customInputPlaceholder="Informe a referência"
                    cancelToValue={progressaoReferenciasSugeridas[0] ?? ''}
                    cancelAriaLabel="Voltar para lista de referências sugeridas"
                  />
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
              type="button"
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
                  <SelectOrAddInput
                    id={`telefone-tipo-${index}`}
                    label="Tipo"
                    value={telefone.tipo}
                    onValueChange={value => {
                      setTelefones(current =>
                        updateAtIndex(current, index, item => ({
                          ...item,
                          tipo: value,
                        })),
                      )
                    }}
                    onRegisterOption={value => {
                      setTelefoneTiposSugeridos(current => appendSuggestedValue(current, value))
                    }}
                    defaultOptions={defaultTelefoneTiposSugeridos.map(tipo => ({ value: tipo, label: tipo }))}
                    options={telefoneTiposSugeridos.map(tipo => ({
                      value: tipo,
                      label: tipo,
                    }))}
                    customInputPlaceholder="Informe o tipo de telefone"
                    cancelToValue="Celular"
                    cancelAriaLabel="Voltar para lista de tipos sugeridos"
                  />

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
              onClick={() => setTelefones(current => [...current, { telefone: '', tipo: 'Celular' }])}
              variant="surface"
              rounded="full"
              colorPalette="blue">
              Adicionar telefone
            </Button>
          </Stack>
        </Fieldset.Content>
      </Fieldset.Root>

      <Fieldset.Root borderWidth="1px" borderColor="blue.100" borderRadius="18px" p="20px" pt="0">
        <Fieldset.Legend px="8px" fontWeight="700">
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
                  <SelectOrAddInput
                    id={`documento-tipo-${index}`}
                    label="Tipo"
                    value={documento.tipo}
                    onValueChange={value => {
                      setDocumentos(current =>
                        updateAtIndex(current, index, item => ({ ...item, tipo: value })),
                      )
                    }}
                    onRegisterOption={value => {
                      setDocumentoTiposSugeridos(current => appendSuggestedValue(current, value))
                    }}
                    defaultOptions={defaultDocumentoTiposSugeridos.map(tipo => ({
                      value: tipo,
                      label: tipo,
                    }))}
                    options={documentoTiposSugeridos.map(tipo => ({
                      value: tipo,
                      label: tipo,
                    }))}
                    customInputPlaceholder="Informe o tipo de documento"
                    cancelToValue="CPF"
                    cancelAriaLabel="Voltar para lista de tipos sugeridos"
                  />
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
              onClick={() => setDocumentos(current => [...current, { tipo: 'CPF', documento: '' }])}
              variant="surface"
              rounded="full"
              colorPalette="blue">
              Adicionar documento
            </Button>
          </Stack>
        </Fieldset.Content>
      </Fieldset.Root>

      <Fieldset.Root borderWidth="1px" borderColor="blue.100" borderRadius="18px" p="20px" pt="0">
        <Fieldset.Legend px="8px" fontWeight="700">
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
