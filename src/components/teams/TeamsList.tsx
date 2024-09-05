import { Team } from '@/models'
import { getTeams } from '@/services'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'

export default function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    ;(async () => {
      const data = await getTeams()
      setTeams(data)
    })()
  })

  return (
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
        {teams.map(team => (
          <TableRow key={team.id}>
            <TableCell>{team.id}</TableCell>
            <TableCell>{team.name}</TableCell>
            <TableCell>{team.location_id}</TableCell>
            <TableCell className='flex gap-2 justify-end'>
              <Button variant='outline'>Editar</Button>
              <Button variant='destructive'>Eliminar</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
