import { Chatbot } from '@/components'
import { RootLayout } from '@/layouts'

export default function ChatbotPage() {
  return (
    <RootLayout title='Chatbot' withBreadcrumb>
      <Chatbot />
    </RootLayout>
  )
}
