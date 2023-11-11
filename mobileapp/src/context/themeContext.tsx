import { Context, createContext } from 'react'

type ThemeContextType = {
  theme: string
  toggleTheme: () => void
}

export const ThemeContext: Context<ThemeContextType> = createContext({
  theme: 'light',
  toggleTheme: () => {},
})
