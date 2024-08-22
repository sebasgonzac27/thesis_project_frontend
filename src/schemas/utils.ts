import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(1, 'La contraseña es requerida')
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .refine(value => /^[^\s].*[^\s]$/.test(value), {
    message: 'La contraseña no debe iniciar ni finalizar con espacios en blanco.',
  })
  .refine(value => /[a-z]/.test(value), {
    message: 'La contraseña debe tener al menos una letra minúscula.',
  })
  .refine(value => /[A-Z]/.test(value), {
    message: 'La contraseña debe tener al menos una letra mayúscula.',
  })
  .refine(value => /\d/.test(value), {
    message: 'La contraseña debe tener al menos un número.',
  })
  .refine(value => /[^A-Za-z0-9]/.test(value), {
    message: 'La contraseña debe tener al menos un carácter especial.',
  })
