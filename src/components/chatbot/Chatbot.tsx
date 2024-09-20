import React, { useState } from 'react'
import Icon from '../shared/Icon'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { sendMessage } from '@/services'
import { AxiosError } from 'axios'
import clsx from 'clsx'

interface Message {
  text: string
  isUser: boolean
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (text.trim() === '') return

    // Agregamos el mensaje del usuario
    setMessages(prevMessages => [...prevMessages, { text, isUser: true }])
    setText('')

    try {
      const response = await sendMessage(text)

      // Agregamos el mensaje de respuesta del chat
      setMessages(prevMessages => [...prevMessages, { text: response.message, isUser: false }])
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
    <div className='flex flex-col h-full max-h-full gap-4'>
      {/* Contenedor de mensajes */}
      <div className='flex-grow overflow-y-auto min-h-0'>
        <div className='flex flex-col justify-end h-full gap-2'>
          {messages.map(({ text, isUser }, index) => (
            <div
              key={index}
              className={clsx('p-2 rounded-lg max-w-md break-words', {
                'bg-primary text-white self-end': isUser,
                'bg-gray-200 text-black self-start': !isUser,
              })}>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Input y botón */}
      <form onSubmit={handleSendMessage} className='flex gap-2'>
        <Input placeholder='Escriba su mensaje aquí' value={text} onChange={handleChangeText} className='flex-grow' />
        <Button variant='default' type='submit'>
          <Icon name='SendHorizontal' />
        </Button>
      </form>
    </div>
  )
}
