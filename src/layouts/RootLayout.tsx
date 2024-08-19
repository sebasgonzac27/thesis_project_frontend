import { ModeToggle, Navbar } from '@/components'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className='pt-28 max-w-7xl mx-auto px-4'>
        {children}
        <div className='fixed right-2 bottom-2'>
          <ModeToggle />
        </div>
      </main>
    </>
  )
}
