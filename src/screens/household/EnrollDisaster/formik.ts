import { FormikErrors, FormikHelpers, useFormik as useBaseFormik } from "formik"
import * as yup from "yup"
import { useI18nContext } from "../../../modules/I18nProvider"

interface Config {
  onSubmit: (
    values: Partial<IHouseholdDisasterPayload>,
    formikHelpers: FormikHelpers<Partial<IHouseholdDisasterPayload>>,
  ) => void
  initialValues: Partial<IHouseholdDisasterPayload>
}

export const useFormik = (config: Config) => {
  const { i18n } = useI18nContext()

  const validationSchema = yup.object({
    siteId: yup
      .string()
      .matches(/\d/, i18n.t("common.requiredfield"))
      .required(i18n.t("common.requiredfield")),
    quantity: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    quantityMale: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    quantityFemale: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    quantityStudent: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    childrenUnder5Year: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    quantityPregnant: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    quantityFemaleFeeding: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    quantityHandicapped: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    quantityOver60Year: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    quantityDiarrhea: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    quantityProblemRespiratory: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    quantityGetFlu: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    quantityGetPaludism: yup
      .string()
      .matches(/\d/, i18n.t("enrolldisaster.inputnumber"))
      .required(i18n.t("common.requiredfield")),
    entryDate: yup.string().required(i18n.t("common.requiredfield")),
  })

  return useBaseFormik<Partial<IHouseholdDisasterPayload>>({
    validationSchema: validationSchema,
    validate: (values: Partial<IHouseholdDisasterPayload>) => {
      const errors: FormikErrors<Partial<IHouseholdDisasterPayload>> = {}
      if (
        values.quantity !== undefined &&
        values.quantity !== null &&
        Number(values.quantity) < 1
      ) {
        errors.quantity = i18n.t("enrolldisaster.invalidcount")
      }
      if (
        values.quantity &&
        values.quantityFemale &&
        values.quantityMale &&
        Number(values.quantity) !== Number(values.quantityFemale) + Number(values.quantityMale)
      ) {
        errors.quantity = i18n.t("enrolldisaster.invalidcount")
      }
      if (
        values.quantity &&
        values.quantityFemale &&
        Number(values.quantityFemale) > Number(values.quantity)
      ) {
        errors.quantity = i18n.t("enrolldisaster.invalidcount")
      }
      if (
        values.quantity &&
        values.quantityMale &&
        Number(values.quantityMale) > Number(values.quantity)
      ) {
        errors.quantity = i18n.t("enrolldisaster.invalidcount")
      }
      if (
        values.quantity &&
        values.quantityDiarrhea &&
        Number(values.quantityDiarrhea) > Number(values.quantity)
      ) {
        errors.quantity = i18n.t("enrolldisaster.invalidcount")
      }
      if (
        values.quantity &&
        values.quantityGetFlu &&
        Number(values.quantityGetFlu) > Number(values.quantity)
      ) {
        errors.quantity = i18n.t("enrolldisaster.invalidcount")
      }
      if (
        values.quantity &&
        values.quantityGetPaludism &&
        Number(values.quantityGetPaludism) > Number(values.quantity)
      ) {
        errors.quantity = i18n.t("enrolldisaster.invalidcount")
      }
      if (
        values.quantity &&
        values.quantityHandicapped &&
        Number(values.quantityHandicapped) > Number(values.quantity)
      ) {
        errors.quantity = i18n.t("enrolldisaster.invalidcount")
      }
      if (
        values.quantity &&
        values.quantityOver60Year &&
        Number(values.quantityOver60Year) > Number(values.quantity)
      ) {
        errors.quantity = i18n.t("enrolldisaster.invalidcount")
      }
      if (
        values.quantity &&
        values.quantityProblemRespiratory &&
        Number(values.quantityProblemRespiratory) > Number(values.quantity)
      ) {
        errors.quantity = i18n.t("enrolldisaster.invalidcount")
      }
      if (
        values.quantity &&
        values.quantityStudent &&
        Number(values.quantityStudent) > Number(values.quantity)
      ) {
        errors.quantity = i18n.t("enrolldisaster.invalidcount")
      }
      return errors
    },
    ...config,
  })
}
