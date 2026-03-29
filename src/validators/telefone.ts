import { z } from 'zod'

import { idSchema, requiredPatternString, requiredString } from '@/validators/shared'

const telefoneRegex = /^[0-9()+\-\s]{8,15}$/

export const telefoneInputSchema = z.object({
  id: idSchema.optional(),
  telefone: requiredPatternString('Telefone', 15, telefoneRegex, 'Telefone inválido.'),
  tipo: requiredString('Tipo de telefone', 20).pipe(z.enum(['celular', 'comercial', 'residencial'])),
})

export type TelefoneInput = z.infer<typeof telefoneInputSchema>
