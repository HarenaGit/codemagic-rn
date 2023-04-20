import { useContext } from "react"
import LocalizationContext from "./LocalizationContext"
import LocalizationProvider from "./LocalizationProvider"

export const useLocalizationContext = () => useContext(LocalizationContext)
export default LocalizationProvider
