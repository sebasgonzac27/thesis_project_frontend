import { z } from 'zod'

export const userSchema = z.object({
  role_id: z.number().int(),
  status: z.string(),
  profile: z.object({
    telephone: z.string().min(10, 'El teléfono debe tener al menos 10 números'),
    first_name: z.string().min(1, 'El nombre es requerido'),
    last_name: z.string().min(1, 'El apellido es requerido'),
    nickname: z.string().nullable(),
    team_id: z.number().int(),
  }),
})
