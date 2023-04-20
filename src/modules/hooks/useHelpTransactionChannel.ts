import { useI18nContext } from "../I18nProvider"

export const useHelpTransactionChannel = () => {
  const { i18n } = useI18nContext()

  const TRANSACTION_CHANNELS = [
    { value: 1, label: "M'Vola" },
    { value: 2, label: "Orange Money" },
    { value: 3, label: "Airtel Money" },
    { value: 4, label: "Virement bancaire" },
    { value: 5, label: "Paositra Money" },
    { value: 6, label: i18n.t("common.other") },
  ]

  const BANK_CHANNEL = 4
  const PAOMA_CHANNEL = 5
  const OTHER_CHANNEL = 6

  const getTransactionChannelLabel = (channelId?: number) => {
    const channel = TRANSACTION_CHANNELS.find((item) => item.value === channelId)
    if (channel) return channel.label
    else return i18n.t("common.unknown")
  }

  return {
    TRANSACTION_CHANNELS,
    BANK_CHANNEL,
    PAOMA_CHANNEL,
    OTHER_CHANNEL,
    getTransactionChannelLabel,
  }
}
