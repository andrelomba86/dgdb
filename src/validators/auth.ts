import { z } from 'zod'

import { requiredMinString, requiredString } from '@/validators/shared'

export const loginInputSchema = z.object({
  login: requiredString('Login', 80),
  senha: requiredMinString('Senha', 8, 255),
})

export type LoginInput = z.infer<typeof loginInputSchema>
