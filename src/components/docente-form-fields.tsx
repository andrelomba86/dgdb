import { Box, Checkbox, Field, Fieldset, Grid, Input } from '@chakra-ui/react'

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
  formPendingValues?: DocenteFormValues
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

export function DocenteFormFields({
  values = defaultValues,
  relatedInitialData,
  formPendingValues,
}: DocenteFormFieldsProps) {
  if (formPendingValues) {
    values = formPendingValues
  }
  return (
    <>
      <Box>
        <Checkbox.Root name="ativo" defaultChecked={values.ativo ?? true}>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Docente ativo</Checkbox.Label>
        </Checkbox.Root>
      </Box>

      <Fieldset.Root borderWidth="1px" borderColor="#dbeafe" borderRadius="18px" p="20px" pt="0">
        <Fieldset.Legend px="8px" fontWeight={700}>
          Dados pessoais
        </Fieldset.Legend>
        <Fieldset.Content>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' }} gap="14px">
            <Field.Root required gridColumn={{ base: '1', md: '1 / -1' }}>
              <Field.Label htmlFor="nome">Nome</Field.Label>
              <Input id="nome" name="nome" type="text" maxLength={100} defaultValue={values.nome} required />
            </Field.Root>

            <Field.Root>
              <Field.Label htmlFor="dataNascimento">Data de Nascimento</Field.Label>
              <Input
                id="dataNascimento"
                name="dataNascimento"
                type="date"
                defaultValue={values.dataNascimento}
              />
            </Field.Root>

            <Field.Root gridColumn={{ base: '1', md: '1 / -1', lg: 'span 2' }}>
              <Field.Label htmlFor="endereco">Endereço</Field.Label>
              <Input
                id="endereco"
                name="endereco"
                type="text"
                maxLength={200}
                defaultValue={values.endereco}
              />
            </Field.Root>
          </Grid>
        </Fieldset.Content>
      </Fieldset.Root>

      <Fieldset.Root borderWidth="1px" borderColor="#dbeafe" borderRadius="18px" p="20px" pt="0">
        <Fieldset.Legend px="8px" fontWeight={700}>
          Dados funcionais
        </Fieldset.Legend>
        <Fieldset.Content>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap="14px">
            <Field.Root>
              <Field.Label htmlFor="matricula">Matrícula</Field.Label>
              <Input
                id="matricula"
                name="matricula"
                type="text"
                maxLength={10}
                defaultValue={values.matricula}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label htmlFor="dataAdmissao">Data de Admissão</Field.Label>
              <Input id="dataAdmissao" name="dataAdmissao" type="date" defaultValue={values.dataAdmissao} />
            </Field.Root>

            <Field.Root>
              <Field.Label htmlFor="email">E-mail</Field.Label>
              <Input id="email" name="email" type="email" maxLength={80} defaultValue={values.email} />
            </Field.Root>

            <Field.Root>
              <Field.Label htmlFor="regimeJuridico">Regime Jurídico</Field.Label>
              <Input
                id="regimeJuridico"
                name="regimeJuridico"
                type="text"
                maxLength={15}
                defaultValue={values.regimeJuridico}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label htmlFor="regimeTrabalho">Regime de Trabalho</Field.Label>
              <Input
                id="regimeTrabalho"
                name="regimeTrabalho"
                type="text"
                maxLength={15}
                defaultValue={values.regimeTrabalho}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label htmlFor="regimeDataAplicacao">Data Aplicação Regime</Field.Label>
              <Input
                id="regimeDataAplicacao"
                name="regimeDataAplicacao"
                type="date"
                defaultValue={values.regimeDataAplicacao}
              />
            </Field.Root>
          </Grid>
        </Fieldset.Content>
      </Fieldset.Root>

      <DocenteRelatedFields initialData={relatedInitialData} />
    </>
  )
}
