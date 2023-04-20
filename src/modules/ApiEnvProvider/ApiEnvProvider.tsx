import React, { useEffect, FC } from "react"
import remoteConfig from "@react-native-firebase/remote-config"

import { ApiEnv, API_CONFIGS } from "../../config"
import { version } from "../../../app.json"
import AsyncStorage from "../AsyncStorage"
import { ApiEnvContext } from "./ApiEnvContext"
interface IProps {
  children: React.ReactNode
}

const ENV_NAME_ASYNC_FIELD_KEY = `ENV_NAME_${version}`

const ApiEnvProvider: FC<IProps> = ({ children }) => {
  const [envName, setEnvName] = React.useState<ApiEnv>(ApiEnv.Dev)
  const [API_ENDPOINTS, SET_API_ENDPOINTS] = React.useState<any>(API_CONFIGS)

  // Load the last persisted env name
  const loadLastEnvName = async () => {
    const lastEnvName = await AsyncStorage.getItem(ENV_NAME_ASYNC_FIELD_KEY)
    if (lastEnvName && lastEnvName.length > 0) {
      setEnvName(lastEnvName as ApiEnv)
    }
  }

  // Load env on mount
  useEffect(() => {
    loadLastEnvName()
  }, [])

  // Set default API env
  useEffect(() => {
    // Fetch and cache for 5 minutes
    remoteConfig().fetch(300)

    remoteConfig()
      .setDefaults({
        API_ENDPOINTS: JSON.stringify(API_CONFIGS),
      })
      .then(() => remoteConfig().fetchAndActivate())
      .then((fetchedRemotely) => {
        if (fetchedRemotely) {
          console.log(fetchedRemotely)
          console.log("Configs were retrieved from the backend and activated.")

          // Load remote config from firebase
          const tmpApiEndpoints = remoteConfig().getValue("API_ENDPOINTS").asString()
          console.log("tmpApiEndpoints =====>",tmpApiEndpoints )
          SET_API_ENDPOINTS(JSON.parse(tmpApiEndpoints))
         // SET_API_ENDPOINTS(API_CONFIGS)
        } else {
          console.log(
            "No configs were fetched from the backend, and the local configs were already activated",
          )
        }
      })
  }, [])

  const ENV_ENDPOINTS = Object.keys(API_ENDPOINTS)
  return (
    <ApiEnvContext.Provider
      value={{
        envName: ENV_ENDPOINTS.includes(envName) ? envName : ENV_ENDPOINTS[0],
        envNames: ENV_ENDPOINTS,
        API_ENDPOINTS: API_ENDPOINTS,
        setEnvName: (newEnvName: ApiEnv) => {
          setEnvName(newEnvName)
          AsyncStorage.setItem(ENV_NAME_ASYNC_FIELD_KEY, newEnvName)
        },
      }}
    >
      {children}
    </ApiEnvContext.Provider>
  )
}

export default ApiEnvProvider
