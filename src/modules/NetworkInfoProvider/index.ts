import { useContext } from "react"
import NetworkInfoContext from "./NetworkInfoContext"
import NetworkInfoProvider from "./NetworkInfoProvider"

export const useNetworkInfoContext = () => useContext(NetworkInfoContext)
export default NetworkInfoProvider
