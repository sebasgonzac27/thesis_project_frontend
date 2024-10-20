import { getTeams } from '@/services'
import CrudList from '../shared/CrudList'

export default function TeamsList() {
  return (
    <CrudList
      title='Equipos'
      getData={getTeams}
      columns={[
        { key: 'name', label: 'Nombre' },
        { key: 'location_id', label: 'Unicación' },
      ]}
      modalFields={[
        { key: 'name', label: 'Nombre', placeholder: 'Nombre del equipo' },
        { key: 'location_id', label: 'Ubicación', placeholder: 'Unicación del equipo' },
      ]}
      onCreate={data => console.log('Creando equipo:', data)}
      onUpdate={data => console.log('Editando equipo:', data)}
      onDelete={data => console.log('Eliminando equipo:', data)}
    />
  )
}
