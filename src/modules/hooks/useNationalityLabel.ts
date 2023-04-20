import { NATIONALITIES } from "../../consts"
import { useI18nContext } from "../I18nProvider"

// Find the nationality and Displayable label
export const useNationalityLabel = () => {
  const { i18n } = useI18nContext()
  return (nationalityId: number | null | undefined) => {
    return nationalityId === null || nationalityId === undefined
      ? i18n.t("common.unknown")
      : NATIONALITIES.find((nationalityItm) => nationalityItm.value === nationalityId)?.label ??
          i18n.t("common.unknown")
  }
}
