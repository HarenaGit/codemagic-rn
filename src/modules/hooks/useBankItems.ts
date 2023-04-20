import { useI18nContext } from "../I18nProvider"

export const useBankItems = () => {
  const { i18n } = useI18nContext()

  const BANK_ITEMS = [
    { value: 1, label: "BNI" },
    { value: 2, label: "BFV" },
    { value: 3, label: "BOA" },
    { value: 4, label: "Access Banque" },
    { value: 5, label: "BMOI" },
    { value: 6, label: "BGFI" },
    { value: 7, label: "Sipem Banque" },
  ]

  const getBankName = (bankId?: number) => {
    const bank = BANK_ITEMS.find((item) => item.value === bankId)
    if (bank) return bank.label
    else return i18n.t("common.unknown")
  }

  return {
    BANK_ITEMS,
    getBankName,
  }
}
