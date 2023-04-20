import { useContext } from "react"
import ThemeContext from "./ThemeContext"
import ThemeProvider from "./ThemeProvider"

export const useThemeContext = () => useContext(ThemeContext)
export default ThemeProvider
