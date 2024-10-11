import { useState } from 'react'
import { useDebounce } from 'use-debounce'

export function useDebounceValue<T>(initialValue: T, time: number = 500) {
  const [value, setValue] = useState<T>(initialValue)
  const [debouncedValue] = useDebounce(value, time)

  return { value, debouncedValue, setValue }
}
