import { Motorcycle } from '@/models/motorcycle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import Icon from '../shared/Icon'
import { useEffect, useState } from 'react'
import { getBrand } from '@/services/brand'
import { Brand } from '@/models'

interface Props {
  motorcycle: Motorcycle
}

export default function ProfileMotorcycleCard({ motorcycle }: Readonly<Props>) {
  const [brand, setBrand] = useState<Brand>()

  useEffect(() => {
    ;(async () => {
      const brand = await getBrand(motorcycle.brand_id)
      setBrand(brand)
    })()
  }, [motorcycle])

  return (
    <Card className='hover:bg-accent p-2 min-w-40'>
      <CardHeader>
        <Icon name='Bike' size={50} className='mx-auto' />
        <CardTitle className='text-xl text-center font-bold'>
          {motorcycle.license_plate.replace(/([A-Za-z]+)(\d+)([A-Za-z]*)/, '$1 $2$3')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-primary font-bold'>{brand?.name}</CardDescription>
        <CardDescription className='text-foreground'>{motorcycle.model}</CardDescription>
      </CardContent>
    </Card>
  )
}
