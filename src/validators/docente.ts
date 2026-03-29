import { z } from 'zod'

import { cargoInputSchema } from '@/validators/cargo'
import { contaBancariaInputSchema } from '@/validators/conta-bancaria'
import { documentoInputSchema } from '@/validators/documento'
import {
  idSchema,
  nullableDate,
  nullableString,
  pageSchema,
  pageSizeSchema,
  requiredDate,
  requiredEmail,
  requiredString,
} from '@/validators/shared'
import { telefoneInputSchema } from '@/validators/telefone'

const sortBySchema = z.enum(['nome', 'matricula', 'email', 'dataAdmissao']).default('nome')
const sortOrderSchema = z.enum(['asc', 'desc']).default('asc')

export const docenteBaseSchema = z.object({
  nome: requiredString('Nome', 100),
  endereco: nullableString(200),
  dataNascimento: nullableDate,
  matricula: requiredString('Matrícula', 10),
  email: requiredEmail('E-mail', 80),
  dataAdmissao: requiredDate('Data de admissão'),
  regimeJuridico: nullableString(15),
  regimeTrabalho: nullableString(15),
  regimeDataAplicacao: nullableDate,
  cargos: z.array(cargoInputSchema).default([]),
  telefones: z.array(telefoneInputSchema).default([]),
  documentos: z.array(documentoInputSchema).default([]),
  contasBancarias: z.array(contaBancariaInputSchema).default([]),
})

export const createDocenteSchema = docenteBaseSchema

export const updateDocenteSchema = docenteBaseSchema.extend({
  id: idSchema,
})

export const docenteListSchema = z.object({
  page: pageSchema,
  pageSize: pageSizeSchema,
  nome: z.string().trim().optional(),
  matricula: z.string().trim().optional(),
  email: z.string().trim().optional(),
  dataAdmissaoInicio: nullableDate.optional(),
  dataAdmissaoFim: nullableDate.optional(),
  sortBy: sortBySchema,
  sortOrder: sortOrderSchema,
})

export const docenteIdSchema = z.object({
  id: idSchema,
})

export type CreateDocenteInput = z.infer<typeof createDocenteSchema>
export type UpdateDocenteInput = z.infer<typeof updateDocenteSchema>
export type DocenteListInput = z.infer<typeof docenteListSchema>
