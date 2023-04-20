import React from "react"

import { useAuthContext } from "../AuthProvider"
import { useSearchCriteriaContext } from "../SearchCriteriaProvider"
import { useEventLoggingApi } from "./logging"
import { useFokontanyService } from "./common"
import { useLocalizationContext } from "../LocalizationProvider"
import { useI18nContext } from "../I18nProvider"

// Search active citizen
export const useSearchCitizenApi = () => {
  const FokontanyService = useFokontanyService()
  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()
  const { retryCount, setRetryCount } = useSearchCriteriaContext()
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)
  const [hasNetworkError, setHasNetworkError] = React.useState<boolean>(false)
  const [citizens, setCitizens] = React.useState<ICitizen[]>([])

  const handleSearchCitizen = (payload: ISearchCitizen) => {
    setLoading(true)
    setRetryCount(retryCount + 1)
    return FokontanyService.get<ICitizen[]>("/loharano/citizens", {
      params: {
        ...payload,
        minimize: true,
        firstName: payload.firstName?.trim(),
        lastName: payload.lastName?.trim(),
        include: "address,household",
      },
    })
      .then(async (response) => {
        if ([200, 201].includes(response.status)) {
          setRetryCount(0)
          setHasError(false)
          setCitizens(
            response.data?.sort((a, b) => {
              return a.isChief === b.isChief ? 0 : a.isChief ? -1 : 1
            }),
          )
          //Logging
          logEvent(currentUser, "SEARCH-CITIZEN", "NULL", payload)
        } else {
          setHasError(true)
          setCitizens([])

          // Request made and server responded.
          logEvent(currentUser, "SEARCH-CITIZEN-ERROR", payload, response.data)
        }
        setLoading(false)
        setHasNetworkError(false)
      })
      .catch((error) => {
        if (error.response) {
          setHasNetworkError(false)
          // Request made and server responded.
          logEvent(currentUser, "SEARCH-CITIZEN-ERROR", payload, error.response.data)
        } else if (error.request) {
          setHasNetworkError(true)
          // The request was made but no response was received
          console.log("CATCH REQUEST => ", error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("CATCH ERROR => ", error.message)
        }

        setHasError(true)
        setCitizens([])
        setLoading(false)
      })
  }

  return {
    handleSearchCitizen,
    citizens,
    setCitizens,
    isLoading,
    hasError,
    hasNetworkError,
  }
}

// Update citizen
export const useCreateCitizenAndHouseholdApi = () => {
  const { i18n } = useI18nContext()
  const FokontanyService = useFokontanyService()
  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)
  const [isDuplicate, setisDuplicate] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>()
  const [newCitizenAdd, setNewCitizen] = React.useState<ICitizen>()

  const [citizenIdAdd, setCitizenId] = React.useState<number>()
  const { localization } = useLocalizationContext()

  const handleCreateCitizenAndHousehold = (
    payload: Partial<ICitizen>,
    intent: "createhousehold" | "addhouseholdmember",
    options?: IOperationOptions,
  ) => {
    setLoading(true)
    setMessage(undefined)
    return FokontanyService.post<ICreateCitizen>("/loharano/citizens/household", {
      fokontanyId: localization.fokontanyId,
      CNI: payload.CNI,
      CNIDeliveryPlace: payload.CNIDeliveryPlace,
      CNIDeliveryDate: payload.CNI ? payload.CNIDeliveryDate : undefined,
      lastName: payload.lastName,
      firstName: payload.firstName,
      birthDate: payload.birthDate,
      birthPlace: payload.birthPlace,
      gender: payload.gender ?? 0,
      phoneNumber: payload.phoneNumber,
      nationalityId: payload.nationalityId ?? 1,
      isDisabled: payload.isDisabled ?? false,
      isDied: payload.isDied ?? false,
      deathDate: payload.isDied ? payload.deathDate : undefined,
      isHandicapped: payload.isHandicapped ?? false,
      father: payload.father,
      mother: payload.mother,
      fatherStatus: payload.fatherStatus ?? 0,
      motherStatus: payload.motherStatus ?? 0,
      jobId: payload.jobId,
      jobStatus: payload.jobStatus,
      jobOther: payload.jobOther,
      passport: payload.passport,
      passportDeliveryDate: payload.passportDeliveryDate,
      passportDeliveryPlace: payload.passportDeliveryPlace,
      photo: payload.photo,

      // Is the houshold chief
      isChief: payload.isChief,

      // if adding new household member
      householdId: intent === "addhouseholdmember" ? payload.household?.householdId : undefined,
      validateHousehold: intent === "addhouseholdmember" ? false : true,

      // New address for the household
      newRegisterNumber: payload.household?.registerNumber,
      addressId: payload.address?.addressId,
      newSectorName: payload.address?.sector,
    })
      .then(async (response) => {
        if ([200, 201].includes(response.status)) {
          setHasError(!response.data.success)
          //Logging
          logEvent(currentUser, "CREATE-NEW-CITIZEN-AND-HOUSEHOLD", "NULL", payload)
          if (response.data.duplicateCitizen) {
            setMessage(i18n.t("updatecitizen.creationdupliacte"))
            setisDuplicate(true)
         
          } else {
            setMessage(i18n.t("updatecitizen.creationsuccess"))
           
          }
          setNewCitizen(response.data.citizen)
          setCitizenId(response.data.citizen.id)
          options?.onSuccess?.()
        } else {
          setHasError(true)
          options?.onError?.()
          // Request made and server responded.
          logEvent(currentUser, "CREATE-NEW-CITIZEN-AND-HOUSEHOLD-ERROR", payload, response.data)
          // Update error message
          setMessage(i18n.t("updatecitizen.saveerror"))
        }
        setLoading(false)
      })
      .catch((error) => {
        // Default error message
        console.log(" error", error)
        setMessage(i18n.t("updatecitizen.saveerror"))
        if (error.response) {
          // Request made and server responded.
          logEvent(
            currentUser,
            "CREATE-NEW-CITIZEN-AND-HOUSEHOLD-ERROR",
            payload,
            error.response.data,
          )
          if (error?.response?.data?.statusCode === 409) {
            setMessage(i18n.t("updatecitizen.alreadyexisterror"))
          }
        } else if (error.request) {
          console.log("REQUEST-ERROR => ", error.request)
        }

        setHasError(true)
        setLoading(false)
        options?.onError?.()
      })
  }

  return {
    handleCreateCitizenAndHousehold,
    isLoading,
    hasError,
    message,
    newCitizenAdd,
    citizenIdAdd,
    isDuplicate
  }
}

// Update citizen
export const useUpdateCitizenApi = () => {
  const { i18n } = useI18nContext()
  const FokontanyService = useFokontanyService()
  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>()
  const [newCitizenUpdate, setNewCitizen] = React.useState<Partial<ICitizen>>()
  const [citizenIdUpdate, setCitizenId] = React.useState<number>()
  ////loooooo
  const { localization } = useLocalizationContext()

  const handleUpdateCitizen = (
    citizenId: number,
    payload: Partial<ICitizen>,
    validateHousehold: boolean,
    options?: IOperationOptions,
  ) => {
    setLoading(true)
    setMessage(undefined)
    return FokontanyService.patch<IMutationResponse>(`/loharano/citizens/${citizenId}`, {
      fokontanyId: localization.fokontanyId,
      CNI: payload.CNI,
      CNIDeliveryPlace: payload.CNIDeliveryPlace,
      CNIDeliveryDate: payload.CNI ? payload.CNIDeliveryDate : undefined,
      lastName: payload.lastName,
      firstName: payload.firstName,
      birthDate: payload.birthDate,
      birthPlace: payload.birthPlace,
      gender: payload.gender,
      phoneNumber: payload.phoneNumber,
      nationalityId: payload.nationalityId,
      isDisabled: payload.isDisabled,
      isDied: payload.isDied,
      deathDate: payload.isDied ? payload.deathDate : undefined,
      isHandicapped: payload.isHandicapped,
      father: payload.father,
      mother: payload.mother,
      fatherStatus: payload.fatherStatus,
      motherStatus: payload.motherStatus,
      jobId: payload.jobId,
      jobStatus: payload.jobStatus,
      jobOther: payload.jobOther,
      passport: payload.passport,
      passportDeliveryDate: payload.passportDeliveryDate,
      passportDeliveryPlace: payload.passportDeliveryPlace,
      photo: payload.photo,
      isChief: payload.isChief,
      householdId: payload.household?.householdId,
      newRegisterNumber: payload.household?.registerNumber,
      newAddressName: payload.address?.name,
      newSectorName: payload.address?.sector,
      validateHousehold: validateHousehold,
    })
      .then(async (response) => {
        if ([200, 201].includes(response.status)) {
          setHasError(!response.data.success)
          //Logging
          logEvent(currentUser, "UPDATE-CITIZEN", "NULL", { citizenId, ...payload })
          setCitizenId(citizenId)
          setNewCitizen(payload)

          options?.onSuccess?.()
          setMessage(i18n.t("updatecitizen.savesuccess"))
        } else {
          setHasError(true)
          options?.onError?.()
          // Request made and server responded.
          logEvent(currentUser, "UPDATE-CITIZEN-ERROR", payload, response.data)
          // Update error message
          setMessage(i18n.t("updatecitizen.saveerror"))
        }
        setLoading(false)
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded.
          logEvent(currentUser, "UPDATE-CITIZEN-ERROR", payload, error.response.data)
        }
        // Update error message
        setMessage(i18n.t("updatecitizen.saveerror"))
        setHasError(true)
        setLoading(false)
        options?.onError?.()
      })
  }

  return {
    handleUpdateCitizen,
    isLoading,
    hasError,
    message,
    citizenIdUpdate,
    newCitizenUpdate,
  }
}

// Confirm and Mark citizen as valid household chief
export const useMarkValidHouseholdChiefApi = () => {
  const FokontanyService = useFokontanyService()
  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  const handleMarkValidHouseholdChief = (
    citizenId: number,
    payload: Partial<IMarkValidChiefDto>,
    options?: IOperationOptions,
  ) => {
    setLoading(true)
    return FokontanyService.post<IMutationResponse>(`/loharano/citizens/markchief/${citizenId}`, {
      ...payload,
    })
      .then(async (response) => {
        if ([200, 201].includes(response.status)) {
          setHasError(!response.data.success)
          options?.onSuccess?.()
          //Logging
          logEvent(currentUser, "MARK-CITIZEN-AS-VALID-CHIEF", "NULL", { citizenId, ...payload })
        } else {
          setHasError(true)
          options?.onError?.()
          // Request made and server responded.
          logEvent(currentUser, "MARK-CITIZEN-AS-VALID-CHIEF-ERROR", payload, response.data)
        }
        setLoading(false)
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded.
          logEvent(currentUser, "MARK-CITIZEN-AS-VALID-CHIEF-ERROR", payload, error.response.data)
        }
        setHasError(true)
        setLoading(false)
        options?.onError?.()
      })
  }

  return {
    handleMarkValidHouseholdChief,
    isLoading,
    hasError,
  }
}

// Find citizen by id
export const useLoadCitizenApi = () => {
  const FokontanyService = useFokontanyService()
  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)
  const [hasNetworkError, setHasNetworkError] = React.useState<boolean>(false)
  const [citizen, setCitizen] = React.useState<ICitizen>()

  const handleLoadCitizen = (citizenId: number, options?: IOperationOptions) => {
    setLoading(true)
    return FokontanyService.get<ICitizen>(`/loharano/citizens/${citizenId}`, {
      params: {
        minimize: false,
        include: "address,household",
      },
    })
      .then(async (response) => {
        if ([200, 201].includes(response.status)) {
          setHasError(false)
          setCitizen(response.data)
          //Logging
          logEvent(currentUser, "LOAD-CITIZEN-DATA", "NULL", {
            citizenId,
            include: "address,household",
          })
          options?.onSuccess?.()
        } else {
          setHasError(true)
          setCitizen(undefined)
          options?.onError?.()
          // Request made and server responded.
          logEvent(currentUser, "LOAD-CITIZEN-DATA-ERROR", { citizenId }, response.data)
        }
        setHasNetworkError(false)
        setLoading(false)
      })
      .catch((error) => {
        if (error.response) {
          setHasNetworkError(false)
          // Request made and server responded.
          logEvent(currentUser, "LOAD-CITIZEN-DATA-ERROR", { citizenId }, error.response.data)
        } else if (error.request) {
          setHasNetworkError(true)
        }
        setHasError(true)
        setCitizen(undefined)
        setLoading(false)
        options?.onError?.()
      })
  }

  return {
    handleLoadCitizen,
    citizen,
    isLoading,
    hasError,
    hasNetworkError,
  }
}

// Find houshold by id
export const useLoadHouseholdApi = () => {
  const FokontanyService = useFokontanyService()
  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)
  const [household, setHousehold] = React.useState<IHousehold>()

  const handleLoadHousehold = (id: string | number) => {
    setLoading(true)
    setHousehold(undefined)
    return FokontanyService.get<IHousehold>(`/loharano/households/${id}`, {
      params: {
        include: "address,citizens",
      },
    })
      .then(async (response) => {
        if ([200, 201].includes(response.status)) {
          setHasError(false)
          setHousehold(response.data)
          //Logging
          logEvent(currentUser, "LOAD-HOUSEHOLD-DATA", "NULL", {
            idOrBookNumber: id,
            include: "address,citizens",
          })
        } else {
          setHasError(true)
          setHousehold(undefined)
          // Request made and server responded.
          logEvent(currentUser, "LOAD-HOUSEHOLD-DATA-ERROR", { id }, response.data)
        }
        setLoading(false)
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded.
          logEvent(currentUser, "LOAD-HOUSEHOLD-DATA-ERROR", { id }, error.response.data)
        }
        setHasError(true)
        setHousehold(undefined)
        setLoading(false)
      })
  }

  return {
    handleLoadHousehold,
    household,
    setHousehold,
    isLoading: isLoading,
    hasError: hasError,
  }
}
