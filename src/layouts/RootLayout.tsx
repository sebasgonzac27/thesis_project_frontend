import { Navbar } from '@/components'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className='pt-12'>{children}</main>
    </>
  )
}
