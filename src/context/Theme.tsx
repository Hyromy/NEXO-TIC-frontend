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
/**
 * Provider for managing the application's theme.
 * 
 * The theme is stored in localStorage and applied to the document body using the `data-bs-theme` attribute.
 * The provider also includes a toggle function to switch between light and dark themes.
 * 
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * 
 * @param children - The child components that will have access to the theme context.
 * 
 * @returns The ThemeContext provider with the current theme and a function to toggle the theme.
 */
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

/**
 * Hook for accessing the theme context.
 * 
 * Provides the current theme and a function to toggle the theme.
 * 
 * @example
 * const { theme, toggleTheme } = useTheme()
 * 
 * console.log(theme) // 'light' or 'dark'
 * toggleTheme() // Toggles the theme between light and dark
 * 
 * @throws Will throw an error if used outside of a ThemeProvider.
 * 
 * @returns The theme context object containing the current theme and toggle function.
 * - `theme`: The current theme, either 'light' or 'dark'.
 * - `toggleTheme`: A function to toggle between light and dark themes.
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
