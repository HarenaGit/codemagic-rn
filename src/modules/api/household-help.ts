import React from "react"

import { useAuthContext } from "../AuthProvider"
import { useI18nContext } from "../I18nProvider"
import { useEventLoggingApi } from "./logging"
import { useFokontanyService } from "./common"

// Allocate help to household
export const useAllocateHouseholdHelpApi = (options?: IOperationOptions) => {
  const { i18n } = useI18nContext()
  const FokontanyService = useFokontanyService()
  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>()

  const handleAllocateHouseholdHelp = (payload: IHouseholdHelpPayload) => {
    setLoading(true)
    setMessage(undefined)
    return FokontanyService.post<ICreateCitizen>("/loharano/households/helps", {
      helpId: payload.helpId,
      bookNumber: payload.bookNumber,
      observation: payload.observation,
      transactionChannel: payload.transactionChannel,
      otherChannel: payload.otherChannel,
      bankId: payload.bankId,
      rib: payload.rib,
      paositraMoney: payload.paositraMoney,
      phoneNumber: payload.phoneNumber,
      date: new Date().toISOString(),
    })
      .then(async (response) => {
        if ([200, 201].includes(response.status)) {
          setHasError(!response.data.success)
          //Logging
          logEvent(currentUser, "ALLOCATE-HOUSEHOLD-HELP", "NULL", payload)
          setMessage(i18n.t("allocatehelp.creationsuccess"))
          options?.onSuccess?.()
        } else {
          setHasError(true)
          options?.onError?.()
          // Request made and server responded.
          logEvent(currentUser, "ALLOCATE-HOUSEHOLD-HELP-ERROR", payload, response.data)
          // Update error message
          setMessage(i18n.t("allocatehelp.saveerror"))
        }
        setLoading(false)
      })
      .catch((error) => {
        // Default error message
        setMessage(i18n.t("allocatehelp.saveerror"))
        if (error.response) {
          // Request made and server responded.
          logEvent(currentUser, "ALLOCATE-HOUSEHOLD-HELP-ERROR", payload, error.response.data)
        } else if (error.request) {
          console.log("REQUEST-ERROR => ", error.request)
        }

        setHasError(true)
        setLoading(false)
        options?.onError?.()
      })
  }

  return {
    handleAllocateHouseholdHelp,
    isLoading,
    hasError,
    message,
  }
}

// Load household's helps
export const useHouseholdHelpProgramsApi = (options?: IOperationOptions<IHouseholdHelpProgram>) => {
  const FokontanyService = useFokontanyService()
  const logEvent = useEventLoggingApi()
  const { currentUser } = useAuthContext()
  const [householdHelpPrograms, setHouseholdHelpPrograms] = React.useState<IHouseholdHelpProgram[]>(
    [],
  )
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  const loadHouseholdHelpPrograms = (bookNumber: string) => {
    setLoading(true)
    setHouseholdHelpPrograms([])
    return FokontanyService.get<IHouseholdHelpProgram[]>(`/loharano/households/helps/${bookNumber}`)
      .then(async (response) => {
        if ([200, 201].includes(response.status)) {
          setHasError(false)
          setHouseholdHelpPrograms(response.data)
          //Logging
          logEvent(currentUser, "LOAD-HOUSEHOLD-HELP-PROGRAMS", "NULL", { bookNumber })
          if (response.data.length > 0) {
            options?.onSuccess?.(response.data[0])
          }
        } else {
          setHasError(true)
          options?.onError?.()
        }
        setLoading(false)
      })
      .catch((error) => {
        if (error.response) {
          logEvent(
            currentUser,
            "LOAD-HOUSEHOLD-HELP-PROGRAMS-DATA-ERROR",
            "NULL",
            error.response.data,
          )
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
    householdHelpPrograms,
    loadHouseholdHelpPrograms,
    hasError,
  }
}

// Load all helps program
export const useHelpProgramsApi = (options?: IOperationOptions<IHelpProgram>) => {
  const FokontanyService = useFokontanyService()
  const logEvent = useEventLoggingApi()
  const { currentUser } = useAuthContext()
  const [helpPrograms, setHelpPrograms] = React.useState<IHelpProgram[]>([])
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  const loadHelpPrograms = () => {
    setLoading(true)
    setHelpPrograms([])
    return FokontanyService.get<IHelpProgram[]>("/loharano/helps")
      .then(async (response) => {
        if ([200, 201].includes(response.status)) {
          setHasError(false)
          setHelpPrograms(response.data)
          //Logging
          logEvent(currentUser, "LOAD-HELP-PROGRAMS-DATA", "NULL", "NULL")
          if (response.data.length > 0) {
            options?.onSuccess?.(response.data[0])
          }
        } else {
          setHasError(true)
          options?.onError?.()
        }
        setLoading(false)
      })
      .catch((error) => {
        if (error.response) {
          logEvent(currentUser, "LOAD-HELP-PROGRAMS-DATA-ERROR", "NULL", error.response.data)
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
    helpPrograms,
    loadHelpPrograms,
  }
}
