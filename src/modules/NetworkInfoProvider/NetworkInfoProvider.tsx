import React, { useEffect, FC } from "react"
import NetInfo from "@react-native-community/netinfo"

import { NetworkInfoContext } from "./NetworkInfoContext"

interface IProps {
  children: React.ReactNode
}

const NetworkInfoProvider: FC<IProps> = ({ children }) => {
  const [isConnected, setConnected] = React.useState<boolean>(false)

  useEffect(() => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected)
    })
    return () => {
      // Unsubscribe
      unsubscribe()
    }
  }, [])

  return (
    <NetworkInfoContext.Provider
      value={{
        isConnected,
      }}
    >
      {children}
    </NetworkInfoContext.Provider>
  )
}

export default NetworkInfoProvider
