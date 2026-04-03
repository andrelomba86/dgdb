import { Box, Grid, Input } from '@chakra-ui/react'

import { DocenteRelatedFields, type RelatedEntitiesInitialData } from '@/components/docente-related-fields'

export type DocenteFormValues = {
  nome?: string
  dataNascimento?: string
  endereco?: string
  matricula?: string
  email?: string
  dataAdmissao?: string
  regimeJuridico?: string
  regimeTrabalho?: string
  regimeDataAplicacao?: string
  ativo?: boolean
}

type DocenteFormFieldsProps = {
  values?: DocenteFormValues
  relatedInitialData?: RelatedEntitiesInitialData
}

const defaultValues: DocenteFormValues = {
  nome: '',
  dataNascimento: '',
  endereco: '',
  matricula: '',
  email: '',
  dataAdmissao: '',
  regimeJuridico: '',
  regimeTrabalho: '',
  regimeDataAplicacao: '',
  ativo: true,
}

export function DocenteFormFields({ values = defaultValues, relatedInitialData }: DocenteFormFieldsProps) {
  return (
    <>
      <fieldset style={{ border: '1px solid #dbeafe', borderRadius: '18px', padding: '20px' }}>
        <legend style={{ padding: '0 8px', fontWeight: 700 }}>Dados pessoais</legend>

        <Grid gap="14px">
          <Box>
            <label htmlFor="nome">
              Nome <span style={{ color: 'red' }}>*</span>
            </label>
            <Input
              id="nome"
              name="nome"
              type="text"
              maxLength={100}
              defaultValue={values.nome}
              required
              p="10px 12px"
            />
          </Box>

          <Box>
            <label htmlFor="dataNascimento">Data de Nascimento</label>
            <Input
              id="dataNascimento"
              name="dataNascimento"
              type="date"
              defaultValue={values.dataNascimento}
              p="10px 12px"
            />
          </Box>

          <Box>
            <label htmlFor="endereco">Endereço</label>
            <Input
              id="endereco"
              name="endereco"
              type="text"
              maxLength={200}
              defaultValue={values.endereco}
              p="10px 12px"
            />
          </Box>
        </Grid>
      </fieldset>

      <fieldset style={{ border: '1px solid #dbeafe', borderRadius: '18px', padding: '20px' }}>
        <legend style={{ padding: '0 8px', fontWeight: 700 }}>Dados profissionais</legend>

        <Grid gap="14px">
          <Box>
            <label htmlFor="matricula">Matrícula</label>
            <Input
              id="matricula"
              name="matricula"
              type="text"
              maxLength={10}
              defaultValue={values.matricula}
              p="10px 12px"
            />
          </Box>

          <Box>
            <label htmlFor="email">E-mail</label>
            <Input
              id="email"
              name="email"
              type="email"
              maxLength={80}
              defaultValue={values.email}
              p="10px 12px"
            />
          </Box>

          <Box>
            <label htmlFor="dataAdmissao">Data de Admissão</label>
            <Input
              id="dataAdmissao"
              name="dataAdmissao"
              type="date"
              defaultValue={values.dataAdmissao}
              p="10px 12px"
            />
          </Box>

          <Box>
            <label htmlFor="regimeJuridico">Regime Jurídico</label>
            <Input
              id="regimeJuridico"
              name="regimeJuridico"
              type="text"
              maxLength={15}
              defaultValue={values.regimeJuridico}
              p="10px 12px"
            />
          </Box>

          <Box>
            <label htmlFor="regimeTrabalho">Regime de Trabalho</label>
            <Input
              id="regimeTrabalho"
              name="regimeTrabalho"
              type="text"
              maxLength={15}
              defaultValue={values.regimeTrabalho}
              p="10px 12px"
            />
          </Box>

          <Box>
            <label htmlFor="regimeDataAplicacao">Data Aplicação Regime</label>
            <Input
              id="regimeDataAplicacao"
              name="regimeDataAplicacao"
              type="date"
              defaultValue={values.regimeDataAplicacao}
              p="10px 12px"
            />
          </Box>
        </Grid>
      </fieldset>

      <DocenteRelatedFields initialData={relatedInitialData} />

      <Box>
        <label htmlFor="ativo">
          <input
            id="ativo"
            name="ativo"
            type="checkbox"
            defaultChecked={values.ativo ?? true}
            style={{ marginRight: '8px' }}
          />
          Docente ativo
        </label>
      </Box>
    </>
  )
}
