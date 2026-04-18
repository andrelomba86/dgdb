import { z } from 'zod'
import { progressaoInputSchema } from '@/validators/progressao'
import { contaBancariaInputSchema } from '@/validators/conta-bancaria'
import { documentoInputSchema } from '@/validators/documento'
import {
  idSchema,
  nullableDate,
  nullableEmail,
  nullableString,
  pageSchema,
  pageSizeSchema,
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
  progressoes: z.array(progressaoInputSchema).default([]),
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
  ativo: z.preprocess(v => (v === true ? true : undefined), z.boolean().optional()),
  sortBy: sortBySchema,
  sortOrder: sortOrderSchema,
})

export const docenteIdSchema = z.object({
  id: idSchema,
})

export type CreateDocenteInput = z.infer<typeof createDocenteSchema>
export type UpdateDocenteInput = z.infer<typeof updateDocenteSchema>
export type DocenteListInput = z.infer<typeof docenteListSchema>
