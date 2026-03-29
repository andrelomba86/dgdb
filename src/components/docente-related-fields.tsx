'use client'

import { Box, Button, Grid, Input, Stack } from '@chakra-ui/react'
import { type ChangeEvent, useState } from 'react'

type CargoFormValue = {
  id?: number
  descricao: string
  funcao: string
  dataInicio: string
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
  cargos: CargoFormValue[]
  telefones: TelefoneFormValue[]
  documentos: DocumentoFormValue[]
  contasBancarias: ContaBancariaFormValue[]
}

type DocenteRelatedFieldsProps = {
  initialData?: RelatedEntitiesInitialData
}

const defaultData: RelatedEntitiesInitialData = {
  cargos: [],
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
  const [cargos, setCargos] = useState<CargoFormValue[]>(initialData.cargos)
  const [telefones, setTelefones] = useState<TelefoneFormValue[]>(initialData.telefones)
  const [documentos, setDocumentos] = useState<DocumentoFormValue[]>(initialData.documentos)
  const [contasBancarias, setContasBancarias] = useState<ContaBancariaFormValue[]>(
    initialData.contasBancarias,
  )

  return (
    <>
      <input type="hidden" name="cargosData" value={JSON.stringify(cargos)} />
      <input type="hidden" name="telefonesData" value={JSON.stringify(telefones)} />
      <input type="hidden" name="documentosData" value={JSON.stringify(documentos)} />
      <input type="hidden" name="contasBancariasData" value={JSON.stringify(contasBancarias)} />

      <fieldset style={{ border: '1px solid #dbeafe', borderRadius: '18px', padding: '20px' }}>
        <legend style={{ padding: '0 8px', fontWeight: 700 }}>Cargos</legend>

        <Stack gap="12px">
          {cargos.map((cargo, index) => (
            <Box
              key={cargo.id ?? `cargo-${index}`}
              display="grid"
              gap="10px"
              p="14px"
              border="1px solid #e2e8f0"
              borderRadius="14px"
              bg="#f8fafc">
              <Grid templateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap="10px">
                <Box>
                  <label htmlFor={`cargo-descricao-${index}`}>Descrição</label>
                  <Input
                    id={`cargo-descricao-${index}`}
                    type="text"
                    value={cargo.descricao}
                    onChange={event => {
                      setCargos(current =>
                        updateAtIndex(current, index, item => ({ ...item, descricao: event.target.value })),
                      )
                    }}
                    p="10px 12px"
                  />
                </Box>
                <Box>
                  <label htmlFor={`cargo-funcao-${index}`}>Função</label>
                  <Input
                    id={`cargo-funcao-${index}`}
                    type="text"
                    value={cargo.funcao}
                    onChange={event => {
                      setCargos(current =>
                        updateAtIndex(current, index, item => ({ ...item, funcao: event.target.value })),
                      )
                    }}
                    p="10px 12px"
                  />
                </Box>
                <Box>
                  <label htmlFor={`cargo-data-${index}`}>Data de início</label>
                  <Input
                    id={`cargo-data-${index}`}
                    type="date"
                    value={cargo.dataInicio}
                    onChange={event => {
                      setCargos(current =>
                        updateAtIndex(current, index, item => ({ ...item, dataInicio: event.target.value })),
                      )
                    }}
                    p="10px 12px"
                  />
                </Box>
                <Box>
                  <label htmlFor={`cargo-referencia-${index}`}>Referência</label>
                  <Input
                    id={`cargo-referencia-${index}`}
                    type="text"
                    value={cargo.referencia}
                    onChange={event => {
                      setCargos(current =>
                        updateAtIndex(current, index, item => ({ ...item, referencia: event.target.value })),
                      )
                    }}
                    p="10px 12px"
                  />
                </Box>
              </Grid>

              <Box>
                <Button
                  type="button"
                  onClick={() => setCargos(current => removeAtIndex(current, index))}
                  p="8px 12px"
                  borderRadius="999px"
                  border="1px solid #fecaca"
                  bg="#fff1f2"
                  color="#be123c">
                  Remover cargo
                </Button>
              </Box>
            </Box>
          ))}

          <Button
            type="button"
            onClick={() =>
              setCargos(current => [
                ...current,
                { descricao: '', funcao: '', dataInicio: '', referencia: '' },
              ])
            }
            p="10px 14px"
            borderRadius="999px"
            border="1px solid #bfdbfe"
            bg="#eff6ff"
            color="#1d4ed8"
            justifySelf="start">
            Adicionar cargo
          </Button>
        </Stack>
      </fieldset>

      <fieldset style={{ border: '1px solid #dbeafe', borderRadius: '18px', padding: '20px' }}>
        <legend style={{ padding: '0 8px', fontWeight: 700 }}>Telefones</legend>

        <Stack gap="12px">
          {telefones.map((telefone, index) => (
            <Box
              key={telefone.id ?? `telefone-${index}`}
              display="grid"
              gap="10px"
              p="14px"
              border="1px solid #e2e8f0"
              borderRadius="14px"
              bg="#f8fafc">
              <Grid templateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap="10px">
                <Box>
                  <label htmlFor={`telefone-numero-${index}`}>Telefone</label>
                  <Input
                    id={`telefone-numero-${index}`}
                    type="text"
                    value={telefone.telefone}
                    onChange={event => {
                      setTelefones(current =>
                        updateAtIndex(current, index, item => ({ ...item, telefone: event.target.value })),
                      )
                    }}
                    p="10px 12px"
                  />
                </Box>
                <Box>
                  <label htmlFor={`telefone-tipo-${index}`}>Tipo</label>
                  <select
                    id={`telefone-tipo-${index}`}
                    value={telefone.tipo}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                      setTelefones(current =>
                        updateAtIndex(current, index, item => ({
                          ...item,
                          tipo: event.target.value as TelefoneFormValue['tipo'],
                        })),
                      )
                    }}
                    style={{ width: '100%', padding: '10px 12px' }}>
                    <option value="celular">Celular</option>
                    <option value="comercial">Comercial</option>
                    <option value="residencial">Residencial</option>
                  </select>
                </Box>
              </Grid>

              <Box>
                <Button
                  type="button"
                  onClick={() => setTelefones(current => removeAtIndex(current, index))}
                  p="8px 12px"
                  borderRadius="999px"
                  border="1px solid #fecaca"
                  bg="#fff1f2"
                  color="#be123c">
                  Remover telefone
                </Button>
              </Box>
            </Box>
          ))}

          <Button
            type="button"
            onClick={() => setTelefones(current => [...current, { telefone: '', tipo: 'celular' }])}
            p="10px 14px"
            borderRadius="999px"
            border="1px solid #bfdbfe"
            bg="#eff6ff"
            color="#1d4ed8"
            justifySelf="start">
            Adicionar telefone
          </Button>
        </Stack>
      </fieldset>

      <fieldset style={{ border: '1px solid #dbeafe', borderRadius: '18px', padding: '20px' }}>
        <legend style={{ padding: '0 8px', fontWeight: 700 }}>Documentos</legend>

        <Stack gap="12px">
          {documentos.map((documento, index) => (
            <Box
              key={documento.id ?? `documento-${index}`}
              display="grid"
              gap="10px"
              p="14px"
              border="1px solid #e2e8f0"
              borderRadius="14px"
              bg="#f8fafc">
              <Grid templateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap="10px">
                <Box>
                  <label htmlFor={`documento-tipo-${index}`}>Tipo</label>
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
                </Box>
                <Box>
                  <label htmlFor={`documento-numero-${index}`}>Número</label>
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
                </Box>
              </Grid>

              <Box>
                <Button
                  type="button"
                  onClick={() => setDocumentos(current => removeAtIndex(current, index))}
                  p="8px 12px"
                  borderRadius="999px"
                  border="1px solid #fecaca"
                  bg="#fff1f2"
                  color="#be123c">
                  Remover documento
                </Button>
              </Box>
            </Box>
          ))}

          <Button
            type="button"
            onClick={() => setDocumentos(current => [...current, { tipo: '', documento: '' }])}
            p="10px 14px"
            borderRadius="999px"
            border="1px solid #bfdbfe"
            bg="#eff6ff"
            color="#1d4ed8"
            justifySelf="start">
            Adicionar documento
          </Button>
        </Stack>
      </fieldset>

      <fieldset style={{ border: '1px solid #dbeafe', borderRadius: '18px', padding: '20px' }}>
        <legend style={{ padding: '0 8px', fontWeight: 700 }}>Contas bancárias</legend>

        <Stack gap="12px">
          {contasBancarias.map((conta, index) => (
            <Box
              key={conta.id ?? `conta-${index}`}
              display="grid"
              gap="10px"
              p="14px"
              border="1px solid #e2e8f0"
              borderRadius="14px"
              bg="#f8fafc">
              <Grid templateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap="10px">
                <Box>
                  <label htmlFor={`conta-banco-${index}`}>Banco</label>
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
                </Box>
                <Box>
                  <label htmlFor={`conta-agencia-${index}`}>Agência</label>
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
                </Box>
                <Box>
                  <label htmlFor={`conta-conta-${index}`}>Conta</label>
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
                </Box>
              </Grid>

              <Box>
                <Button
                  type="button"
                  onClick={() => setContasBancarias(current => removeAtIndex(current, index))}
                  p="8px 12px"
                  borderRadius="999px"
                  border="1px solid #fecaca"
                  bg="#fff1f2"
                  color="#be123c">
                  Remover conta
                </Button>
              </Box>
            </Box>
          ))}

          <Button
            type="button"
            onClick={() => setContasBancarias(current => [...current, { banco: '', agencia: '', conta: '' }])}
            p="10px 14px"
            borderRadius="999px"
            border="1px solid #bfdbfe"
            bg="#eff6ff"
            color="#1d4ed8"
            justifySelf="start">
            Adicionar conta
          </Button>
        </Stack>
      </fieldset>
    </>
  )
}
