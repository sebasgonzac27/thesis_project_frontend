import { UserWithProfile } from '@/models'
import { getUsers } from '@/services'
import React, { useCallback, useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { ArrowUpDown } from 'lucide-react'
import { getAvatar } from '@/utils'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { PrivateRoutes } from '@/routes'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Alert } from '../ui/alert'
import { Badge } from '../ui/badge'

const ROLES = {
  1: 'Administrador',
  2: 'Líder',
  3: 'Piloto',
} as const

const STATUSES = {
  ['activo']: 'Activo',
  ['inactivo']: 'Inactivo',
} as const

type SortField = 'first_name' | 'last_name' | 'nickname' | 'email'
type SortOrder = 'asc' | 'desc'

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

interface Props {
  team_id?: number
}

export default function UsersList({ team_id = undefined }: Readonly<Props>) {
  const [users, setUsers] = useState<UserWithProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserWithProfile[]>([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('first_name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const navigate = useNavigate()

  const goToUser = useCallback((id: UserWithProfile['id']) => {
    navigate(`/${PrivateRoutes.PROFILE}/${id}`)
  }, [])

  const resetUsers = useCallback(() => {
    setFilteredUsers(users)
    setSearch('')
    setSortOrder('asc')
    setSortField('first_name')
  }, [users, setFilteredUsers])

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers()
      return fetchedUsers
    }

    fetchUsers().then(fetchUsers => {
      const usersByTeam = team_id ? fetchUsers.data.filter(user => user.profile.team_id === team_id) : fetchUsers.data
      setUsers(usersByTeam)
      setFilteredUsers(usersByTeam)
    })
  }, [])

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!search) {
      resetUsers()
      return
    }

    const newFilteredUsers = filteredUsers.filter(user =>
      [user.email, user.profile.first_name, user.profile.last_name, user.profile.nickname].some(value =>
        value?.toLowerCase().includes(search.toLowerCase()),
      ),
    )
    setFilteredUsers(newFilteredUsers)
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
    const sortData = () => {
      return [...filteredUsers].sort((a, b) => {
        let compareA: string | number | Date | boolean
        let compareB: string | number | Date | boolean

        switch (sortField) {
          case 'first_name':
            compareA = a.profile.first_name.toLowerCase()
            compareB = b.profile.first_name.toLowerCase()
            break
          case 'last_name':
            compareA = a.profile.last_name.toLowerCase()
            compareB = b.profile.last_name.toLowerCase()
            break
          case 'nickname':
            compareA = (a.profile.nickname ?? '').toLowerCase()
            compareB = (b.profile.nickname ?? '').toLowerCase()
            break
          case 'email':
            compareA = a.email.toLowerCase()
            compareB = b.email.toLowerCase()
            break
          default:
            return 0
        }

        if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1
        if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    setFilteredUsers(sortData())
  }, [sortField, sortOrder])

  return (
    <main>
      <div className='w-fit mb-4 inline-flex gap-2'>
        <form className='inline-flex gap-2' onSubmit={onSearch}>
          <Input placeholder='Buscar...' name='search' value={search} onChange={e => setSearch(e.target.value)} />
          <Button>Buscar</Button>
        </form>
        <Button variant='outline' onClick={resetUsers}>
          Limpiar filtros
        </Button>
      </div>
      {filteredUsers.length > 0 ? (
        <div className='border rounded-lg'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <SortableHeader field='first_name' onSort={handleSort}>
                  Nombre
                </SortableHeader>
                <SortableHeader field='last_name' onSort={handleSort}>
                  Apellido
                </SortableHeader>
                <SortableHeader field='nickname' onSort={handleSort}>
                  Apodo
                </SortableHeader>
                <SortableHeader field='email' onSort={handleSort}>
                  Correo
                </SortableHeader>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id} className='hover:bg-gray-100 cursor-pointer' onClick={() => goToUser(user.id)}>
                  <TableCell>
                    <img
                      src={getAvatar(user.email)}
                      alt={`${user.profile.first_name} avatar`}
                      className='h-6 w-6 border rounded-full'
                    />
                  </TableCell>
                  <TableCell>{user.profile.first_name}</TableCell>
                  <TableCell>{user.profile.last_name}</TableCell>
                  <TableCell>{user.profile.nickname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{ROLES[user.role_id]}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'activo' ? 'default' : 'secondary'}>{STATUSES[user.status]}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Alert className='border-info text-info'>No se encontraron usuarios</Alert>
      )}
    </main>
  )
}
