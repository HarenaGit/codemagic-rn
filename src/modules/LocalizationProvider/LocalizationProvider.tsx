import React, { useEffect, FC } from "react"

import { releaseName } from "../../../app.json"
import { ACCESS_TOKEN_KEY } from "../../consts"
import AsyncStorage from "../AsyncStorage"
import { LocalizationContext } from "./LocalizationContext"

interface IProps {
  children: React.ReactNode
}

const LOCALIZATION_FIELD_KEY = `LOCALIZATION_KEY_${releaseName}`

const LocalizationProvider: FC<IProps> = ({ children }) => {
  const [localization, setLocalization] = React.useState<Partial<ILocalization>>({})
  const [tmpLocalization, setTmpLocalization] = React.useState<Partial<ILocalization>>({})

  const handleLocalizationChange = (loc: Partial<ILocalization>) => {
    setLocalization(loc)
    AsyncStorage.setItem(LOCALIZATION_FIELD_KEY, JSON.stringify(loc))
  }

  const handleTmpLocalizationChange = (field: keyof ILocalization, value?: number | string) => {
    setTmpLocalization((oldVal) => {
      return {
        ...oldVal,
        [field]: value,
      }
    })
  }

  // Load persisted localization data
  const loadLocalizationData = async () => {
    const persistedLocalization = await AsyncStorage.getItem(LOCALIZATION_FIELD_KEY)
    if (persistedLocalization && persistedLocalization?.length > 0) {
      setLocalization(JSON.parse(persistedLocalization))
      setTmpLocalization(JSON.parse(persistedLocalization))
    }
  }

  // Update locale on mount
  useEffect(() => {
    loadLocalizationData()
  }, [])

  return (
    <LocalizationContext.Provider
      value={{
        localization,
        setLocalization: handleLocalizationChange,
        tmpLocalization,
        setTmpLocalization,
        handleTmpLocalizationChange,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}

export default LocalizationProvider
