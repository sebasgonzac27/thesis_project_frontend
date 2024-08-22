import { ModeToggle } from '@/components'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <main className='w-full min-h-dvh flex justify-center items-center p-2'>
      {children}
      <div className='fixed right-2 bottom-2'>
        <ModeToggle />
      </div>
    </main>
  )
}
