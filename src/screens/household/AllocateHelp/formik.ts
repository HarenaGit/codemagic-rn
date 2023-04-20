import { FormikErrors, FormikHelpers, useFormik as useBaseFormik } from "formik"
import * as yup from "yup"
import { HELP_TYPE_CASH } from "../../../consts"
import { useHelpTransactionChannel } from "../../../modules/hooks/useHelpTransactionChannel"
import { useI18nContext } from "../../../modules/I18nProvider"

interface Config {
  onSubmit: (
    values: Partial<IHouseholdHelpPayload>,
    formikHelpers: FormikHelpers<Partial<IHouseholdHelpPayload>>,
  ) => void
  initialValues: Partial<IHouseholdHelpPayload>
}

export const useFormik = (config: Config, helpType?: IHelpProgram) => {
  const { i18n } = useI18nContext()

  const { BANK_CHANNEL, PAOMA_CHANNEL, OTHER_CHANNEL } = useHelpTransactionChannel()

  const validationSchema = yup.object({
    helpId: yup.number().required(i18n.t("common.requiredfield")),
    rib: yup.string().matches(/^[0-9]{11,23}$/, i18n.t("errors.ribinvalid")),
    phoneNumber: yup
      .string()
      .matches(/^0[0-9]{9}$|^\+?[0-9]{3}[0-9]{9}$/, i18n.t("errors.phoneinvalid")),
  })

  return useBaseFormik<Partial<IHouseholdHelpPayload>>({
    validationSchema: validationSchema,
    validate: (values: Partial<IHouseholdHelpPayload>) => {
      const errors: FormikErrors<Partial<IHouseholdHelpPayload>> = {}
      if (helpType && values.helpId && helpType.type && helpType.type === HELP_TYPE_CASH) {
        if (
          values.transactionChannel &&
          ![BANK_CHANNEL, PAOMA_CHANNEL, OTHER_CHANNEL].includes(
            Number(values.transactionChannel),
          ) &&
          !values.phoneNumber
        ) {
          errors.phoneNumber = i18n.t("common.requiredfield")
        } else if (
          values.transactionChannel &&
          BANK_CHANNEL === Number(values.transactionChannel) &&
          !values.rib
        ) {
          errors.rib = i18n.t("common.requiredfield")
        } else if (
          values.transactionChannel &&
          PAOMA_CHANNEL === Number(values.transactionChannel) &&
          !values.paositraMoney
        ) {
          errors.paositraMoney = i18n.t("common.requiredfield")
        } else if (
          values.transactionChannel &&
          OTHER_CHANNEL === Number(values.transactionChannel) &&
          (!values.otherChannel || (values.otherChannel && values.otherChannel.length === 0))
        ) {
          errors.otherChannel = i18n.t("common.requiredfield")
        }
      }
      return errors
    },
    ...config,
  })
}
