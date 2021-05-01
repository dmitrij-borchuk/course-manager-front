import { useMemo, useState } from 'react'

export function useToggle(defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue)
  const toggler = useMemo(() => {
    return {
      on: () => setValue(true),
      off: () => setValue(false),
      toggle: () => setValue((v) => !v),
    }
  }, [])

  return [value, toggler] as const
}
