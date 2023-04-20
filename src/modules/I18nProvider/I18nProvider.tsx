import React, { useEffect, FC } from "react"
import i18n from "i18n-js"

import fr from "../../locales/fr.json"
import mg from "../../locales/mg.json"
import AsyncStorage from "../AsyncStorage"
import { I18nContext, Locale } from "./I18nContext"
import { releaseName } from '../../../app.json'

interface IProps {
  children: React.ReactNode
}

const I18N_ASYNC_FIELD_KEY = `locale${releaseName}`

enum EnumI18nKeys {
  Francais = "fr",
  Malagasy = "mg",
}

i18n.defaultLocale = EnumI18nKeys.Francais
i18n.fallbacks = true
i18n.translations = { fr, mg }

const I18nProvider: FC<IProps> = ({ children }) => {
  const [locale, setLocale] = React.useState<Locale>(EnumI18nKeys.Francais)

  // Load the last configured locale
  const loadLastLocale = async () => {
    const lastLocale =
      (await AsyncStorage.getItem(I18N_ASYNC_FIELD_KEY)) ?? EnumI18nKeys.Francais
    setLocale(lastLocale as Locale)
  }

  // Update locale on mount
  useEffect(() => {
    loadLastLocale()
  }, [])

  // Set the current locale
  i18n.locale = locale

  return (
    <I18nContext.Provider
      value={{
        i18n,
        locale,
        setLocale: (newLocale: Locale) => {
          setLocale(newLocale)
          AsyncStorage.setItem(I18N_ASYNC_FIELD_KEY, newLocale)
        },
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export default I18nProvider
