import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from '../ui/navigation-menu'
import type { NavbarMenu } from '@/interfaces/shared/navbar'
import NavbarMenuItem from './NavbarMenuItem'

interface Props {
  navbarMenu: NavbarMenu
}

export default function NavbarMenu({ navbarMenu }: Props) {
  const { title, items } = navbarMenu
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
          {items.map((item, index) => (
            <NavbarMenuItem navbarItem={item} key={index} />
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
