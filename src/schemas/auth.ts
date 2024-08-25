import { z } from 'zod'
import { passwordSchema } from './utils'

export const loginSchema = z.object({
  username: z.string().min(1, 'El correo electrónico es requerido').email({ message: 'El correo no es válido' }),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export const registerSchema = z
  .object({
    email: z.string().email({ message: 'El correo no es válido' }).min(1, 'El correo electrónico es requerido'),
    password: passwordSchema,
    confirm_password: z.string().min(1, 'La confirmación de la contraseña es requerida'),
    role_id: z.number().int().default(3),
    status: z.string().default('activo'),
    profile: z.object({
      telephone: z.string().min(10, 'El teléfono debe tener al menos 10 números'),
      first_name: z.string().min(1, 'El nombre es requerido'),
      last_name: z.string().min(1, 'El apellido es requerido'),
      nickname: z.string().nullable(),
      document_type: z.enum(['cédula de ciudadanía', 'cédula de extranjería', 'pasaporte']),
      document_number: z.string({ required_error: 'El número de documento es requerido' }),
      rh: z.enum(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
      birthdate: z
        .string()
        .min(1, 'La fecha de nacimiento es requerida')
        .refine(
          birthdate => {
            const date = new Date(birthdate)
            const today = new Date()
            const age = today.getFullYear() - date.getFullYear()
            const m = today.getMonth() - date.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
              return age - 1 >= 18
            }
            return age >= 18
          },
          { message: 'Debes ser mayor de 18 años' },
        ),
      genre: z.enum(['masculino', 'femenino', 'otro']),
      photo: z.string().nullable(),
      team_id: z.number().int(),
    }),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
  })
