import { useState, useCallback } from 'react'

const KEY = 'phishlens_dark'

export function useDarkMode() {
  const [dark, setDarkState] = useState(() => localStorage.getItem(KEY) === '1')

  const setDark = useCallback((val) => {
    const next = typeof val === 'function' ? val(dark) : val
    localStorage.setItem(KEY, next ? '1' : '0')
    setDarkState(next)
  }, [dark])

  const toggle = useCallback(() => {
    setDark(d => !d)
  }, [setDark])

  return { dark, setDark, toggle }
}
