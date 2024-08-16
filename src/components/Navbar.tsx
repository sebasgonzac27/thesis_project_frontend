import {
  Navbar as NavbarUI,
  NavbarBrand,
  NavbarContent,
  Dropdown,
  NavbarItem,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'

export default function Navbar() {
  return (
    <NavbarUI className='w-full bg-red-600'>
      <NavbarBrand>
        <img src='img/logo.webp' width={80} height={80} />
        <p>Nómadas Urbanos Col</p>
      </NavbarBrand>
      <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button>Features</Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu>
            <DropdownItem>Usage Metrics</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </NavbarUI>
  )
}
