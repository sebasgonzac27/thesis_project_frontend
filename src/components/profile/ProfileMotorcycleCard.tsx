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
    console.log(motorcycle)
    ;(async () => {
      const brand = await getBrand(motorcycle.brand_id)
      console.log(brand)
      setBrand(brand)
    })()
  }, [motorcycle])

  return (
    <Card className='hover:bg-accent p-2 max-w-40'>
      <CardHeader>
        <Icon name='Bike' size={50} className='mx-auto' />
        <CardTitle className='text-xl text-center font-bold'>
          {motorcycle.license_plate.replace(/([A-Za-z]+)(\d+)([A-Za-z]*)/, '$1 $2$3')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <p className='text-primary font-bold'>{brand?.name}</p>
          <p className='text-foreground'>{motorcycle.model}</p>
        </CardDescription>
      </CardContent>
    </Card>
  )
}
