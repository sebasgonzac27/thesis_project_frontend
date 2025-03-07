import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Agreement, Company, UserRole } from '@/models'
import { agreementService, companyService } from '@/services'
import useUserStore from '@/store/user'
import { format } from '@formkit/tempo'
import { X, ArrowUpDown } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import CompanyModal from './CompanyModal'
import { useAppStore } from '@/store/app'

type StatusFilter = 'all' | 'active' | 'inactive'
type SortField = 'name' | 'company' | 'start_date' | 'end_date' | 'active'
type SortOrder = 'asc' | 'desc'
type ModalType = 'view' | 'edit' | 'create' | null

interface SortableHeaderProps {
  field: SortField
  children: React.ReactNode
  onSort: (field: SortField) => void
}

const SortableHeader = ({ field, children, onSort }: SortableHeaderProps) => (
  <TableHead>
    <button
      className='flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300'
      onClick={() => onSort(field)}>
      {children}
      <ArrowUpDown className='h-4 w-4' />
    </button>
  </TableHead>
)

export default function AgreementList() {
  const navigate = useNavigate()
  const { user } = useUserStore()
  const { role_selected } = useAppStore()

  const isAdmin = useMemo(() => {
    return [UserRole.ADMIN, UserRole.LEADER].includes(role_selected!)
  }, [role_selected])

  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState<string | undefined>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>(null)
  const [currentAgreement, setCurrentAgreement] = useState<Partial<Agreement> | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const filterByStatus = (data: Agreement[]) => {
    switch (statusFilter) {
      case 'active':
        return data.filter(agreement => agreement.active)
      case 'inactive':
        return data.filter(agreement => !agreement.active)
      default:
        return data
    }
  }

  const sortData = (data: Agreement[]) => {
    const filteredData = filterByStatus(data)
    return [...filteredData].sort((a, b) => {
      let compareA: string | number | Date | boolean
      let compareB: string | number | Date | boolean

      switch (sortField) {
        case 'name':
          compareA = a.name.toLowerCase()
          compareB = b.name.toLowerCase()
          break
        case 'company':
          compareA = companies.find(c => c.id === a.company_id)?.name.toLowerCase() ?? ''
          compareB = companies.find(c => c.id === b.company_id)?.name.toLowerCase() ?? ''
          break
        case 'start_date':
          compareA = new Date(a.start_date)
          compareB = new Date(b.start_date)
          break
        case 'end_date':
          compareA = new Date(a.end_date)
          compareB = new Date(b.end_date)
          break
        case 'active':
          compareA = a.active
          compareB = b.active
          break
        default:
          return 0
      }

      if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1
      if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  useEffect(() => {
    loadAgreements()
    loadCompanies()
  }, [])

  const loadAgreements = async (searchValue?: string) => {
    try {
      setLoading(true)
      const response = await agreementService.getAgreements({
        filter: searchValue ? `name=${searchValue}` : undefined,
      })
      setAgreements(response.data)
    } catch (error) {
      toast.error('Error al cargar los convenios')
    } finally {
      setLoading(false)
    }
  }

  const loadCompanies = async () => {
    try {
      const response = await companyService.getCompanies()
      setCompanies(response.data)
    } catch (error) {
      toast.error('Error al cargar las empresas')
    }
  }

  const handleOpenModal = (agreement?: Agreement, type: ModalType = 'create') => {
    if (type === 'edit' || type === 'view') {
      setCurrentAgreement(
        agreement
          ? {
              ...agreement,
              // Convert string dates to Date objects
              start_date: new Date(agreement.start_date),
              end_date: new Date(agreement.end_date),
            }
          : null,
      )
    } else {
      setCurrentAgreement({
        name: '',
        description: '',
        start_date: new Date(),
        end_date: new Date(),
        active: true,
        company_id: undefined,
      })
    }
    setModalType(type)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setCurrentAgreement(null)
    setModalType(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentAgreement) return

    try {
      if (modalType === 'edit' && currentAgreement.id) {
        await agreementService.updateAgreement(currentAgreement.id, currentAgreement)
        toast.success('Convenio actualizado exitosamente')
      } else {
        await agreementService.createAgreement(currentAgreement)
        toast.success('Convenio creado exitosamente')
      }
      handleCloseModal()
      loadAgreements()
    } catch (error) {
      toast.error(modalType === 'edit' ? 'Error al actualizar el convenio' : 'Error al crear el convenio')
    }
  }

  const handleDelete = async (agreement: Agreement) => {
    if (!confirm('¿Está seguro de eliminar este convenio?')) return

    try {
      await agreementService.deleteAgreement(agreement.id!)
      toast.success('Convenio eliminado exitosamente')
      loadAgreements()
    } catch (error) {
      toast.error('Error al eliminar el convenio')
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      loadAgreements(searchTerm)
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    loadAgreements()
  }

  const renderModalContent = () => {
    if (!currentAgreement) return null

    const isViewOnly = modalType === 'view'
    const company = companies.find(c => c.id === currentAgreement.company_id)

    const content = isViewOnly ? (
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label>Nombre</Label>
          <div className='p-2 bg-secondary rounded-md'>{currentAgreement.name}</div>
        </div>
        <div className='space-y-2'>
          <Label>Descripción</Label>
          <div className='p-2 bg-secondary rounded-md'>{currentAgreement.description}</div>
        </div>
        <div className='space-y-2'>
          <Label>Empresa</Label>
          <div className='p-2 bg-secondary rounded-md'>{company?.name}</div>
        </div>
        <div className='space-y-2'>
          <Label>Datos de contacto de la empresa</Label>
          <div className='p-2 bg-secondary rounded-md'>
            <b>Persona de contacto:</b> {company?.contact_name} <br />
            <b>Teléfono:</b> {company?.contact_telephone} <br />
            <b>Dirección:</b> {company?.contact_address} <br />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label>Fecha Inicio</Label>
            <div className='p-2 bg-secondary rounded-md'>{format(currentAgreement.start_date!, 'long')}</div>
          </div>
          <div className='space-y-2'>
            <Label>Fecha Fin</Label>
            <div className='p-2 bg-secondary rounded-md'>{format(currentAgreement.end_date!, 'long')}</div>
          </div>
        </div>
        <div className='space-y-2'>
          <Label>Estado</Label>
          <div className='p-2'>
            <Badge variant={currentAgreement.active ? 'default' : 'secondary'}>
              {currentAgreement.active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Nombre</Label>
          <Input
            id='name'
            value={currentAgreement.name ?? ''}
            onChange={e => setCurrentAgreement(prev => ({ ...prev!, name: e.target.value }))}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='description'>Descripción</Label>
          <Input
            id='description'
            value={currentAgreement.description ?? ''}
            onChange={e => setCurrentAgreement(prev => ({ ...prev!, description: e.target.value }))}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='company'>Empresa</Label>
          <Select
            value={currentAgreement.company_id?.toString()}
            onValueChange={value => setCurrentAgreement(prev => ({ ...prev!, company_id: Number(value) }))}>
            <SelectTrigger>
              <SelectValue placeholder='Seleccionar empresa' />
            </SelectTrigger>
            <SelectContent>
              {companies.map(company => (
                <SelectItem key={company.id} value={company.id!.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='start_date'>Fecha Inicio</Label>
            <Input
              id='start_date'
              type='date'
              value={currentAgreement.start_date?.toISOString().split('T')[0] ?? ''}
              onChange={e => setCurrentAgreement(prev => ({ ...prev!, start_date: new Date(e.target.value) }))}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='end_date'>Fecha Fin</Label>
            <Input
              id='end_date'
              type='date'
              value={currentAgreement.end_date?.toISOString().split('T')[0] ?? ''}
              onChange={e => setCurrentAgreement(prev => ({ ...prev!, end_date: new Date(e.target.value) }))}
              required
            />
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='active'>Estado</Label>
          <Select
            value={currentAgreement.active?.toString()}
            onValueChange={value => setCurrentAgreement(prev => ({ ...prev!, active: value === 'true' }))}>
            <SelectTrigger>
              <SelectValue placeholder='Seleccionar estado' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='true'>Activo</SelectItem>
              <SelectItem value='false'>Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>
    )

    return <ScrollArea className='max-h-[60vh] px-1'>{content}</ScrollArea>
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  const sortedAgreements = sortData(agreements)

  return (
    <div className='space-y-4'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
        <div className='flex  items-center gap-4'>
          <div className='relative'>
            <Input
              placeholder='Buscar convenios...'
              value={searchTerm ?? ''}
              onChange={handleSearch}
              onKeyDown={handleKeyPress}
              className='pr-8'
            />
            {searchTerm && (
              <Button
                variant='ghost'
                size='sm'
                className='absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0'
                onClick={handleClearSearch}>
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
          <Button onClick={() => loadAgreements()}>Buscar</Button>
        </div>
        {isAdmin && (
          <div className='flex gap-2'>
            <CompanyModal onCompanyCreated={loadCompanies} />
            <Button onClick={() => handleOpenModal(undefined, 'create')}>Nuevo Convenio</Button>
          </div>
        )}
      </div>

      <div className='mb-4'>
        <RadioGroup
          defaultValue='all'
          className='flex items-center space-x-4'
          onValueChange={value => setStatusFilter(value as StatusFilter)}>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='all' id='all' />
            <Label htmlFor='all'>Todos</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='active' id='active' />
            <Label htmlFor='active'>Activos</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='inactive' id='inactive' />
            <Label htmlFor='inactive'>Inactivos</Label>
          </div>
        </RadioGroup>
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field='name' onSort={handleSort}>
                Nombre
              </SortableHeader>
              <SortableHeader field='company' onSort={handleSort}>
                Empresa
              </SortableHeader>
              <SortableHeader field='start_date' onSort={handleSort}>
                Fecha Inicio
              </SortableHeader>
              <SortableHeader field='end_date' onSort={handleSort}>
                Fecha Fin
              </SortableHeader>
              <SortableHeader field='active' onSort={handleSort}>
                Estado
              </SortableHeader>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAgreements.map(agreement => (
              <TableRow key={agreement.id}>
                <TableCell className='font-medium'>{agreement.name}</TableCell>
                <TableCell>{companies.find(c => c.id === agreement.company_id)?.name}</TableCell>
                <TableCell>{format(agreement.start_date, 'long')}</TableCell>
                <TableCell>{format(agreement.end_date, 'long')}</TableCell>
                <TableCell>
                  <Badge variant={agreement.active ? 'default' : 'secondary'}>
                    {agreement.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button variant='outline' size='sm' onClick={() => handleOpenModal(agreement, 'view')}>
                      Ver
                    </Button>
                    {isAdmin && (
                      <>
                        <Button variant='outline' size='sm' onClick={() => handleOpenModal(agreement, 'edit')}>
                          Editar
                        </Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(agreement)}>
                          Eliminar
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {modalType === 'view' && 'Detalles del Convenio'}
              {modalType === 'edit' && 'Editar Convenio'}
              {modalType === 'create' && 'Nuevo Convenio'}
            </DialogTitle>
          </DialogHeader>
          {renderModalContent()}
          <DialogFooter>
            {modalType === 'view' ? (
              <Button onClick={handleCloseModal}>Cerrar</Button>
            ) : (
              <>
                <Button type='button' variant='outline' onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>{modalType === 'edit' ? 'Guardar cambios' : 'Crear convenio'}</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <Skeleton className='h-10 w-[300px]' />
        <Skeleton className='h-10 w-[150px]' />
      </div>
      <div className='border rounded-lg'>
        <div className='p-4'>
          {[1, 2, 3, 4].map(index => (
            <div key={index} className='flex justify-between items-center py-2'>
              <Skeleton className='h-6 w-1/4' />
              <Skeleton className='h-6 w-1/4' />
              <Skeleton className='h-6 w-1/6' />
              <Skeleton className='h-6 w-1/6' />
              <Skeleton className='h-6 w-[100px]' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
