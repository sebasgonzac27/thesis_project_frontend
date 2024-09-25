import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Navbar,
  Sidebar,
} from '@/components'
import { SIDEBAR_ROUTES } from '@/routes/sidebar'
import { ReactNode } from 'react'
import { Link, useResolvedPath } from 'react-router-dom'

interface Props {
  title?: string
  children: ReactNode
  withBreadcrumb?: boolean
}

export default function RootLayout({ title, children, withBreadcrumb = false }: Props) {
  const { pathname } = useResolvedPath({})
  const path = pathname.split('/').filter(Boolean)
  const breadcrumb = ['home', ...path]

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className='p-8 pt-16 md:ml-[300px] mx-auto bg-background min-h-screen'>
        <div>
          {title && <h1 className='font-bold text-3xl'>{title}</h1>}
          {withBreadcrumb && breadcrumb && (
            <Breadcrumb className='my-4'>
              <BreadcrumbList>
                {breadcrumb.map((href, index) => {
                  const label = SIDEBAR_ROUTES.find(route => route.path.includes(href))?.name || href
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
                        <Link to={`/${href}`}>{label}</Link>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        {children}
      </main>
    </>
  )
}
