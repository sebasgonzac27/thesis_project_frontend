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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import clsx from 'clsx'
import { useDebounceValue } from '@/hooks/useDebounce'
import { getPages } from '@/utils/get-pages'
import { Pagination as PaginationT } from '@/interfaces/pagination'

interface CrudListProps<T> {
  title: string
  getData: (params: { skip: number; limit: number; filter: string }) => Promise<{ data: T[]; pagination: PaginationT }>
  columns: { label: string; key: keyof T }[]
  renderActions?: (item: T) => JSX.Element
  onCreate: (data: Partial<T>) => void
  onUpdate: (data: T) => void
  onDelete: (data: T) => void
  modalFields: { label: string; key: keyof T; placeholder: string }[]
}

export default function CrudList<T>({
  title,
  getData,
  columns,
  renderActions,
  onCreate,
  onUpdate,
  onDelete,
  modalFields,
}: CrudListProps<T>) {
  const [items, setItems] = useState<T[]>([])
  const [pagination, setPagination] = useState<PaginationT>()
  const {
    value: searchInput,
    debouncedValue: searchInputDebounced,
    setValue: setSearchInput,
  } = useDebounceValue<string>('')

  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [resultsPerPage, setResultsPerPage] = useState<number>(5)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchInputDebounced, resultsPerPage])

  useEffect(() => {
    ;(async () => {
      const { data, pagination } = await getData({
        skip: (currentPage - 1) * resultsPerPage,
        limit: resultsPerPage,
        filter: `name=${searchInputDebounced}`,
      })
      setItems(data)
      setPagination(pagination)
    })()
  }, [currentPage, searchInputDebounced, resultsPerPage, getData])

  const pages = useMemo(() => {
    return pagination ? getPages(pagination.total_pages, pagination.current_page) : []
  }, [pagination])

  const handleSearch = ({ target }: { target: HTMLInputElement }) => {
    setSearchInput(target.value)
  }

  const handleSelectPage = (page: number) => {
    setCurrentPage(page)
  }

  const handleOpenModal = (item: T | null = null) => {
    if (item) {
      setSelectedItem(item)
      setIsEditing(true)
    } else {
      setSelectedItem(null)
      setIsEditing(false)
    }
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setSelectedItem(null)
    setIsEditing(false)
  }

  const handleSave = () => {
    if (isEditing && selectedItem) {
      onUpdate(selectedItem)
    } else {
      onCreate(selectedItem!)
      onDelete(selectedItem!)
    }
    handleCloseModal()
  }

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center my-4 gap-2'>
        <Input placeholder='Buscar' className='w-full max-w-56' onChange={handleSearch} value={searchInput} />
        <div className='flex items-center gap-2'>
          <Select value={resultsPerPage.toString()} onValueChange={value => setResultsPerPage(Number(value))}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Mostrar' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='15'>15</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='25'>25</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleOpenModal()}>Crear {title}</Button>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, idx) => (
                <TableHead key={idx}>{column.label}</TableHead>
              ))}
              {renderActions && <TableHead>Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={idx}>
                {columns.map((column, colIdx) => (
                  <TableCell key={colIdx}>{String(item[column.key])}</TableCell>
                ))}
                {renderActions && <TableCell className='flex gap-2 justify-end'>{renderActions(item)}</TableCell>}
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
            Mostrando <b>{items.length}</b> de <b>{pagination?.total_records}</b> resultados
          </p>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? `Editar ${title}` : `Crear ${title}`}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {isEditing ? `Edita la información del ${title}.` : `Completa la información para crear un nuevo ${title}.`}
          </DialogDescription>
          {modalFields.map((field, idx) => (
            <Input
              key={idx}
              placeholder={field.placeholder}
              value={selectedItem ? (selectedItem[field.key] as unknown as string) : ''}
              onChange={e => setSelectedItem({ ...(selectedItem as T), [field.key]: e.target.value })}
              className='mb-4'
            />
          ))}
          <Button onClick={handleSave}>{isEditing ? 'Guardar cambios' : 'Crear'}</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
