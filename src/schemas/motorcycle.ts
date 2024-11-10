import { z } from 'zod'

export const motorcycleSchema = z.object({
  model: z.string({ required_error: 'El modelo es requerido' }).min(4, 'Debe tener al menos 4 caracteres'),
  license_plate: z
    .string({ required_error: 'La placa es requerida' })
    .regex(/^[A-Z]{3}\d{2}[A-Z]$/, 'La placa debe tener el formato AAA00A'),
  photo: z.string().nullable(),
  brand_id: z.number({ required_error: 'La marca es requerida' }).int(),
  owner_id: z.number().int(),
})
