import { z } from 'zod'
import { passwordSchema } from './utils'

export const loginSchema = z.object({
  username: z.string().min(1, 'El correo electrónico es requerido').email({ message: 'El correo no es válido' }),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export const registerSchema = z
  .object({
    username: z.string().min(1, 'El nombre de usuario es requerido'),
    email: z.string().email({ message: 'El correo no es válido' }).min(1, 'El correo electrónico es requerido'),
    password: passwordSchema,
    confirm_password: z.string().min(1, 'La confirmación de la contraseña es requerida'),
    role_id: z.number().int().default(3),
    status: z.string().default('activo'),
    profile: z.object({
      telephone: z.string(),
      first_name: z.string().min(1, 'El nombre es requerido'),
      last_name: z.string().min(1, 'El apellido es requerido'),
      nickname: z.string().default(''),
      document_type: z.enum(['cédula de ciudadanía', 'cédula de extranjería', 'pasaporte']),
      document_number: z.string({ required_error: 'El número de documento es requerido' }),
      rh: z.enum(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
      birthdate: z.string().min(1, 'La fecha de nacimiento es requerida'),
      genre: z.enum(['masculino', 'femenino', 'otro']),
      photo: z.string(),
      team_id: z.number().int(),
    }),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
  })
