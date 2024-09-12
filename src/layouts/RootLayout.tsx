import { Navbar, Sidebar } from '@/components'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className='p-10 pt-16 md:ml-[300px] mx-auto bg-background'>{children}</main>
    </>
  )
}
