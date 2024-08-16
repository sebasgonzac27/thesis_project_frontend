import { PrivateRoutes, PublicRoutes } from '@/routes'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <>
      <header>
        <nav>
          <Link to={`/${PrivateRoutes.DASHBOARD}`}>Dashboard</Link>
          <Link to={`/${PrivateRoutes.MEMBER}`}>Member</Link>
          <Link to={`/${PublicRoutes.LOGIN}`}>Login</Link>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}
