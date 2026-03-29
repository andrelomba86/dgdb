import { z } from 'zod'

import { idSchema, nullableDate, nullableString, requiredDate, requiredString } from '@/validators/shared'

export const cargoInputSchema = z.object({
  id: idSchema.optional(),
  descricao: requiredString('Descrição do cargo', 60),
  funcao: nullableString(60),
  dataInicio: requiredDate('Data de início'),
  referencia: nullableString(45),
})

export const cargoPatchSchema = cargoInputSchema.extend({
  dataInicio: z.union([requiredDate('Data de início'), nullableDate]),
})

export type CargoInput = z.infer<typeof cargoInputSchema>
