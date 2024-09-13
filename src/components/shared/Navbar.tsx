import { ModeToggle } from '../ui/mode-toggle'
import Icon from './Icon'
import { Button } from '../ui/button'
import { useDashboardStore } from '@/store/dashboard'

export default function Navbar() {
  const { isOpen, toggleOpen } = useDashboardStore()
  return (
    <header className='fixed z-10 top-0 left-0 h-12 w-full border-b-2 border-accent flex items-center justify-between p-2 bg-background'>
      <div>
        <Button variant='ghost' className='block md:hidden' onClick={toggleOpen}>
          <Icon name={isOpen ? 'X' : 'Menu'} />
        </Button>
      </div>
      <span className='font-extrabold'>Nómadas Urbanos Colombia</span>
      <div className='justify-self-end w-fit'>
        <ModeToggle variant='ghost' />
      </div>
    </header>
  )
}
