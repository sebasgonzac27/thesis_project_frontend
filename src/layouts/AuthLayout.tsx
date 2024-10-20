import { ModeToggle } from '@/components'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <main className='w-full min-h-dvh flex justify-center items-center p-4'>
      {children}
      <div className='fixed right-2 top-2'>
        <ModeToggle />
      </div>
    </main>
  )
}
