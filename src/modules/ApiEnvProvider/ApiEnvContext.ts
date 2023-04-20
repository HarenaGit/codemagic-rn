import { createContext } from "react"
import { ApiEnv } from "../../config"

type ContextType = {
  envName: string
  envNames: string[]
  setEnvName: (newEnvName: ApiEnv) => void
  API_ENDPOINTS: any
}

export const ApiEnvContext = createContext<ContextType>({
  // envName: ApiEnv.Production,
  envName: ApiEnv.Dev,
  envNames: [],
  setEnvName: (newEnvName: ApiEnv) => {},
  API_ENDPOINTS: {},
})

export default ApiEnvContext
