import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Navbar,
  Sidebar,
} from '@/components'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
  breadcrumb?: { label: string; href: string }[]
}

export default function RootLayout({ children, breadcrumb }: Props) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className='p-8 pt-16 md:ml-[300px] mx-auto bg-background'>
        {breadcrumb && (
          <Breadcrumb className='mb-4'>
            <BreadcrumbList>
              {breadcrumb.map(({ label, href }, index) => {
                if (index === breadcrumb.length - 1) {
                  return (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )
                }
                return (
                  <>
                    <BreadcrumbItem key={index}>
                      <Link to={href}>{label}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        {children}
      </main>
    </>
  )
}
