import { icons } from 'lucide-react'

export type IconName = keyof typeof icons

interface Props {
  name: IconName
  color?: string
  size?: number
}

export default function Icon({ name, color, size }: Props) {
  const LucideIcon = icons[name]

  return <LucideIcon color={color} size={size} />
}
