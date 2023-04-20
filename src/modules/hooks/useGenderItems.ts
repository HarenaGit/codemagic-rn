import { useI18nContext } from "../I18nProvider"

export const useGenderItems = () => {
  const { i18n } = useI18nContext()

  const GENDER_ITEMS = [
    { value: 0, label: i18n.t("household.femme") },
    { value: 1, label: i18n.t("household.homme") },
  ]

  const getGenderLabel = (genderId?: number) => {
    const gender = GENDER_ITEMS.find((item) => item.value === genderId)
    if (gender) return gender.label
    else return i18n.t("common.unknown")
  }

  return {
    GENDER_ITEMS,
    getGenderLabel,
  }
}
