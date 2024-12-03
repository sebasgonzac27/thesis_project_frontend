import React, { useEffect, useRef, useState } from 'react'
import Icon, { IconName } from '../shared/Icon'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { sendMessage } from '@/services'
import { AxiosError } from 'axios'
import { ChatbotMessage } from './ChatbotMessage'
import { ChatbotFastAction } from './ChatbotFastAction'
import useUserStore from '@/store/user'

export interface Message {
  text: string
  isUser: boolean
}

export interface FastAction {
  text: string
  iconName: IconName
  iconColor: string
}

const isLoadingMessage: Message = {
  text: 'Pensando en la respuesta...',
  isUser: false,
}

const fastActions: FastAction[] = [
  {
    text: '¿Qué eventos hay programados?',
    iconName: 'Calendar',
    iconColor: 'green',
  },
  {
    text: '¿Qué convenios tiene el club?',
    iconName: 'Handshake',
    iconColor: 'red',
  },
  {
    text: '¿Cuántos miembros tiene el club?',
    iconName: 'Users',
    iconColor: 'cyan',
  },
]

export default function Chatbot() {
  const { user } = useUserStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Función que se desplazará automáticamente al final del contenedor
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Ejecuta el scroll cada vez que los mensajes cambien
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const msgLocalStorage = localStorage.getItem('messages')
    if (msgLocalStorage) {
      setMessages(JSON.parse(msgLocalStorage))
    }
  }, [])

  useEffect(() => {
    return () => {
      localStorage.setItem('messages', JSON.stringify(messages))
    }
  }, [messages])

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (text.trim() === '' || isLoading) return

    await sendMessageToApi(text)
  }

  const sendMessageToApi = async (text: string) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: true }])
    setText('')
    setIsLoading(true)

    try {
      const response = await sendMessage(text)

      setMessages(prevMessages => [...prevMessages, { text: response.message, isUser: false }])
    } catch (error) {
      if (error instanceof AxiosError) {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: error.response?.data.message || 'Error al enviar el mensaje', isUser: false },
        ])
      }
    }
    setIsLoading(false)
  }

  return (
    <div className='flex flex-col gap-2 h-screen max-h-[calc(100vh-220px)]'>
      {messages.length > 0 ? (
        <div className='flex flex-1 flex-col gap-2 overflow-y-auto'>
          {messages.map((message, index) => (
            <ChatbotMessage message={message} key={index} />
          ))}
          {isLoading && <ChatbotMessage message={isLoadingMessage} />}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className='flex flex-1 flex-col justify-center items-center gap-4'>
          <Icon name='BotMessageSquare' size={50} />
          <p className='hidden md:block max-w-3xl text-center text-lg'>
            Hola <b>{user?.profile.first_name}</b>, para mí es un placer ayudarte. Selecciona una pregunta rápida o
            escribe tu pregunta en el cajón de texto que está en la parte inferior.
          </p>
          <div className='grid md:grid-cols-3 gap-4'>
            {fastActions.map(({ text, iconName, iconColor }, index) => (
              <ChatbotFastAction
                key={index}
                text={text}
                iconName={iconName}
                iconColor={iconColor}
                onClick={() => sendMessageToApi(text)}
              />
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className='flex gap-2'>
        <Input placeholder='Escriba su mensaje aquí' value={text} onChange={handleChangeText} />
        <Button variant='default' type='submit' disabled={isLoading}>
          <Icon name={isLoading ? 'LoaderCircle' : 'SendHorizontal'} className={isLoading ? 'animate-spin' : ''} />
        </Button>
      </form>
    </div>
  )
}
