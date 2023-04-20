import React from "react"

import { useAuthContext } from "../AuthProvider"
import { useI18nContext } from "../I18nProvider"
import { useEventLoggingApi } from "./logging"
import { useFokontanyService } from "./common"
import { useLocalizationContext } from "../LocalizationProvider"

// Enroll household's disaster
export const useEnrollHouseholdDisasterApi = (options?: IOperationOptions) => {
  const { i18n } = useI18nContext()
  const FokontanyService = useFokontanyService()
  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)
  const [isDisater, setDisater] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>()

  const handleEnrollHouseholdDisaster = (payload: IHouseholdDisasterPayload) => {
    setLoading(true)
    setMessage(undefined)
    return FokontanyService.post<ICreateCitizen>("/loharano/disasters", payload)
      .then(async (response) => {
        if ([200, 201].includes(response.status)) {
          setHasError(!response.data.success)
          //Logging
          logEvent(currentUser, "ENROLL-HOUSEHOLD-DISASTER", "NULL", payload)
          setMessage(i18n.t("enrolldisaster.creationsuccess"))
          options?.onSuccess?.()
        } else {
          setHasError(true)
          options?.onError?.()
          // Request made and server responded.
          logEvent(currentUser, "ENROLL-HOUSEHOLD-DISASTER-ERROR", payload, response.data)
          // Update error message
          setMessage(i18n.t("enrolldisaster.saveerror"))
        }
        setLoading(false)
      })
      .catch((error) => {
        if (error.response.data.statusCode === 409) {
          setMessage(i18n.t("statecitizen.alreadyDisater"))
          setDisater(true)
          setLoading(false)
          setHasError(false)
        } else {
          // Default error message
          setMessage(i18n.t("enrolldisaster.saveerror"))
          if (error.response) {
            /// Request made and server responded.
            logEvent(currentUser, "ENROLL-HOUSEHOLD-DISASTER-ERROR", payload, error.response.data)
          } else if (error.request) {
            console.log("REQUEST-ERROR => ", error.request)
          }

          setHasError(true)
          setLoading(false)
        }
        options?.onError?.()
      })
  }

  return {
    handleEnrollHouseholdDisaster,
    isLoading,
    hasError,
    isDisater,
    message,
  }
}

// Load all evacuation sites
export const useEvacuationSitesApi = (options?: IOperationOptions<IEvacuationSitePayload>) => {
  const FokontanyService = useFokontanyService()
  const logEvent = useEventLoggingApi()
  const { currentUser } = useAuthContext()
  const [evacuationSites, setEvacuationSites] = React.useState<IEvacuationSitePayload[]>([])
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)
  const [isDisater, setIsDisater] = React.useState<boolean>(false)

  const { localization } = useLocalizationContext()

  const loadEvacuationSites = () => {
    setLoading(true)
    setEvacuationSites([])
    return FokontanyService.get<IEvacuationSitePayload[]>(
      `/loharano/sites/${localization.regionId}`,
    )
      .then(async (response) => {
        if ([200, 201].includes(response.status)) {
          setHasError(false)
          setEvacuationSites(response.data)
          console.log(response.data)
          //Logging
          logEvent(currentUser, "LOAD-EVACUATION-SITES-DATA", "NULL", "NULL")
          if (response.data.length > 0) {
            options?.onSuccess?.(response.data[0])
          }
        } else {
          console.log(response.data)
          setHasError(true)
          options?.onError?.()
        }
        setLoading(false)
      })
      .catch((error) => {
        if (error.response) {
          logEvent(currentUser, "LOAD-EVACUATION-SITES-DATA-ERROR", "NULL", error.response.data)
          console.log(error.response)
        } else if (error.request) {
          // The request was made but no response was received
          console.log("CATCH REQUEST => ", error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("CATCH ERROR => ", error.message)
        }
        setHasError(true)
        setLoading(false)
        options?.onError?.()
      })
  }

  return {
    isLoading,
    hasError,
    isDisater,
    evacuationSites,
    loadEvacuationSites,
  }
}
