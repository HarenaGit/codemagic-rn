import { useFocusEffect } from "@react-navigation/native"
import { FormikErrors, FormikHelpers, useFormik as useBaseFormik } from "formik"
import React, { useEffect } from "react"
import * as yup from "yup"
import { useI18nContext } from "../../modules/I18nProvider"

interface Config {
  onSubmit: (values: Partial<ICitizen>, formikHelpers: FormikHelpers<Partial<ICitizen>>) => void
  initialValues: Partial<ICitizen>
  intent: "createhousehold" | "updatecitizen" | "addhouseholdmember"
}

export const useFormik = (config: Config) => {

  const { i18n } = useI18nContext()

  const addNewMember: any = config.intent === "addhouseholdmember" ? true : false

  let addressNameField = addNewMember
    ? yup.string().nullable(true)
    : yup.string().required(i18n.t("common.requiredfield"))

  let householdRegisterNumber = addNewMember
    ? yup.string().nullable(true)
    : yup
        .string()
        .nullable(true)
        .matches(/^[0-9]{3,7}$/, i18n.t("errors.regnuminvalid"))
  ///.required(i18n.t("common.requiredfield"))

  let validationSchema = yup.object({
    CNI: yup.string()
    //.matches(/^(?!000|9999)[0-9\s]{12}$/, i18n.t("errors.cniinvalid"))
    .matches(/^((?!000|999 9)([0-9]{3})( )([0-9]{3})( )([0-9]{3})( )([0-9]{3}))$|^((?!000|9999)[0-9]{12})$/, i18n.t("errors.cniinvalid"))
    .nullable(),
    lastName: yup
      .string()
      .trim()
      .matches(/^[- a-zA-Z\u00C0-\u00FF]*$/, i18n.t("errors.lastnameinvalid"))
      .required(i18n.t("common.requiredfield")),
    father: yup
      .string()
      .trim()
      .matches(/^[- a-zA-Z\u00C0-\u00FF]*$/, i18n.t("errors.fathernameinvalid"))
      .nullable(),
    mother: yup
      .string()
      .trim()
      .matches(/^[- a-zA-Z\u00C0-\u00FF]*$/, i18n.t("errors.mothernameinvalid"))
      .nullable()
      ,
    firstName: yup
      .string()
      .trim()
      .matches(/^[- a-zA-Z\u00C0-\u00FF]*$/, i18n.t("errors.firstnameinvalid"))
      .nullable(),
    birthDate: yup.date().max(new Date(Date.now())).required(i18n.t("common.requiredfield")),
    address: yup.object().shape({
      name: addressNameField,
    }),
    CNIDeliveryPlace:  yup
    .string()
    .trim()
    .nullable(),
    household: yup.object().shape({
      registerNumber: householdRegisterNumber,
    }),
    phoneNumber: yup
      .string()
     // .matches(/^0[0-9]{9}$|^\+?[0-9]{3}[0-9]{9}$/, i18n.t("errors.phoneinvalid"))
      .matches(/^0([0-9]{2})[ ]?([0-9]{2})[ ]?([0-9]{3})[ ]?([0-9]{2})$/, i18n.t("errors.phoneinvalid"))
      .nullable(),

  })
  

    return useBaseFormik<Partial<ICitizen>>({
    validate: (values) => {
      const errors: FormikErrors<Partial<ICitizen>> = {}
      if (values.CNI && (values.CNI.length === 15 || values.CNI.length ===12) && !values.CNIDeliveryDate) {
        errors.CNIDeliveryDate = i18n.t("common.requiredfield")
      }
      if (values.CNI && (values.CNI.length === 15 || values.CNI.length ===12) && !values.CNIDeliveryPlace) {
        errors.CNIDeliveryPlace = i18n.t("common.requiredfield")
           }
      return errors
   
    },
    validationSchema: validationSchema,
    ...config,
  })
}
