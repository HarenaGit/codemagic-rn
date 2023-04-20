import { createContext } from "react"

type ContextType = {
  isConnected: boolean
}

export const NetworkInfoContext = createContext<ContextType>({
  isConnected: true,
})

export default NetworkInfoContext
