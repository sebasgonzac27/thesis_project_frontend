import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AgreementWithDetails } from '@/models'
import { agreementService } from '@/services'
import { toast } from 'sonner'
import { format } from '@formkit/tempo'


export default function AgreementDetails() {
  const { id } = useParams()
  const [agreement, setAgreement] = useState<AgreementWithDetails>()

  useEffect(() => {
    if (id) {
      agreementService.getAgreement(Number(id))
        .then(setAgreement)
        .catch(() => toast.error('Error al cargar el convenio'))
    }
  }, [id])

  if (!agreement) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {agreement.name}
          <Badge variant={agreement.active ? "default" : "secondary"}>
            {agreement.active ? "Activo" : "Inactivo"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Descripción</h3>
            <p>{agreement.description}</p>
          </div>
          <div>
            <h3 className="font-semibold">Empresa</h3>
            <p>{agreement.company.name}</p>
            <p>Contacto: {agreement.company.contact_name}</p>
            <p>Teléfono: {agreement.company.contact_telephone}</p>
          </div>
          <div>
            <h3 className="font-semibold">Fecha de inicio</h3>
            <p>{format(agreement.start_date, 'long')}</p>
          </div>
          <div>
            <h3 className="font-semibold">Fecha de fin</h3>
            <p>{format(agreement.end_date, 'long')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
