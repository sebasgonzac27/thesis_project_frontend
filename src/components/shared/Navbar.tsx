import Logo from '@/assets/img/logo.webp'
import { PrivateRoutes } from '@/routes'
import { Link, useNavigate } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Icon,
  NavigationMenu,
  NavigationMenuList,
} from '@/components'

import clsx from 'clsx'
import { UserRole } from '@/models'
import { NavbarMenu as NavbarMenuT } from '@/interfaces/shared/navbar'
import NavbarMenu from './NavbarMenu'
import { useState } from 'react'
import { removeCookie } from 'typescript-cookie'
import useUserStore from '@/store/user'

const navbarItems: NavbarMenuT[] = [
  {
    title: 'Pilotos',
    role: UserRole.MEMBER,
    items: [
      { title: 'Eventos', description: 'Los mejores eventos a tu disposición', href: '#' },
      { title: 'Convenios', description: 'Aprovecha los convenios que tenemos para ti', href: '#' },
      { title: 'Publicaciones', description: 'Publicaciones de interés para ti', href: '#' },
      { title: 'PQRS', description: 'Peticiones, quejas, reclamos y sugerencias', href: '#' },
      { title: 'Chatbot', description: 'Habla con nuestro chatbot y resuelve tus dudas', href: '#' },
    ],
  },
  {
    title: 'Líderes',
    role: UserRole.LEADER,
    items: [{ title: 'Eventos', description: 'Los mejores eventos a tu disposición', href: '#' }],
  },
  {
    title: 'Administradores',
    role: UserRole.ADMIN,
    items: [{ title: 'Equipos', description: 'Administra los equipos del club', href: `/${PrivateRoutes.TEAMS}` }],
  },
]

export default function Navbar() {
  const { user, deleteUser } = useUserStore()
  const navigate = useNavigate()
  const { role_id } = user!
  const [open, setOpen] = useState(false)

  // Filtrado de items según el rol
  const filteredNavbarItems = navbarItems.filter(navbarMenu => {
    if (role_id === UserRole.ADMIN) return true // Admin ve todas las opciones
    if (role_id === UserRole.LEADER) return navbarMenu.role !== UserRole.ADMIN // Líder ve las opciones de líder y miembro
    if (role_id === UserRole.MEMBER) return navbarMenu.role === UserRole.MEMBER // Miembro ve solo opciones de miembro
    return false
  })

  const handleLogout = () => {
    removeCookie('access_token')
    removeCookie('refresh_token')
    deleteUser()
    navigate('/')
  }

  return (
    <header className='fixed w-full h-20 flex justify-center border-b-2 border-accent bg-background text-foreground'>
      <div className='w-full h-full max-w-7xl py-4 px-4 md:px-2 flex justify-between items-center'>
        <Link to={`/${PrivateRoutes.HOME}`} className='h-full w-auto'>
          <img src={Logo} alt='Logo' className='h-full w-auto' />
        </Link>
        <NavigationMenu className='hidden md:block'>
          <NavigationMenuList>
            {filteredNavbarItems.map((navbarMenu, index) => (
              <NavbarMenu navbarMenu={navbarMenu} key={index} />
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <Button className='hidden md:block' onClick={handleLogout}>
          Cerrar sesión
        </Button>
        <Button variant='ghost' className='md:hidden' onClick={() => setOpen(!open)}>
          <Icon name={open ? 'X' : 'Menu'} />
        </Button>
      </div>
      <div
        className={clsx(
          'absolute w-screen h-[calc(100vh-80px)] top-20 p-6 bg-background text-foreground duration-300 animate-in flex flex-col justify-between',
          open ? 'left-0' : '-left-full',
        )}>
        <Accordion type='single' collapsible>
          {filteredNavbarItems.map((navbarMenu, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{navbarMenu.title}</AccordionTrigger>
              <AccordionContent>
                <ul className='flex flex-col gap-1'>
                  {navbarMenu.items.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.href}
                        className={clsx(
                          'block w-full space-y-1 rounded-md p-3 no-underline outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        )}>
                        <div className='text-sm font-medium leadin-none'>{item.title}</div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{item.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className='flex flex-col gap-4'>
          <Button className='w-full' variant='secondary'>
            Ver perfil
          </Button>
          <Button className='w-full' onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}
