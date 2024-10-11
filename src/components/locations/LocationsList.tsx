import { Location } from '@/models'
import { getLocations } from '@/services'
import { useEffect, useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
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
import { Pagination as PaginationT } from '@/interfaces/pagination'
import { useDebounceValue } from '@/hooks/useDebounce'
import { getPages } from '@/utils/get-pages'
import clsx from 'clsx'

export default function LocationsList() {
  const [locations, setLocations] = useState<Location[]>([])
  const [pagination, setPagination] = useState<PaginationT>()

  const {
    value: searchInput,
    debouncedValue: searchInputDebounced,
    setValue: setSearchInput,
  } = useDebounceValue<string>('')

  // Estados adicionales
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const limit = 5

  useEffect(() => {
    setCurrentPage(1)
  }, [searchInput])

  useEffect(() => {
    console.log({ currentPage })
    ;(async () => {
      const { data, pagination } = await getLocations({
        skip: (currentPage - 1) * limit,
        limit,
        filter: `name=${searchInput}`,
      })
      setLocations(data)
      setPagination(pagination)
    })()
  }, [currentPage, searchInput])

  const pages = useMemo(() => {
    return pagination ? getPages(pagination.total_pages, pagination.current_page) : []
  }, [pagination])

  const filteredTeams = useMemo(() => {
    return locations.filter(location => location.name.toLowerCase().includes(searchInputDebounced.toLowerCase()))
  }, [searchInputDebounced, locations])

  const handleSearch = ({ target }: { target: HTMLInputElement }) => {
    setSearchInput(target.value)
  }

  const handleSelectPage = (page: number) => {
    setCurrentPage(page)
  }

  const handleOpenModal = (location: Location | null = null) => {
    if (location) {
      setSelectedLocation(location) // Modo edición
      setIsEditing(true)
    } else {
      setSelectedLocation(null) // Modo creación
      setIsEditing(false)
    }
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setSelectedLocation(null)
    setIsEditing(false)
  }

  const handleSave = () => {
    if (isEditing) {
      // Lógica para editar el equipo
      console.log('Editando equipo:', selectedLocation)
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
              <TableHead>Tipo</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.map(location => (
              <TableRow key={location.id}>
                <TableCell>{location.id}</TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.type}</TableCell>
                <TableCell className='flex gap-2 justify-end'>
                  <Button variant='outline' onClick={() => handleOpenModal(location)}>
                    Editar
                  </Button>
                  <Button variant='destructive' onClick={() => console.log('Eliminar equipo', location)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex flex-col items-center justify-center gap-4'>
          {pagination && pagination?.total_pages > 1 && (
            <Pagination>
              <PaginationContent>
                {pagination?.prev_page && (
                  <PaginationItem className='cursor-pointer' onClick={() => handleSelectPage(currentPage - 1)}>
                    <PaginationPrevious />
                  </PaginationItem>
                )}
                {pages.map((page, index) =>
                  page === '...' ? (
                    <PaginationItem key={index}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem
                      key={index}
                      className={clsx('cursor-pointer', { 'bg-accent rounded-md': currentPage === page })}
                      onClick={() => handleSelectPage(page as number)}>
                      <PaginationLink>{page}</PaginationLink>
                    </PaginationItem>
                  ),
                )}
                {pagination?.next_page && (
                  <PaginationItem className='cursor-pointer' onClick={() => handleSelectPage(currentPage + 1)}>
                    <PaginationNext />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
          <p className='text-sm'>
            Mostrando <b>{locations.length}</b> de <b>{pagination?.total_records}</b> resultados
          </p>
        </div>
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
            value={selectedLocation?.name || ''}
            onChange={e => setSelectedLocation({ ...selectedLocation!, name: e.target.value })}
            className='mb-4'
          />

          {/* Botón de guardar */}
          <Button onClick={handleSave}>{isEditing ? 'Guardar cambios' : 'Crear equipo'}</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
