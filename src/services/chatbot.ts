import { api } from '@/utils'

interface Message {
  message: string
}

export async function sendMessage(query: string) {
  const { data } = await api.post<Message>('/chat', { query })
  return data
}
