import React, { useEffect, FC } from "react"

import { releaseName } from "../../../app.json"
import { ACCESS_TOKEN_KEY } from "../../consts"
import AsyncStorage from "../AsyncStorage"
import { AuthContext } from "./AuthContext"
interface IProps {
  children: React.ReactNode
}

const AUTH_ASYNC_FIELD_KEY = `AUTH_USER_${releaseName}`

const AuthProvider: FC<IProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState<IUserInfo | null>()

  // Load the last logged in user
  const loadLastUser = async () => {
    const lastUserData = await AsyncStorage.getItem(AUTH_ASYNC_FIELD_KEY)
    if (lastUserData && lastUserData.length > 0) {
      setCurrentUser(JSON.parse(lastUserData))
    }
  }

  // Update locale on mount
  useEffect(() => {
    loadLastUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser: (newUser?: IUserInfo | null) => {
          setCurrentUser(newUser)
          if (newUser)
            AsyncStorage.setItem(AUTH_ASYNC_FIELD_KEY, newUser ? JSON.stringify(newUser) : "")
          else {
            AsyncStorage.removeItem(AUTH_ASYNC_FIELD_KEY)
            AsyncStorage.removeItem(ACCESS_TOKEN_KEY)
          }
        },
        setAccessToken: async (access_token?: string): Promise<void> => {
          if (access_token) await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access_token)
          else await AsyncStorage.removeItem(ACCESS_TOKEN_KEY)
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
