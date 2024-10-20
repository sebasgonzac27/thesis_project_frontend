import { format } from '@formkit/tempo'

export function formatDate(date: string) {
  return format(date, 'long')
}
