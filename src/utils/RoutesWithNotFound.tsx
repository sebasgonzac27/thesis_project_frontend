import { ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'

interface Props {
  children: ReactNode
}

export function RoutesWithNotFound({ children }: Props) {
  return (
    <Routes>
      {children}
      <Route path='*' element={<h1>Not Found</h1>} />
    </Routes>
  )
}
