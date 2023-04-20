declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      primary: string
      onPrimary: string
      secondary: string
      background: string
      card: string
      onCard: string
      input: string
      inputLabelEmpty: string
      inputLabel: string
      searchfield: string
      surface: string
      accent: string
      error: string
      success: string
      text: string
      onSurface: string
      onBackground: string
      disabled: string
      placeholder: string
      backdrop: string
      notification: string
      border: string
    }
    export interface Theme {
      colors: ThemeColors
      navigation: {
        dark: boolean
        colors: {
          dark: string
          primary: string
          background: string
          card: string
          text: string
          border: string
          notification: string
        }
      }
    }
  }
}

export * from "./DefaultTheme"
export * from "./DarkTheme"
