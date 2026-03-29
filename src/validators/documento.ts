import { z } from 'zod'

import { idSchema, requiredString } from '@/validators/shared'

export const documentoInputSchema = z.object({
  id: idSchema.optional(),
  tipo: requiredString('Tipo de documento', 25),
  documento: requiredString('Número do documento', 45),
})

export type DocumentoInput = z.infer<typeof documentoInputSchema>
