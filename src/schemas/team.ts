import { z } from 'zod'

export const teamSchema = z.object({
  name: z.string().min(0, 'El nombre del  equipo es requerido'),
  location_id: z.number({ required_error: 'La ubicación es requerida' }),
})
