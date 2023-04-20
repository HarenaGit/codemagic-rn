import React from "react"

import { useAuthContext } from "../AuthProvider"
import { useFokontanyService } from "./common"
import { useEventLoggingApi } from "./logging"

// Authenticate app user
export const useLoginApi = () => {
  const { setAccessToken } = useAuthContext()
  const {
    hasError: hasErrorUserInfo,
    isLoading: isLoadingUserInfo,
    handleLoadUserInfo,
  } = useUserInfoApi()

  const FokontanyService = useFokontanyService()

  const logEvent = useEventLoggingApi()
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  const handleLogin = (payload: ILoginPayload, successCallback: () => void) => {
    setLoading(true)
    return FokontanyService.post<ILoginResponse>("/auth/login", {
      username: payload.username.trim(),
      password: payload.password.trim(),
    })
      .then(async (response) => {
        setLoading(false)
        if ([200, 201].includes(response.status)) {
          setHasError(false)

          //Logging
          logEvent(null, "AUTHENTICATE-USER", "NULL", payload)

          // Update access token
          await setAccessToken(response.data.access_token)

          // Load user info
          await handleLoadUserInfo()
          successCallback()
        } else setHasError(true)
      })
      .catch((reason) => {
        console.log(reason)
        if (reason.response) {
          console.log(reason.response.data)
        } else if (reason.request) {
          console.log(reason.request)
        }
        setLoading(false)
        setHasError(true)
      })
  }

  return {
    isLoading: isLoading || isLoadingUserInfo,
    handleLogin,
    hasError: hasError || hasErrorUserInfo,
  }
}

// Load info about authenticated user
export const useUserInfoApi = () => {
  const { setCurrentUser, currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()
  const FokontanyService = useFokontanyService()
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  const handleLoadUserInfo = () => {
    setLoading(true)
    return FokontanyService.get<IUserInfo>("/auth/userinfo")
      .then((response) => {
        setLoading(false)
        if ([200, 201].includes(response.status)) {
          setHasError(false)
          setCurrentUser(response.data)

          //Logging
          logEvent(response.data, "LOAD-USER-INFO", "NULL", response.data)
        } else setHasError(true)
      })
      .catch((reason) => {
        setLoading(false)
        setHasError(true)
      })
  }

  return {
    isLoading,
    handleLoadUserInfo,
    hasError,
    userInfo: currentUser,
  }
}
