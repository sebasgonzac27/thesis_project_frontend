import { TeamWithLocation } from '@/models'
import { getLocation, getTeams } from '@/services'
import { useEffect, useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useDebounce } from 'use-debounce'
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '../ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination'

export default function TeamsList() {
  const [teams, setTeams] = useState<TeamWithLocation[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [searchInputDebounce] = useDebounce(searchInput, 500)

  // Estados adicionales
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<TeamWithLocation | null>(null)

  useEffect(() => {
    ;(async () => {
      const data = await getTeams()
      const teamsWithLocation = await Promise.all(
        data.map(async team => {
          const location = await getLocation(team.location_id)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { location_id, ...rest } = team
          return { ...rest, location }
        }),
      )
      setTeams(teamsWithLocation)
    })()
  }, []) // Nota: agregar dependencias aquí para evitar ciclos infinitos

  const filteredTeams = useMemo(() => {
    return teams.filter(
      team =>
        team.name.toLowerCase().includes(searchInputDebounce.toLowerCase()) ||
        team.location.name.toLowerCase().includes(searchInputDebounce.toLowerCase()),
    )
  }, [searchInputDebounce, teams])

  const handleSearch = ({ target }: { target: HTMLInputElement }) => {
    setSearchInput(target.value)
  }

  const handleOpenModal = (team: TeamWithLocation | null = null) => {
    if (team) {
      setSelectedTeam(team) // Modo edición
      setIsEditing(true)
    } else {
      setSelectedTeam(null) // Modo creación
      setIsEditing(false)
    }
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setSelectedTeam(null)
    setIsEditing(false)
  }

  const handleSave = () => {
    if (isEditing) {
      // Lógica para editar el equipo
      console.log('Editando equipo:', selectedTeam)
    } else {
      // Lógica para crear un nuevo equipo
      console.log('Creando nuevo equipo')
    }
    handleCloseModal()
  }

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center my-4 gap-2'>
        <Input placeholder='Buscar equipo' className='w-full max-w-56' onChange={handleSearch} value={searchInput} />
        <Button onClick={() => handleOpenModal()}>Crear equipo</Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Id</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.map(team => (
              <TableRow key={team.id}>
                <TableCell>{team.id}</TableCell>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.location.name}</TableCell>
                <TableCell className='flex gap-2 justify-end'>
                  <Button variant='outline' onClick={() => handleOpenModal(team)}>
                    Editar
                  </Button>
                  <Button variant='destructive' onClick={() => console.log('Eliminar equipo', team)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href='#' />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href='#' />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar equipo' : 'Crear equipo'}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {isEditing ? 'Edita la información del equipo.' : 'Completa la información para crear un nuevo equipo.'}
          </DialogDescription>

          {/* Formulario simple para creación/edición */}
          <Input
            placeholder='Nombre del equipo'
            value={selectedTeam?.name || ''}
            onChange={e => setSelectedTeam({ ...selectedTeam!, name: e.target.value })}
            className='mb-4'
          />

          {/* Botón de guardar */}
          <Button onClick={handleSave}>{isEditing ? 'Guardar cambios' : 'Crear equipo'}</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
