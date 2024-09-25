import React, { useEffect, useRef, useState } from 'react'
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
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
    if (text.trim() === '') return

    setMessages(prevMessages => [...prevMessages, { text, isUser: true }])
    setText('')

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
  }

  return (
    <div className='flex flex-col gap-2 h-screen max-h-[calc(100vh-185px)]'>
      <div className='flex flex-1 flex-col gap-2 overflow-y-auto'>
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
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className='flex gap-2'>
        <Input placeholder='Escriba su mensaje aquí' value={text} onChange={handleChangeText} />
        <Button variant='default' type='submit'>
          <Icon name='SendHorizontal' />
        </Button>
      </form>
    </div>
  )
}
