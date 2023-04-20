import { useFocusEffect } from "@react-navigation/core"
import React from "react"

import { JOBS } from "../../consts"
import { useAuthContext } from "../AuthProvider"
import { useFokontanyService } from "./common"
import { useEventLoggingApi } from "./logging"

// Load provinces list
export const useProvincesListApi = (options?: IOperationOptions<IProvince>) => {
  const FokontanyService = useFokontanyService()
  const logEvent = useEventLoggingApi()
  const { currentUser } = useAuthContext()
  const [provinces, setProvinces] = React.useState<IProvince[]>([])
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  const loadProvinces = () => {
    setLoading(true)
    setProvinces([])
    return FokontanyService.get<IProvince[]>("/localization/provinces")
      .then(async (response) => {
        setLoading(false)
        if ([200, 201].includes(response.status)) {
          setHasError(false)
          setProvinces(response.data)
          //Logging
          logEvent(currentUser, "LOAD-PROVINCE-DATA", "NULL", "NULL")
          if (response.data.length > 0) {
            options?.onSuccess?.(response.data[0])
          }
        } else {
          setHasError(true)
        }
      })
      .catch((reason) => {
        setLoading(false)
        setHasError(true)
      })
  }

  return {
    isLoading,
    provinces,
    loadProvinces,
    hasError,
  }
}

// Load regions list
export const useRegionsListApi = (options?: IOperationOptions<IRegion>) => {
  const FokontanyService = useFokontanyService()
  const logEvent = useEventLoggingApi()
  const { currentUser } = useAuthContext()
  const [regions, setRegions] = React.useState<IRegion[]>([])
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  const loadRegions = (provinceId?: number) => {
    if (provinceId) {
      setLoading(true)
      setRegions([])
      return FokontanyService.get<IRegion[]>("/localization/regions", {
        params: { provinceId },
      })
        .then(async (response) => {
          setLoading(false)
          if ([200, 201].includes(response.status)) {
            setHasError(false)
            setRegions(response.data)
            //Logging
            logEvent(currentUser, "LOAD-REGION-DATA", "NULL", { provinceId })
            if (response.data.length > 0) {
              options?.onSuccess?.(response.data[0])
            }
          } else {
            setHasError(true)
          }
        })
        .catch((reason) => {
          setLoading(false)
          setHasError(true)
        })
    }
  }

  return {
    isLoading,
    regions,
    loadRegions,
    hasError,
  }
}

// Load districts list
export const useDistrictsListApi = (options?: IOperationOptions<IDistrict>) => {
  const FokontanyService = useFokontanyService()
  const logEvent = useEventLoggingApi()
  const { currentUser } = useAuthContext()
  const [districts, setDistricts] = React.useState<IDistrict[]>([])
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  const loadDistricts = (regionId?: number) => {
    if (regionId) {
      setLoading(true)
      setDistricts([])
      return FokontanyService.get<IDistrict[]>("/localization/districts", {
        params: { regionId },
      })
        .then(async (response) => {
          setLoading(false)
          if ([200, 201].includes(response.status)) {
            setHasError(false)
            setDistricts(response.data)
            //Logging
            logEvent(currentUser, "LOAD-DISTRICT-DATA", "NULL", { regionId })
            if (response.data.length > 0) {
              options?.onSuccess?.(response.data[0])
            }
          } else {
            setHasError(true)
          }
        })
        .catch((reason) => {
          setLoading(false)
          setHasError(true)
        })
    }
  }

  return {
    isLoading,
    districts,
    loadDistricts,
    hasError,
  }
}

// Load municipaities list
export const useMunicipalitiesListApi = (options?: IOperationOptions<IMunicipality>) => {
  const FokontanyService = useFokontanyService()
  const logEvent = useEventLoggingApi()
  const { currentUser } = useAuthContext()
  const [municipalities, setMunicipalities] = React.useState<IMunicipality[]>([])
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  const loadMunicipalities = (districtId?: number) => {
    if (districtId) {
      setLoading(true)
      setMunicipalities([])
      return FokontanyService.get<IMunicipality[]>("/localization/municipalities", {
        params: { districtId },
      })
        .then(async (response) => {
          setLoading(false)
          if ([200, 201].includes(response.status)) {
            setHasError(false)
            setMunicipalities(response.data)
            //Logging
            logEvent(currentUser, "LOAD-MUNICIPALITY-DATA", "NULL", { districtId })
            if (response.data.length > 0) {
              options?.onSuccess?.(response.data[0])
            }
          } else {
            setHasError(true)
          }
        })
        .catch((reason) => {
          setLoading(false)
          setHasError(true)
        })
    }
  }

  return {
    isLoading,
    municipalities,
    loadMunicipalities,
    hasError,
  }
}

// Load boroughs list
export const useBoroughsListApi = (options?: IOperationOptions<IBorough>) => {
  const FokontanyService = useFokontanyService()
  const logEvent = useEventLoggingApi()
  const { currentUser } = useAuthContext()
  const [boroughs, setBoroughs] = React.useState<IBorough[]>([])
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  const loadBoroughs = (municipalityId?: number) => {
    if (municipalityId) {
      setLoading(true)
      setBoroughs([])
      return FokontanyService.get<IBorough[]>("/localization/boroughs", {
        params: { municipalityId },
      })
        .then(async (response) => {
          setLoading(false)
          if ([200, 201].includes(response.status)) {
            setHasError(false)
            setBoroughs(response.data)
            //Logging
            logEvent(currentUser, "LOAD-BOROUGH-DATA", "NULL", { municipalityId })
            if (response.data.length > 0) {
              options?.onSuccess?.(response.data[0])
            }
          } else {
            setHasError(true)
          }
        })
        .catch((reason) => {
          setLoading(false)
          setHasError(true)
        })
    }
  }

  return {
    isLoading,
    boroughs,
    loadBoroughs,
    hasError,
  }
}

// Load fokontany list
export const useFokontaniesListApi = (options?: IOperationOptions<IFokontany>) => {
  const FokontanyService = useFokontanyService()
  const logEvent = useEventLoggingApi()
  const { currentUser } = useAuthContext()
  const [fokontanies, setFokontanies] = React.useState<IFokontany[]>([])
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  const loadFokontanies = (boroughId?: number) => {
    if (boroughId) {
      setLoading(true)
      setFokontanies([])
      return FokontanyService.get<IFokontany[]>("/localization/fokontany", {
        params: { boroughId, page: 1, size: 100 },
      })
        .then(async (response) => {
          setLoading(false)
          if ([200, 201].includes(response.status)) {
            setHasError(false)
            setFokontanies(response.data)
            //Logging
            logEvent(currentUser, "LOAD-FOKONTANY-DATA", "NULL", { boroughId })
            if (response.data.length > 0) {
              options?.onSuccess?.(response.data[0])
            }
          } else {
            setHasError(true)
          }
        })
        .catch((reason) => {
          setLoading(false)
          setHasError(true)
        })
    }
  }

  return {
    isLoading,
    fokontanies,
    loadFokontanies,
    hasError,
  }
}

// Load addresses list
export const useAddressListApi = (options?: IOperationOptions<IAddress>) => {
  const FokontanyService = useFokontanyService()
  const logEvent = useEventLoggingApi()
  const { currentUser } = useAuthContext()
  const [addresses, setAddresses] = React.useState<IAddress[]>([])
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [isFirstRequestTriggered, setFirstRequestTriggered] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)
  const [hasNetworkError, setHasNetworkError] = React.useState<boolean>(false)
  const [currentPage, setCurrentPage] = React.useState(1)

  const PAGE_SIZE = 30

  const loadAddresses = (searchPayload: IAddressSearch) => {
    setFirstRequestTriggered(true)
    setCurrentPage(searchPayload.page)
    if (searchPayload.fokontanyId) {
      setLoading(true)
      setAddresses([])
      return FokontanyService.get<IAddress[]>("/loharano/addresses", {
        params: {
          fokontanyId: searchPayload.fokontanyId,
          page: searchPayload.page,
          size: PAGE_SIZE,
          name: searchPayload.name,
        },
      })
        .then(async (response) => {
          if ([200, 201].includes(response.status)) {
            setHasError(false)
            setAddresses(response.data)
            //Logging
            logEvent(currentUser, "LOAD-ADDRESS-DATA", "NULL", searchPayload)
            if (response.data.length > 0) {
              options?.onSuccess?.(response.data[0])
            }
          } else {
            setHasError(true)
            options?.onError?.()
          }
          setLoading(false)
          setHasNetworkError(false)
        })
        .catch((error) => {
          if (error.response) {
            setHasNetworkError(false)
          } else if (error.request) {
            setHasNetworkError(true)
          }
          setHasError(true)
          setLoading(false)
          options?.onError?.()
        })
    }
  }

  return {
    PAGE_SIZE,
    currentPage,
    setCurrentPage,
    isLoading,
    addresses,
    setAddresses,
    loadAddresses,
    hasError,
    hasNetworkError,
    isFirstRequestTriggered,
  }
}

// Create new address
export const useCreateNewAddressApi = (options?: IOperationOptions<IAddress>) => {
  const FokontanyService = useFokontanyService()
  const logEvent = useEventLoggingApi()
  const { currentUser } = useAuthContext()
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)
  const [hasNetworkError, setHasNetworkError] = React.useState<boolean>(false)

  const handleCreateNewAddress = (newAddress: Partial<IAddress>) => {
    setLoading(true)
    return FokontanyService.post<ICreateNewAddress>("/loharano/addresses", {
      fokontanyId: newAddress.fokontanyId,
      name: newAddress.name,
    })
      .then(async (response) => {
        setLoading(false)
        setHasNetworkError(false)
        if ([200, 201].includes(response.status) && response.data.success) {
          setHasError(false)
          //Logging
          logEvent(currentUser, "CREATE-NEW-ADDRESS", "NULL", newAddress)
          options?.onSuccess?.(response.data.address)
        } else {
          setHasError(true)
        }
      })
      .catch((error) => {
        if (error.response) {
          setHasNetworkError(false)
        } else if (error.request) {
          setHasNetworkError(true)
        }
        setHasError(true)
        setLoading(false)
        options?.onError?.()
      })
  }

  return {
    isLoading,
    hasError,
    hasNetworkError,
    handleCreateNewAddress,
  }
}
