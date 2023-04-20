import { useI18nContext } from "../../modules/I18nProvider"

export const useLifeStatus = () => {
  const { i18n } = useI18nContext()

  const LIFE_STATUS = [
    { value: 0, label: i18n.t("household.unkstatus") },
    { value: 1, label: i18n.t("household.alivestatus") },
    { value: 2, label: i18n.t("household.deadstatus") },
  ]

  const getLifeStatusLabel = (statusId?: number) => {
    const status = LIFE_STATUS.find((item) => item.value === statusId)
    if (status) return status.label
    else return i18n.t("common.unknown")
  }

  return {
    LIFE_STATUS,
    getLifeStatusLabel,
  }
}
