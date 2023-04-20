import { FormikErrors, FormikHelpers, useFormik as useBaseFormik } from "formik"
import * as yup from "yup"
import { useI18nContext } from "../../modules/I18nProvider"

interface Config {
  onSubmit: (
    values: Omit<ISearchCitizen, "page" | "size">,
    formikHelpers?: FormikHelpers<Omit<ISearchCitizen, "page" | "size">>,
  ) => void
}

export const useFormik = (config: Config) => {
  const { i18n } = useI18nContext()

  const validationSchema = yup.object({
    lastName: yup.string(),
    firstName: yup.string(),
    cni: yup.string().matches(/^[0-9\s]{12,15}$/, i18n.t("errors.cniinvalid")),
    birthDate: yup.date().max(new Date(Date.now())),
  })

  return useBaseFormik<Omit<ISearchCitizen, "page" | "size">>({
    initialValues: {},
    validate: (values: Omit<ISearchCitizen, "page" | "size">) => {
      const errors: FormikErrors<Omit<ISearchCitizen, "page" | "size">> = {}
      if (
        values.birthDate &&
        [values.cni, values.firstName, values.lastName].every((itm) => !Boolean(itm))
      ) {
        errors.birthDate = i18n.t("errors.shouldbecombinedcriteria")
      }
      return errors
    },
    validationSchema: validationSchema,
    ...config,
  })
}
