import { Link } from 'react-router-dom'
import { NavigationMenuLink } from '../ui/navigation-menu'
import { cn } from '@/lib/utils'
import { NavbarItem } from '@/interfaces/shared/navbar'

interface Props {
  navbarItem: NavbarItem
}

export default function NavbarMenuItem({ navbarItem }: Props) {
  const { title, description, href } = navbarItem
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          )}>
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{description}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
