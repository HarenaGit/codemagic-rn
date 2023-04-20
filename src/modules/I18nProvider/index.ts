import { useContext } from "react"
import I18nContext from "./I18nContext"
import I18nProvider from "./I18nProvider"

export const useI18nContext = () => useContext(I18nContext)
export default I18nProvider
