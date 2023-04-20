import { FormikProps } from "formik"
import { createContext } from "react"

import { useFormik } from "./formik"

type SearchCriteriaContextType = {
  lastName?: string
  firstName?: string
  cni?: number
  birthDate?: string
  searchTriggered: boolean
  retryCount: number
  setRetryCount: (count: number) => void
  setSearchTriggered: (newVal: boolean) => void
  noResult: boolean
  isFormEmpty: boolean
  setNoResult: (newVal: boolean) => void
  globSearch: boolean
  setGlobSearch: (newVal: boolean) => void
  formik?: FormikProps<Omit<ISearchCitizen, "page" | "size">>
}

export const SearchCriteriaContext = createContext<SearchCriteriaContextType>({
  retryCount: 0,
  setRetryCount: (count: number) => {},
  searchTriggered: false,
  setSearchTriggered: (newVal: boolean) => {},
  isFormEmpty: false,
  noResult: false,
  setNoResult: (newVal: boolean) => {},
  globSearch: false,
  setGlobSearch: (newVal: boolean) => {},
})

export default SearchCriteriaContext
