import { createContext } from "react"

type ContextType = {
  setTheme: (isDark: boolean) => void
}

export const ThemeContext = createContext<ContextType>({
  setTheme: (isDark: boolean) => {},
})

export default ThemeContext
