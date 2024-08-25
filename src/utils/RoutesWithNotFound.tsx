import { NotFoundPage } from '@/pages'
import { ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'

interface Props {
  children: ReactNode
}

export function RoutesWithNotFound({ children }: Props) {
  return (
    <Routes>
      {children}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}
