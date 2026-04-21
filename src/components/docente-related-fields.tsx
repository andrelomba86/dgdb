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

function extractDynamicValues<T>(
  suggested: string[] | undefined,
  items: T[] | undefined,
  mapper: (item: T) => string,
) {
  return mergeSuggestedValues([...(suggested ?? []), ...(items ?? []).map(mapper)])
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

type RelatedSectionProps<T> = {
  title: string
  items: T[]
  onAdd: () => void
  onRemove: (index: number) => void
  addButtonLabel: string
  gridColumns: any
  itemKeyPrefix: string
  removeAriaLabel: string
  children: (item: T, index: number) => React.ReactNode
}

function RelatedSection<T extends { id?: number }>({
  title,
  items,
  onAdd,
  onRemove,
  addButtonLabel,
  gridColumns,
  itemKeyPrefix,
  removeAriaLabel,
  children,
}: RelatedSectionProps<T>) {
  return (
    <Fieldset.Root borderWidth="1px" borderColor="blue.100" borderRadius="18px" p="20px" pt="0">
      <Fieldset.Legend px="8px" fontWeight="700">
        {title}
      </Fieldset.Legend>
      <Fieldset.Content>
        <Stack gap="12px">
          {items.map((item, index) => (
            <Box
              key={item.id ?? `${itemKeyPrefix}-${index}`}
              display="grid"
              gap="10px"
              p="14px"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="24px"
              bg="gray.50">
              <Grid templateColumns={gridColumns} gap="8px">
                {children(item, index)}
                <IconButton
                  gridColumn={
                    typeof gridColumns === 'object' && 'lg' in gridColumns
                      ? { md: 'span 2', lg: 'span 1' }
                      : undefined
                  }
                  alignSelf="end"
                  type="button"
                  onClick={() => onRemove(index)}
                  aria-label={removeAriaLabel}
                  variant="ghost"
                  size="md"
                  colorPalette="red">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Box>
          ))}
          <Button type="button" onClick={onAdd} variant="surface" rounded="full" colorPalette="blue">
            {addButtonLabel}
          </Button>
        </Stack>
      </Fieldset.Content>
    </Fieldset.Root>
  )
}

export function DocenteRelatedFields({ initialData = defaultData }: DocenteRelatedFieldsProps) {
  const [progressoes, setProgressoes] = useState<ProgressaoFormValue[]>(initialData.progressoes)
  const [progressaoFuncoesSugeridas, setProgressaoFuncoesSugeridas] = useState<string[]>(
    extractDynamicValues(initialData.progressaoFuncoesSugeridas, initialData.progressoes, p => p.funcao),
  )
  const [progressaoReferenciasSugeridas, setProgressaoReferenciasSugeridas] = useState<string[]>(
    extractDynamicValues(
      initialData.progressaoReferenciasSugeridas,
      initialData.progressoes,
      p => p.referencia,
    ),
  )
  const [telefones, setTelefones] = useState<TelefoneFormValue[]>(initialData.telefones)
  const [telefoneTiposSugeridos, setTelefoneTiposSugeridos] = useState<string[]>(
    extractDynamicValues(initialData.telefoneTiposSugeridos, initialData.telefones, t => t.tipo),
  )
  const [documentos, setDocumentos] = useState<DocumentoFormValue[]>(initialData.documentos)
  const [documentoTiposSugeridos, setDocumentoTiposSugeridos] = useState<string[]>(
    extractDynamicValues(initialData.documentoTiposSugeridos, initialData.documentos, d => d.tipo),
  )
  const [contasBancarias, setContasBancarias] = useState<ContaBancariaFormValue[]>(
    initialData.contasBancarias,
  )

  useEffect(() => {
    setProgressoes(initialData.progressoes)
    setProgressaoFuncoesSugeridas(
      extractDynamicValues(initialData.progressaoFuncoesSugeridas, initialData.progressoes, p => p.funcao),
    )
    setProgressaoReferenciasSugeridas(
      extractDynamicValues(
        initialData.progressaoReferenciasSugeridas,
        initialData.progressoes,
        p => p.referencia,
      ),
    )
    setTelefones(initialData.telefones)
    setTelefoneTiposSugeridos(
      extractDynamicValues(initialData.telefoneTiposSugeridos, initialData.telefones, t => t.tipo),
    )
    setDocumentos(initialData.documentos)
    setDocumentoTiposSugeridos(
      extractDynamicValues(initialData.documentoTiposSugeridos, initialData.documentos, d => d.tipo),
    )
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

      <RelatedSection
        title="Progressões na carreira"
        items={progressoes}
        onAdd={() =>
          setProgressoes(current => [
            ...current,
            { funcao: '', dataInicio: '', dataTermino: '', referencia: '' },
          ])
        }
        onRemove={index => setProgressoes(current => removeAtIndex(current, index))}
        addButtonLabel="Adicionar progressão"
        gridColumns={{ base: '1fr', md: '1fr 1fr', lg: '7fr repeat(3, 5fr) 1fr' }}
        itemKeyPrefix="progressao"
        removeAriaLabel="Remover progressão">
        {(progressao, index) => (
          <>
            <SelectOrAddInput
              id={`progressao-funcao-${index}`}
              label="Função"
              value={progressao.funcao}
              onValueChange={value => {
                setProgressoes(current => updateAtIndex(current, index, item => ({ ...item, funcao: value })))
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
                  updateAtIndex(current, index, item => ({ ...item, referencia: value })),
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
          </>
        )}
      </RelatedSection>

      <RelatedSection
        title="Telefones"
        items={telefones}
        onAdd={() => setTelefones(current => [...current, { telefone: '', tipo: 'Celular' }])}
        onRemove={index => setTelefones(current => removeAtIndex(current, index))}
        addButtonLabel="Adicionar telefone"
        gridColumns={{ base: '1fr', md: 'repeat(2, 9fr) 1fr' }}
        itemKeyPrefix="telefone"
        removeAriaLabel="Remover telefone">
        {(telefone, index) => (
          <>
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
                setTelefones(current => updateAtIndex(current, index, item => ({ ...item, tipo: value })))
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
          </>
        )}
      </RelatedSection>

      <RelatedSection
        title="Documentos"
        items={documentos}
        onAdd={() => setDocumentos(current => [...current, { tipo: 'CPF', documento: '' }])}
        onRemove={index => setDocumentos(current => removeAtIndex(current, index))}
        addButtonLabel="Adicionar documento"
        gridColumns={{ base: '1fr', md: 'repeat(2, 9fr) 1fr' }}
        itemKeyPrefix="documento"
        removeAriaLabel="Remover documento">
        {(documento, index) => (
          <>
            <SelectOrAddInput
              id={`documento-tipo-${index}`}
              label="Tipo"
              value={documento.tipo}
              onValueChange={value => {
                setDocumentos(current => updateAtIndex(current, index, item => ({ ...item, tipo: value })))
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
          </>
        )}
      </RelatedSection>

      <RelatedSection
        title="Contas bancárias"
        items={contasBancarias}
        onAdd={() => setContasBancarias(current => [...current, { banco: '', agencia: '', conta: '' }])}
        onRemove={index => setContasBancarias(current => removeAtIndex(current, index))}
        addButtonLabel="Adicionar conta"
        gridColumns={{ base: '1fr', md: 'repeat(3, 6fr) 1fr' }}
        itemKeyPrefix="conta"
        removeAriaLabel="Remover conta">
        {(conta, index) => (
          <>
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
          </>
        )}
      </RelatedSection>
    </>
  )
}
