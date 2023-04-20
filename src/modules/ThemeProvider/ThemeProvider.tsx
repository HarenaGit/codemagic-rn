import React, { useEffect, FC } from "react"
import AsyncStorage from "../AsyncStorage"

import { DefaultTheme, DarkTheme } from "../../themes"
import { ThemeContext } from "./ThemeContext"
import { releaseName } from '../../../app.json'
interface IProps {
  children: (theme: ReactNativePaper.Theme) => React.ReactNode
}

const THEME_ASYNC_FIELD_KEY = `theme${releaseName}`

enum EnumThemeKeys {
  DefaultTheme = "DefaultTheme",
  DarkTheme = "DarkTheme",
}

const ThemeProvider: FC<IProps> = ({ children }) => {
  const [theme, setTheme] = React.useState(DefaultTheme)

  // The value of the the context
  const themeContext = React.useMemo(
    () => ({
      setTheme: (isDark: boolean) => {
        setTheme(isDark ? DarkTheme : DefaultTheme)
        AsyncStorage.setItem(THEME_ASYNC_FIELD_KEY, isDark ? EnumThemeKeys.DarkTheme : EnumThemeKeys.DefaultTheme)
      },
    }),
    [],
  )

  // Load the last configured theme
  const loadLastTheme = async () => {
    const lastTheme = (await AsyncStorage.getItem(THEME_ASYNC_FIELD_KEY)) ?? EnumThemeKeys.DefaultTheme
    setTheme(lastTheme === EnumThemeKeys.DefaultTheme ? DefaultTheme : DarkTheme)
  }

  // Update theme on mount
  useEffect(() => {
    loadLastTheme()
  }, [])

  return <ThemeContext.Provider value={themeContext}>{children(theme)}</ThemeContext.Provider>
}

export default ThemeProvider
