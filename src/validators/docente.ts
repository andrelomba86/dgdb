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
  nullableEmail,
  requiredString,
} from '@/validators/shared'
import { telefoneInputSchema } from '@/validators/telefone'

const sortBySchema = z.enum(['nome', 'dataAdmissao']).default('nome')
const sortOrderSchema = z.enum(['asc', 'desc']).default('asc')

export const docenteBaseSchema = z.object({
  nome: requiredString('Nome', 100),
  endereco: nullableString(200),
  dataNascimento: nullableDate,
  matricula: nullableString(10),
  email: nullableEmail('E-mail', 80),
  dataAdmissao: nullableDate,
  regimeJuridico: nullableString(15),
  regimeTrabalho: nullableString(15),
  regimeDataAplicacao: nullableDate,
  cargos: z.array(cargoInputSchema).default([]),
  telefones: z.array(telefoneInputSchema).default([]),
  documentos: z.array(documentoInputSchema).default([]),
  contasBancarias: z.array(contaBancariaInputSchema).default([]),
  ativo: z.preprocess(v => v === 'on', z.boolean()).default(false),
})

export const createDocenteSchema = docenteBaseSchema

export const updateDocenteSchema = docenteBaseSchema.extend({
  id: idSchema,
})

export const docenteListSchema = z.object({
  page: pageSchema,
  pageSize: pageSizeSchema,
  nome: z.string().trim().optional(),
  ativo: z.preprocess(v => (v === undefined ? undefined : v === 'on'), z.boolean().optional()),
  sortBy: sortBySchema,
  sortOrder: sortOrderSchema,
})

export const docenteIdSchema = z.object({
  id: idSchema,
})

export type CreateDocenteInput = z.input<typeof createDocenteSchema>
export type UpdateDocenteInput = z.input<typeof updateDocenteSchema>
export type DocenteListInput = z.infer<typeof docenteListSchema>
