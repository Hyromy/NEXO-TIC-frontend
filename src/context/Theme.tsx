import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'

import { getTheme } from '../utils/getters'
import { setTheme as utilsGetTheme} from '../utils/setters'

type theme = 'light' | 'dark'

type ThemeContextType = {
  theme: theme
  toggleTheme: () => void
}
const ThemeContext = createContext<ThemeContextType | null>(null)
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<theme>(() => {
    const storedTheme = getTheme() as theme | null
    if (storedTheme) return storedTheme

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', theme)
    utilsGetTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev: theme) => prev == 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
