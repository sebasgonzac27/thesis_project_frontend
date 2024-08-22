import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

export default function useShowPassword() {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const toggleShowPassword = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const passwordProperties = useMemo(
    () => ({
      typeInput: showPassword ? 'text' : 'password',
      icon: showPassword ? EyeOffIcon : EyeIcon,
      tooltipText: showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña',
    }),
    [showPassword],
  )

  return { toggleShowPassword, passwordProperties }
}
