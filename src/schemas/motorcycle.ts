import { z } from 'zod'

export const motorcycleSchema = z.object({
  model: z.string().min(1, 'El modelo es requerido'),
  license_plate: z.string().min(1, 'La placa es requerida'),
  photo: z.string(),
  brand_id: z.number({ required_error: 'La marca es requerida' }).int(),
  owner_id: z.number().int(),
})
