import { createContext } from "react"

type LocalizationContextType = {
  localization: Partial<ILocalization>
  setLocalization: (loc: Partial<ILocalization>) => void
  tmpLocalization: Partial<ILocalization>
  setTmpLocalization: (loc: Partial<ILocalization>) => void
  handleTmpLocalizationChange: (field: keyof ILocalization, value: number | string) => void
}

export const LocalizationContext = createContext<LocalizationContextType>({
  localization: {},
  setLocalization: (loc: Partial<ILocalization>): void => {},
  tmpLocalization: {},
  setTmpLocalization: (loc: Partial<ILocalization>): void => {},
  handleTmpLocalizationChange: (field: keyof ILocalization, value: number | string): void => {},
})

export default LocalizationContext
