import React, { useEffect, useRef, useState } from 'react'
import Icon from '../shared/Icon'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { sendMessage } from '@/services'
import { AxiosError } from 'axios'
import { ChatbotMessage } from './ChatbotMessage'

export interface Message {
  text: string
  isUser: boolean
}

export default function Chatbot() {
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

    setMessages(prevMessages => [...prevMessages, { text, isUser: true }])
    setText('')
    setIsLoading(true)

    try {
      const response = await sendMessage(text)

      setMessages(prevMessages => [...prevMessages, { text: response.message, isUser: false }])
      setIsLoading(false)
    } catch (error) {
      if (error instanceof AxiosError) {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: error.response?.data.message || 'Error al enviar el mensaje', isUser: false },
        ])
      }
    }
  }

  return (
    <div className='flex flex-col gap-2 h-screen max-h-[calc(100vh-185px)]'>
      <div className='flex flex-1 flex-col gap-2 overflow-y-auto'>
        {messages.map((message, index) => (
          <ChatbotMessage message={message} key={index} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className='flex gap-2'>
        <Input placeholder='Escriba su mensaje aquí' value={text} onChange={handleChangeText} />
        <Button variant='default' type='submit' disabled={isLoading}>
          <Icon name={isLoading ? 'LoaderCircle' : 'SendHorizontal'} className={isLoading ? 'animate-spin' : ''} />
        </Button>
      </form>
    </div>
  )
}
