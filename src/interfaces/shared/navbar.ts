import { UserRole } from '@/models'

export interface NavbarMenu {
  title: string
  role: UserRole
  items: NavbarItem[]
}

export interface NavbarItem {
  title: string
  description: string
  href: string
}
