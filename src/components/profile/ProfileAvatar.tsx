import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getAvatar } from '@/utils'
import { UserWithProfile } from '@/models'
import Icon from '../shared/Icon'
import { getMembershipCard } from '@/services'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'

interface Props {
  user: UserWithProfile
}

export default function ProfileAvatar({ user }: Readonly<Props>) {
  const handleGetMembershipCard = async (format: 'PNG' | 'PDF' = 'PNG') => {
    try {
      const data = await getMembershipCard(user.id, format)
      const url = URL.createObjectURL(data)

      if (format === 'PDF') {
        const pdfVentana = window.open('', '_blank')
        if (pdfVentana) {
          pdfVentana.document.title = 'Previsualización de PDF'
          pdfVentana.location.href = url
        } else {
          toast.error('La ventana emergente fue bloqueada por el navegador.')
        }
      } else {
        const imagenVentana = window.open('', '_blank')
        if (imagenVentana) {
          imagenVentana.document.title = 'Previsualización de Imagen'
          imagenVentana.document.body.style.margin = '0'
          imagenVentana.document.body.innerHTML = `<img src="${url}" alt="Previsualización de imagen" style="width: 50%; height: auto;" />`
        } else {
          toast.error('La ventana emergente fue bloqueada por el navegador.')
        }
      }
    } catch {
      toast.error('No se pudo obtener el carnet')
    }
  }

  return (
    <div className='flex flex-col md:flex-row items-center gap-2 md:gap-5'>
      <Avatar className='size-20 md:size-32 shadow-lg'>
        <AvatarImage src={getAvatar(user?.email || '')} />
      </Avatar>
      <div className='flex flex-col text-center md:text-start md:flex-1'>
        <h2 className='text-2xl md:text-3xl font-bold'>
          {user?.profile.nickname ?? `${user?.profile.first_name} ${user?.profile.last_name}`}
        </h2>
        {user?.profile.nickname && (
          <h3 className='text-xl md:text-2xl text-pretty'>{`${user?.profile.first_name} ${user?.profile.last_name}`}</h3>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className='w-full md:max-w-64'>
            <Icon name='IdCard' size={20} />
            <span className='ml-2'>Obtener mi carnet</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleGetMembershipCard('PNG')}>Imagen (.png)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleGetMembershipCard('PDF')}>Documento (.pdf)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
