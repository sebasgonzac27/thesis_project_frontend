import { MouseEventHandler } from 'react'
import Icon, { IconName } from '../shared/Icon'
import { Card, CardContent } from '../ui/card'

interface Props {
  text: string
  iconName: IconName
  iconColor: string
  onClick: MouseEventHandler<HTMLDivElement>
}

export function ChatbotFastAction({ text, iconName, iconColor, onClick }: Props) {
  return (
    <Card className='hover:bg-accent' onClick={onClick}>
      <CardContent className='flex flex-col gap-3 p-4 justify-center items-center'>
        <Icon name={iconName} color={iconColor} />
        <p className='text-center'>{text}</p>
      </CardContent>
    </Card>
  )
}
