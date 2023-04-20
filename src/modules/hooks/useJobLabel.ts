import { JOBS } from "../../consts"
import { useI18nContext } from "../I18nProvider"

export const useJobLabel = () => {
  const { i18n } = useI18nContext()

  return (jobId?: number) => {
    const job = JOBS.find((item) => item.value === jobId)
    if (job) return job.label
    else return i18n.t("common.unknown")
  }
}
