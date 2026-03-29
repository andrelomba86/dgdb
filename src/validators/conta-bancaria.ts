import { z } from 'zod'

import { idSchema, requiredPatternString } from '@/validators/shared'

const bankCodeRegex = /^[A-Z0-9]{3}$/i
const agencyRegex = /^[A-Z0-9-]{1,8}$/i
const accountRegex = /^[A-Z0-9-]{1,15}$/i

export const contaBancariaInputSchema = z.object({
  id: idSchema.optional(),
  banco: requiredPatternString('Código do banco', 3, bankCodeRegex, 'Código do banco inválido.'),
  agencia: requiredPatternString('Agência', 8, agencyRegex, 'Agência inválida.'),
  conta: requiredPatternString('Conta', 15, accountRegex, 'Conta inválida.'),
})

export type ContaBancariaInput = z.infer<typeof contaBancariaInputSchema>
