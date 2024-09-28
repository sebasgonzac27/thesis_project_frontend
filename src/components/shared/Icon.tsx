import { icons } from 'lucide-react'

export type IconName = keyof typeof icons

interface Props {
  name: IconName
  color?: string
  size?: number
  className?: string
}

export default function Icon({ name, color, size, className }: Props) {
  const LucideIcon = icons[name]

  return <LucideIcon color={color} size={size} className={className} />
}
