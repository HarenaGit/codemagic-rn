import React, { useEffect, FC } from "react"

import { releaseName } from "../../../app.json"
import AsyncStorage from "../AsyncStorage"
import { SearchCriteriaContext } from "./SearchCriteriaContext"
import { useFormik } from "./formik"

interface IProps {
  children: React.ReactNode
}

const SEARCH_CRITERIA_KEY = `SEARCH_CRITERIA_KEY_${releaseName}`

const SearchCriteriaProvider: FC<IProps> = ({ children }) => {
  const [noResult, setNoResult] = React.useState<boolean>(false)
  const [retryCount, setRetryCount] = React.useState<number>(0)
  const [globSearch, setGlobSearch] = React.useState<boolean>(false)
  const [isHydrated, setHydrated] = React.useState<boolean>(false)
  const [searchTriggered, setSearchTriggered] = React.useState<boolean>(false)

  const formik = useFormik({
    onSubmit: () => {},
  })

  // Load persisted criteria data
  const loadCriteriaData = async () => {
    const persistedCriteria = await AsyncStorage.getItem(SEARCH_CRITERIA_KEY)
    if (persistedCriteria && persistedCriteria?.length > 0) {
      formik.setValues(JSON.parse(persistedCriteria))
    }
    setHydrated(true)
  }

  // Update search criteria on mount
  useEffect(() => {
    loadCriteriaData()
  }, [])

  // Persist search criteria on change
  useEffect(() => {
    if (isHydrated) AsyncStorage.setItem(SEARCH_CRITERIA_KEY, JSON.stringify(formik.values))
  }, [formik.values, isHydrated])

  return (
    <SearchCriteriaContext.Provider
      value={{
        retryCount,
        setRetryCount,
        searchTriggered,
        setSearchTriggered,
        noResult,
        globSearch,
        setGlobSearch,
        setNoResult,
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        cni: formik.values.cni,
        birthDate: formik.values.birthDate,
        isFormEmpty:
          [
            formik.touched.birthDate,
            formik.touched.cni,
            formik.touched.firstName,
            formik.touched.lastName,
          ].some((itm) => itm === true) &&
          [
            formik.values.birthDate,
            formik.values.cni,
            formik.values.firstName,
            formik.values.lastName,
          ].every((itm) => !Boolean(itm)),
        formik,
      }}
    >
      {children}
    </SearchCriteriaContext.Provider>
  )
}

export default SearchCriteriaProvider
