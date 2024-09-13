import { IconName } from '@/components'
import { UserRole } from '@/models'

interface Route {
  name: string
  path: string
  icon: IconName
}

type SidebarRoutes = Record<UserRole, Route[]>

export const SIDEBAR_ROUTES: SidebarRoutes = {
  [UserRole.ADMIN]: [
    {
      name: 'Inicio',
      path: '/home',
      icon: 'House',
    },
    {
      name: 'Equipos',
      path: '/teams',
      icon: 'ShieldHalf',
    },
    {
      name: 'Eventos',
      path: '/events',
      icon: 'CalendarDays',
    },
  ],
  [UserRole.LEADER]: [
    {
      name: 'Inicio',
      path: '/home',
      icon: 'House',
    },
    {
      name: 'Equipos',
      path: '/teams',
      icon: 'ShieldHalf',
    },
  ],
  [UserRole.MEMBER]: [
    {
      name: 'Inicio',
      path: '/home',
      icon: 'House',
    },
  ],
}
