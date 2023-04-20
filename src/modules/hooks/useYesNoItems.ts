import { useI18nContext } from "../I18nProvider"

export const useYesNoItems = () => {
  const { i18n } = useI18nContext()

  const YESNO_ITEMS = [
    { value: "false", label: i18n.t("household.lblno") },
    { value: "true", label: i18n.t("household.lblyes") },
 
    
  ]

  const getYesNoLabel = (yesnoId?: boolean | string) => {
    const yesno = YESNO_ITEMS.find((item) => item.value === String(yesnoId))
    if (yesno) return yesno.label
    else return i18n.t("common.unknown")
  }

  return {
    YESNO_ITEMS,
    getYesNoLabel,
  }
}
