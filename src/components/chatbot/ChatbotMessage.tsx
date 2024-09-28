import clsx from 'clsx'
import { Message } from './Chatbot'

export function ChatbotMessage({ message }: { message: Message }) {
  const { text, isUser } = message
  return (
    <div
      className={clsx('p-2 rounded-lg max-w-md break-words ', {
        'rounded-br-none bg-primary text-white self-end': isUser,
        'rounded-bl-none bg-gray-200 text-black self-start': !isUser,
      })}>
      {text}
    </div>
  )
}
