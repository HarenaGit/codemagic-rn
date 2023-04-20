import { FormikHelpers, useFormik as useBaseFormik } from "formik"
import * as yup from "yup"
import { useI18nContext } from "../../modules/I18nProvider"
import { version } from "../../../app.json"

interface Config {
  onSubmit: (values: ILoginPayload, formikHelpers: FormikHelpers<ILoginPayload>) => void
}

export const useFormik = (config: Config) => {
  const { i18n } = useI18nContext()

  const validationSchema = yup.object({
    password: yup.string().required(i18n.t("common.requiredfield")),
    username: yup.string().required(i18n.t("common.requiredfield")),
  })

  return useBaseFormik<ILoginPayload>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    ...config,
  })
}
