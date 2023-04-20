import { createContext } from "react"
import i18n from "i18n-js"

export type Locale = "fr" | "mg"

type ContextType = {
  i18n: typeof i18n
  locale: Locale
  setLocale: (newLocale: Locale) => void
}

export const I18nContext = createContext<ContextType>({
  i18n: i18n,
  locale: "fr",
  setLocale: (newLocale: Locale) => {},
})

export default I18nContext
