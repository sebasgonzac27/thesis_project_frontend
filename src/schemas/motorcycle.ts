import { z } from 'zod'

export const motorcycleSchema = z.object({
  model: z.string({ required_error: 'El modelo es requerido' }).min(4, 'Debe tener al menos 4 caracteres'),
  license_plate: z
    .string({ required_error: 'La placa es requerida' })
    .min(6, 'Debe tener 6 caracteres')
    .max(6, 'Debe tener 6 caracteres'),
  photo: z.string().nullable(),
  brand_id: z.number({ required_error: 'La marca es requerida' }).int(),
  owner_id: z.number().int(),
})
