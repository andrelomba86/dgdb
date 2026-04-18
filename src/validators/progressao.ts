import { z } from 'zod'

import { idSchema, nullableDate, nullableString, requiredDate, requiredString } from '@/validators/shared'

export const progressaoInputSchema = z.object({
  id: idSchema.optional(),
  descricao: requiredString('Descrição da progressão', 60),
  funcao: nullableString(60),
  dataInicio: requiredDate('Data de início'),
  referencia: nullableString(45),
})

export const progressaoPatchSchema = progressaoInputSchema.extend({
  dataInicio: z.union([requiredDate('Data de início'), nullableDate]),
})

export type ProgressaoInput = z.infer<typeof progressaoInputSchema>
