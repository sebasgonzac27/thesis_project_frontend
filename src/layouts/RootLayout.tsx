import { PrivateRoutes, PublicRoutes } from '@/routes'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <>
      <header className='fixed w-full h-12 bg-slate-400 flex justify-center items-center'>
        <nav className='flex gap-4'>
          <Link to={`/${PrivateRoutes.DASHBOARD}`}>Dashboard</Link>
          <Link to={`/${PrivateRoutes.MEMBER}`}>Member</Link>
          <Link to={`/${PublicRoutes.LOGIN}`}>Login</Link>
        </nav>
      </header>
      <main className='pt-12'>{children}</main>
    </>
  )
}
