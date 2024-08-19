import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'El correo electrónico es requerido').email({ message: 'El correo no es válido' }),
  password: z.string().min(1, 'La contraseña es requerida'),
})
